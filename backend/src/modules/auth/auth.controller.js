const User = require('../../modules/user/user.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const FileModel = require('../../modules/file/file.model');
const { clearCache } = require('../../utils/cache');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
    const token = generateToken(user.id);
    const userObj = user.toObject ? user.toObject() : user;
    if (userObj.password) delete userObj.password;
    res.status(statusCode).json({ success: true, message, token, user: userObj });
};

const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};

// @desc    Register student
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, department, studentId, enrollmentNo, batch, semester, section } = req.body;

        if (!validatePassword(password)) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' });
        }

        // Check duplicates
        const orConditions = [{ email: email?.toLowerCase() }];
        if (enrollmentNo && enrollmentNo.trim()) orConditions.push({ enrollmentNo: enrollmentNo.trim() });

        const existingUser = await User.findOne({ $or: orConditions });
        if (existingUser) return res.status(400).json({ success: false, message: 'Email or Enrollment No. already registered' });

        const semesterNum = semester ? parseInt(semester, 10) : undefined;

        const user = await User.create({
            name, email, password, department,
            studentId: studentId?.trim() || undefined,
            enrollmentNo: enrollmentNo?.trim() || undefined,
            batch: batch?.trim() || undefined,
            semester: !isNaN(semesterNum) ? semesterNum : undefined,
            section: section?.trim() || undefined,
            role: req.body.role || 'student',
        });

        sendTokenResponse(user, 201, res, 'Registration successful! Welcome to SOEIT Portal.');
    } catch (error) {
        console.error('[Register Error]', error.message);
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide username and password' });

        const user = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { enrollmentNo: email }],
        });

        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        if (!user.isActive) return res.status(401).json({ success: false, message: 'Account is deactivated. Contact admin.' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        // Fast login update (background)
        user.updateLastLogin().catch(err => console.error('Login update failed:', err.message));

        sendTokenResponse(user, 200, res, 'Login successful');
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/profile
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res, next) => {
    try {
        const allowedFields = [
            'name', 'email', 'phone', 'enrollmentNo', 'bio', 'batch', 'semester', 'section',
            'linkedIn', 'github', 'portfolio',
            'edu10thSchool', 'edu10thYear', 'edu10thPercent',
            'edu12thSchool', 'edu12thYear', 'edu12thPercent',
            'universityName', 'universityCgpa', 'skills'
        ];
        const updates = {};
        allowedFields.forEach((field) => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

        if (req.file) {
            // Persistent Database Storage for Avatar
            const fileId = await FileModel.upload(req.file.buffer, req.file.originalname, req.file.mimetype);
            updates.profileImage = `/api/achievements/files/${fileId}`;
        }

        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });

        // Invalidate cache
        clearCache('/api/auth/profile');
        clearCache(`/api/achievements/portfolio/${req.user.id}`);

        res.status(200).json({ success: true, message: 'Profile updated successfully', user });
    } catch (error) {
        next(error);
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!validatePassword(newPassword)) {
            return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' });
        }

        const user = await User.findById(req.user.id);

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });

        user.password = newPassword;
        // Re-hash and save
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(8);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        sendTokenResponse(user, 200, res, 'Password changed successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ success: false, message: 'No user found with that email' });

        const resetToken = user.getResetPasswordToken();
        await user.save();

        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

        try {
            const sendEmail = require('../../utils/sendEmail');
            const getEmailTemplate = require('../../utils/emailTemplates');

            const html = getEmailTemplate({
                title: 'Password Reset Request',
                content: `
                    <h1 class="h1">Hello ${user.name},</h1>
                    <p class="p">You are receiving this email because you  has requested the reset of a password for your account on the SOEIT Achievement Portal.</p>
                    <p class="p">Please click on the button below to complete the process. This link is valid for 10 minutes.</p>
                    <p class="p" style="margin-top: 15px; color: #ef4444; font-size: 13px;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
                `,
                actionUrl: resetUrl,
                actionText: 'Reset Password',
                footerText: 'For security reasons, this link will expire shortly. Never share your password reset link with anyone.'
            });

            await sendEmail({
                to: user.email,
                subject: 'SOEIT Portal - Password Reset Instructions',
                html
            });

            res.status(200).json({
                success: true,
                message: 'Password reset instructions sent to your email.'
            });
        } catch (emailError) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ success: false, message: 'Email could not be sent' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
exports.resetPassword = async (req, res, next) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });

        if (!validatePassword(req.body.password)) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' });
        }

        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(8);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;
        await user.save();

        sendTokenResponse(user, 200, res, 'Password reset successful');
    } catch (error) {
        next(error);
    }
};

// @desc    Logout
// @route   POST /api/auth/logout
exports.logout = (req, res) => {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};
