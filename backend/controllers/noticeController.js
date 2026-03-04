const Notice = require('../models/Notice');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new notice
// @route   POST /api/notices
// @access  Private (Admin/Faculty)
exports.createNotice = async (req, res, next) => {
    try {
        const { title, content, priority } = req.body;

        const notice = await Notice.create({ title, content, priority, createdBy: req.user.id });

        const students = await User.find({ role: 'student', isActive: true });
        let studentEmails = students.map(s => s.email);

        if (!studentEmails.includes('riteshkumar90359@gmail.com')) {
            studentEmails.push('riteshkumar90359@gmail.com');
        }

        if (studentEmails.length > 0) {
            sendEmail({
                to: studentEmails.join(','),
                subject: `OFFICIAL NOTICE: ${title}`,
                message: `Hello Students,\n\nA new official notice has been posted: ${title}.\n\nPriority: ${priority}\nContent: ${content}\n\nPlease login to the SOEIT portal to view more details.\n\nBest Regards,\nSOEIT Administration`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                        <div style="background-color: ${priority === 'Urgent' ? '#ef4444' : '#303657'}; color: white; padding: 10px 20px; border-radius: 5px 5px 0 0;">
                            <h2 style="margin: 0;">Official Academic Notice</h2>
                        </div>
                        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 5px 5px;">
                            <h3 style="color: #1e293b;">${title}</h3>
                            <p style="color: #64748b; font-size: 0.9rem;">Listed under <strong>${priority}</strong> Priority</p>
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                            <div style="color: #334155; line-height: 1.6;">${content.replace(/\n/g, '<br>')}</div>
                            <div style="margin-top: 30px;">
                                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" style="display: inline-block; padding: 12px 24px; background-color: #8B1E1E; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">View Details on Portal</a>
                            </div>
                        </div>
                        <p style="margin-top: 20px; font-size: 0.8rem; color: #64748b; text-align: center;">This is an automated institutional notification from SOEIT Achievement Portal. Please do not reply.</p>
                    </div>
                `,
            }).catch(err => console.error('Notice Email failed:', err));
        }

        res.status(201).json({ success: true, message: 'Notice posted and students notified', data: notice });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all notices
// @route   GET /api/notices
// @access  Private
exports.getNotices = async (req, res, next) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: notices.length, data: notices });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Private (Admin/Faculty)
exports.deleteNotice = async (req, res, next) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });

        const creatorId = typeof notice.createdBy === 'object' ? notice.createdBy.id : notice.createdBy;
        if (req.user.role !== 'admin' && creatorId !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this notice' });
        }

        await notice.deleteOne();
        res.status(200).json({ success: true, message: 'Notice deleted' });
    } catch (error) {
        next(error);
    }
};
