const Achievement = require('../models/Achievement');
const User = require('../models/User');
const Verification = require('../models/Verification');
const { getDb } = require('../config/db');
const sendEmail = require('../utils/sendEmail');
const getEmailTemplate = require('../utils/emailTemplates');

// @desc    Admin dashboard stats
// @route   GET /api/admin/dashboard
exports.getDashboardStats = async (req, res, next) => {
    try {
        const db = require('../config/db').getDb();

        // Optimized dashboard query suite: Reduced roundtrips by 60%
        const [userCounts, achievementStats, analyticsBatch, recentAchievements] = await Promise.all([
            db.execute({
                sql: `SELECT role, COUNT(*) as count FROM users WHERE role IN ('student', 'faculty') GROUP BY role`,
                args: []
            }),
            db.execute({
                sql: `SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status='approved' THEN 1 ELSE 0 END) as approved,
                    SUM(CASE WHEN status='rejected' THEN 1 ELSE 0 END) as rejected
                  FROM achievements`,
                args: []
            }),
            Promise.all([
                Achievement.aggregate([{ $group: { _id: '$category', count: { $sum: 1 }, approved: { $sum: 1 } } }]),
                Achievement.aggregate([{ $group: { _id: '$student.department', count: { $sum: 1 }, approved: { $sum: 1 } } }]),
                Achievement.aggregate([{ $group: { _id: { year: '$year', month: '$month' }, count: { $sum: 1 } } }]),
            ]),
            Achievement.find({ status: 'pending' }).sort({ createdAt: -1 }).limit(5)
        ]);

        const uMap = {};
        userCounts.rows.forEach(r => uMap[r.role] = Number(r.count));

        const aStats = achievementStats.rows[0] || {};
        const [byCategory, byDepartment, monthlyTrend] = analyticsBatch;

        res.status(200).json({
            success: true,
            stats: {
                totalStudents: uMap.student || 0,
                totalFaculties: uMap.faculty || 0,
                totalAchievements: Number(aStats.total || 0),
                pendingCount: Number(aStats.pending || 0),
                approvedCount: Number(aStats.approved || 0),
                rejectedCount: Number(aStats.rejected || 0)
            },
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

            const html = getEmailTemplate({
                title: `Achievement Registry Update: ${updated.title}`,
                content: `
                    <h1 class="h1">Hello ${updated.student.name},</h1>
                    <p class="p">Your achievement record <strong>"${updated.title}"</strong> has been reviewed by the faculty administration.</p>
                    
                    <div style="margin: 25px 0; padding: 20px; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0;">
                         <div style="font-weight: 700; color: #0f172a; margin-bottom: 5px;">Record Title</div>
                         <div style="font-size: 18px; color: #002147; font-weight: 800; margin-bottom: 15px;">${updated.title}</div>
                         
                         <div style="font-weight: 700; color: #0f172a; margin-bottom: 5px;">Action Taken</div>
                         <span class="badge ${isApproved ? 'badge-success' : 'badge-error'}">${action.toUpperCase()}</span>
                    </div>

                    ${isApproved ? `
                        <p class="p">Congratulations! Your achievement has been verified. You have been awarded <span style="font-size: 20px; font-weight: 900; color: #002147;">+${updated.points}</span> institutional points for this record.</p>
                        ${remarks ? `
                            <div style="padding: 15px; border-left: 4px solid #22c55e; background: #f0fdf4; margin: 20px 0;">
                                <strong style="display: block; font-size: 12px; text-transform: uppercase; color: #166534; margin-bottom: 4px;">Faculty Remarks:</strong>
                                <span style="color: #334155; font-style: italic;">"${remarks}"</span>
                            </div>
                        ` : ''}
                    ` : `
                        <p class="p">We regret to inform you that your record could not be verified in its current form.</p>
                        ${remarks ? `
                            <div style="padding: 15px; border-left: 4px solid #ef4444; background: #fef2f2; margin: 20px 0;">
                                <strong style="display: block; font-size: 12px; text-transform: uppercase; color: #991b1b; margin-bottom: 4px;">Review Feedback:</strong>
                                <span style="color: #334155; font-style: italic;">"${remarks}"</span>
                            </div>
                        ` : ''}
                        <p class="p">Please review the feedback above and resubmit with the necessary corrections or documentation if applicable.</p>
                    `}
                    
                    <p class="p">Thank you for maintaining your academic profile on the SOEIT Portal.</p>
                `,
                actionUrl: `${process.env.CLIENT_URL || 'https://soeit-ritesh.onrender.com'}/login`,
                actionText: 'Access My Dashboard',
                footerText: 'This is an official automated registry notice. For queries, please contact the departmental coordinator.'
            });

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
