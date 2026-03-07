const Achievement = require('../models/Achievement');
const User = require('../models/User');
const Verification = require('../models/Verification');
const { getDb } = require('../config/db');
const sendEmail = require('../utils/sendEmail');

// @desc    Admin dashboard stats
// @route   GET /api/admin/dashboard
exports.getDashboardStats = async (req, res, next) => {
    try {
        const [totalStudents, totalFaculties, totalAchievements, pendingCount, approvedCount, rejectedCount] = await Promise.all([
            User.countDocuments({ role: 'student' }),
            User.countDocuments({ role: 'faculty' }),
            Achievement.countDocuments(),
            Achievement.countDocuments({ status: 'pending' }),
            Achievement.countDocuments({ status: 'approved' }),
            Achievement.countDocuments({ status: 'rejected' }),
        ]);

        const [byCategory, byDepartment, monthlyTrend] = await Promise.all([
            Achievement.aggregate([
                { $group: { _id: '$category', count: { $sum: 1 }, approved: { $sum: 1 } } },
            ]),
            Achievement.aggregate([
                { $group: { _id: '$student.department', count: { $sum: 1 }, approved: { $sum: 1 } } },
            ]),
            Achievement.aggregate([
                { $group: { _id: { year: '$year', month: '$month' }, count: { $sum: 1 } } },
            ]),
        ]);

        const recentAchievements = await Achievement.find({ status: 'pending' })
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            stats: { totalStudents, totalFaculties, totalAchievements, pendingCount, approvedCount, rejectedCount },
            byCategory, byDepartment, monthlyTrend, recentAchievements,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all pending achievements for verification
// @route   GET /api/admin/achievements/pending
exports.getPendingAchievements = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, category, department, search } = req.query;
        const db = getDb();
        let sql = `
            SELECT
                a.*,
                u.name        AS student_name,
                u.email       AS student_email,
                u.department  AS student_department,
                u.student_id  AS student_student_id,
                u.profile_image AS student_profile_image
            FROM achievements a
            LEFT JOIN users u ON a.student_id = u.id
            WHERE a.status = 'pending'
        `;
        const args = [];

        if (department) { sql += ' AND u.department = ?'; args.push(department); }
        if (category) { sql += ' AND a.category = ?'; args.push(category); }
        if (search) {
            sql += ' AND (a.title LIKE ? OR u.name LIKE ? OR u.enrollment_no LIKE ?)';
            args.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        // Count
        const countRes = await db.execute({
            sql: sql.replace('a.*, u.name AS student_name, u.email AS student_email, u.department AS student_department, u.student_id AS student_student_id, u.profile_image AS student_profile_image', 'COUNT(*) AS cnt'),
            args,
        });
        const total = Number(countRes.rows[0]?.cnt || 0);

        sql += ` ORDER BY a.created_at DESC LIMIT ? OFFSET ?`;
        args.push(parseInt(limit), (page - 1) * parseInt(limit));

        const res2 = await db.execute({ sql, args });

        // Shape data like old populate
        const data = res2.rows.map(row => ({
            _id: row.id, id: row.id,
            title: row.title, category: row.category,
            description: row.description, level: row.level,
            date: row.date, status: row.status, remarks: row.remarks,
            points: row.points, certificateUrl: row.certificate_url,
            proofFiles: (() => { try { return JSON.parse(row.proof_files || '[]'); } catch { return []; } })(),
            createdAt: row.created_at, updatedAt: row.updated_at,
            student: {
                _id: row.student_id, id: row.student_id,
                name: row.student_name, email: row.student_email,
                department: row.student_department,
                studentId: row.student_student_id,
                profileImage: row.student_profile_image || '',
            },
        }));

        res.status(200).json({ success: true, total, page: parseInt(page), pages: Math.ceil(total / limit), data });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify (approve/reject) achievement
// @route   PUT /api/admin/achievements/:id/verify
exports.verifyAchievement = async (req, res, next) => {
    try {
        const { action, remarks } = req.body;
        if (!['approved', 'rejected'].includes(action)) {
            return res.status(400).json({ success: false, message: 'Action must be approved or rejected' });
        }

        const achievement = await Achievement.findById(req.params.id);
        if (!achievement) return res.status(404).json({ success: false, message: 'Achievement not found' });

        const previousStatus = achievement.status;

        await Achievement.findByIdAndUpdate(req.params.id, {
            status: action,
            remarks: remarks || '',
            verifiedBy: req.user.id,
            verifiedAt: new Date(),
        }, { new: false });

        await Verification.create({
            achievementId: achievement.id,
            verifiedBy: req.user.id,
            action, remarks, previousStatus, newStatus: action,
        });

        const updated = await Achievement.findById(req.params.id);

        // Sending verification email to student
        if (updated && updated.student && updated.student.email) {
            const isApproved = action === 'approved';

            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        .email-container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #1a202c; }
                        .header { background: linear-gradient(135deg, #002147 0%, #003366 100%); color: white; padding: 30px; text-align: center; }
                        .content { padding: 30px; line-height: 1.6; }
                        .status-box { padding: 15px 20px; border-radius: 8px; font-weight: bold; display: inline-block; margin: 20px 0; }
                        .status-approved { background-color: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
                        .status-rejected { background-color: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
                        .achievement-title { font-size: 1.25rem; font-weight: 800; color: #2d3748; margin-top: 10px; }
                        .footer { background-color: #f7fafc; padding: 20px; text-align: center; font-size: 0.875rem; color: #718096; border-top: 1px solid #e2e8f0; }
                        .points { font-size: 1.5rem; font-weight: 900; color: #002147; }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="header">
                            <h2 style="margin: 0; letter-spacing: 0.05em;">SOEIT ACHIEVEMENT PORTAL</h2>
                        </div>
                        <div class="content">
                            <p>Dear <strong>${updated.student.name}</strong>,</p>
                            <p>We are pleased to inform you that your achievement record has been reviewed by the faculty administration.</p>
                            
                            <div class="achievement-title">${updated.title}</div>
                            
                            <div class="status-box ${isApproved ? 'status-approved' : 'status-rejected'}">
                                Status: ${action.toUpperCase()}
                            </div>

                            ${isApproved ? `
                                <p>Congratulations! Your achievement has been verified. You have been awarded <span class="points">+${updated.points}</span> institutional points for this record.</p>
                                ${remarks ? `<p style="padding: 10px; border-left: 4px solid #bbf7d0; background: #f0fdf4; font-style: italic;"><strong>Faculty Note:</strong> ${remarks}</p>` : ''}
                            ` : `
                                <p>We regret to inform you that your record could not be verified at this time.</p>
                                ${remarks ? `<p style="padding: 10px; border-left: 4px solid #fecaca; background: #fef2f2; font-style: italic;"><strong>Feedback:</strong> ${remarks}</p>` : ''}
                                <p>Please review the feedback and resubmit with the correct documentation if necessary.</p>
                            `}

                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${process.env.CLIENT_URL || 'https://soeit-acheivement-portal.vercel.app/'}/login" style="display: inline-block; padding: 14px 28px; background: #002147; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Login to Your Dashboard</a>
                            </div>

                            <p>Thank you for contributing to the academic excellence of SOEIT.</p>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} School of Engineering & IT (SOEIT). All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

            try {
                await sendEmail({
                    to: updated.student.email,
                    subject: `Achievement Registry Update: ${updated.title}`,
                    message: `Hi ${updated.student.name}, your achievement "${updated.title}" has been ${action}.`,
                    html
                });
            } catch (emailError) {
                console.error('Email notification failed:', emailError);
                // We don't fail the request if email sending fails
            }
        }

        res.status(200).json({ success: true, message: `Achievement ${action} successfully`, data: updated });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all achievements (admin)
// @route   GET /api/admin/achievements
exports.getAllAchievements = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status, category, department, search } = req.query;
        const db = getDb();
        let sql = `
            SELECT
                a.*,
                u.name        AS student_name,
                u.email       AS student_email,
                u.department  AS student_department,
                u.student_id  AS student_student_id,
                u.profile_image AS student_profile_image
            FROM achievements a
            LEFT JOIN users u ON a.student_id = u.id
            WHERE 1=1
        `;
        const args = [];

        if (status) { sql += ' AND a.status = ?'; args.push(status); }
        if (department) { sql += ' AND u.department = ?'; args.push(department); }
        if (category) { sql += ' AND a.category = ?'; args.push(category); }
        if (search) {
            sql += ' AND (a.title LIKE ? OR u.name LIKE ? OR u.enrollment_no LIKE ?)';
            args.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        const countRes = await db.execute({
            sql: sql.replace(/SELECT[\s\S]*?FROM achievements/, 'SELECT COUNT(*) AS cnt FROM achievements'),
            args,
        });
        const total = Number(countRes.rows[0]?.cnt || 0);

        sql += ` ORDER BY a.created_at DESC LIMIT ? OFFSET ?`;
        args.push(parseInt(limit), (page - 1) * parseInt(limit));

        const res2 = await db.execute({ sql, args });

        const data = res2.rows.map(row => ({
            _id: row.id, id: row.id,
            title: row.title, category: row.category,
            description: row.description, level: row.level,
            date: row.date, status: row.status, remarks: row.remarks,
            points: row.points, certificateUrl: row.certificate_url,
            proofFiles: (() => { try { return JSON.parse(row.proof_files || '[]'); } catch { return []; } })(),
            createdAt: row.created_at, updatedAt: row.updated_at,
            student: {
                _id: row.student_id, id: row.student_id,
                name: row.student_name, email: row.student_email,
                department: row.student_department,
                studentId: row.student_student_id,
                profileImage: row.student_profile_image || '',
            },
        }));

        res.status(200).json({ success: true, total, page: parseInt(page), pages: Math.ceil(total / limit), data });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all students
// @route   GET /api/admin/students
exports.getStudents = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, department, search, batch, semester, section } = req.query;
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.max(1, parseInt(limit) || 10);

        const query = { role: 'student', isActive: true };
        if (department) query.department = department;
        if (batch) query.batch = batch;
        if (semester) query.semester = parseInt(semester);
        if (section) query.section = section;
        if (search) {
            query.$or = [
                { name: { $regex: search } }, { email: { $regex: search } },
                { studentId: { $regex: search } }, { enrollmentNo: { $regex: search } },
            ];
        }

        const total = await User.countDocuments(query);
        const students = await User.find(query).sort({ name: 1 }).skip((pageNum - 1) * limitNum).limit(limitNum);

        // Attach achievement counts
        const enriched = await Promise.all(students.map(async (student) => {
            const [total, approved, pending] = await Promise.all([
                Achievement.countDocuments({ studentId: student.id }),
                Achievement.countDocuments({ studentId: student.id, status: 'approved' }),
                Achievement.countDocuments({ studentId: student.id, status: 'pending' }),
            ]);
            const pointsRes = await Achievement.aggregate([
                { $match: { studentId: student.id, status: 'approved' } },
                { $group: { _id: null, total: { $sum: '$points' } } },
            ]);
            const s = student.toObject ? student.toObject() : { ...student };
            delete s.password;
            return { ...s, achievementCounts: { total, approved, pending, points: pointsRes[0]?.total || 0 } };
        }));

        res.status(200).json({ success: true, total, page: pageNum, pages: Math.ceil(total / limitNum), data: enriched });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all faculty members
// @route   GET /api/admin/faculty
exports.getFaculty = async (req, res, next) => {
    try {
        const { search } = req.query;
        const query = { role: 'faculty' };
        if (search) {
            query.$or = [
                { name: { $regex: search } }, { email: { $regex: search } },
            ];
        }
        const faculty = await User.find(query).sort({ name: 1 });
        const data = faculty.map(f => {
            const obj = f.toObject ? f.toObject() : { ...f };
            delete obj.password;
            return obj;
        });
        res.status(200).json({ success: true, count: data.length, data });
    } catch (error) {
        next(error);
    }
};

// @desc    Get reports and analytics
// @route   GET /api/admin/reports
exports.getReports = async (req, res, next) => {
    try {
        const [categoryStats, levelStats, departmentStats, topPerformers, monthlyTrend] = await Promise.all([
            Achievement.aggregate([
                { $match: { status: 'approved' } },
                { $group: { _id: '$category', count: { $sum: 1 }, points: { $sum: 1 } } },
            ]),
            Achievement.aggregate([
                { $match: { status: 'approved' } },
                { $group: { _id: '$level', count: { $sum: 1 } } },
            ]),
            Achievement.aggregate([
                { $match: { status: 'approved' } },
                { $group: { _id: '$student.department', count: { $sum: 1 }, points: { $sum: 1 } } },
            ]),
            Achievement.aggregate([
                { $match: { status: 'approved' } },
                { $group: { _id: '$studentId', totalPoints: { $sum: '$points' }, achievementCount: { $sum: 1 } } },
            ]),
            Achievement.aggregate([
                { $group: { _id: { year: '$year', month: '$month' }, submitted: { $sum: 1 }, approved: { $sum: 1 } } },
            ]),
        ]);

        res.status(200).json({ success: true, categoryStats, levelStats, departmentStats, topPerformers, monthlyTrend });
    } catch (error) {
        next(error);
    }
};

// @desc    Manage users (activate/deactivate)
// @route   PUT /api/admin/users/:id
exports.manageUser = async (req, res, next) => {
    try {
        const { isActive, role } = req.body;
        const updates = {};
        if (isActive !== undefined) updates.isActive = isActive;
        if (role && req.user.role === 'admin') updates.role = role;

        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const userObj = user.toObject ? user.toObject() : { ...user };
        delete userObj.password;
        res.status(200).json({ success: true, message: 'User updated successfully', user: userObj });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete users (selective/bulk)
// @route   DELETE /api/admin/users
exports.deleteUsers = async (req, res, next) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) return res.status(400).json({ success: false, message: 'Invalid identifiers provided' });

        await User.deleteMany(ids);
        res.status(200).json({ success: true, message: `${ids.length} scholar records purged from registry` });
    } catch (error) {
        next(error);
    }
};
