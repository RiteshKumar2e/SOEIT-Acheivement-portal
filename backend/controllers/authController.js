const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
    const token = generateToken(user._id);
    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;
    res.status(statusCode).json({ success: true, message, token, user: userObj });
};

// @desc    Register student
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, department, studentId, enrollmentNo, batch, semester, section } = req.body;

        // Build duplicate-check query — only include enrollmentNo when provided
        const orConditions = [{ email: email?.toLowerCase() }];
        if (enrollmentNo && enrollmentNo.trim()) {
            orConditions.push({ enrollmentNo: enrollmentNo.trim() });
        }
        const existingUser = await User.findOne({ $or: orConditions });
        if (existingUser) return res.status(400).json({ success: false, message: 'Email or Enrollment No. already registered' });

        // Coerce semester to Number; schema requires Number (min 1 – max 8)
        const semesterNum = semester ? parseInt(semester, 10) : undefined;

        const user = await User.create({
            name,
            email,
            password,
            department,
            studentId: studentId?.trim() || undefined,
            enrollmentNo: enrollmentNo?.trim() || undefined,
            batch: batch?.trim() || undefined,
            semester: !isNaN(semesterNum) ? semesterNum : undefined,
            section: section?.trim() || undefined,
            role: 'student',
        });
        sendTokenResponse(user, 201, res, 'Registration successful! Welcome to SOEIT Portal.');
    } catch (error) {
        console.error('[Register Error]', error.message, error.errors ?? '');
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body; // email field here acts as "Username" (email or enrollmentNo)
        if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide username and password' });

        // Find user by email OR enrollmentNo
        const user = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { enrollmentNo: email }
            ]
        }).select('+password');

        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        if (!user.isActive) return res.status(401).json({ success: false, message: 'Account is deactivated. Contact admin.' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });
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
        const allowedFields = ['name', 'phone', 'bio', 'batch', 'semester', 'section', 'linkedIn', 'github', 'portfolio'];
        const updates = {};
        allowedFields.forEach((field) => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

        if (req.file) updates.profileImage = `/uploads/profiles/${req.file.filename}`;

        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
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
        const user = await User.findById(req.user.id).select('+password');
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });

        user.password = newPassword;
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
        await user.save({ validateBeforeSave: false });

        // In production, send email. For now, return token in response.
        res.status(200).json({
            success: true,
            message: 'Password reset token generated',
            resetToken, // Remove this in production - only send via email
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
exports.resetPassword = async (req, res, next) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
        const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
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
