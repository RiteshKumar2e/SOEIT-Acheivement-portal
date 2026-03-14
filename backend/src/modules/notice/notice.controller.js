const Notice = require('../notice/notice.model');
const User = require('../user/user.model');
const Notification = require('../notification/notification.model');
const sendEmail = require('../../utils/sendEmail');
const getEmailTemplate = require('../../utils/emailTemplates');
const { clearCache } = require('../../utils/cache');

// @desc    Create new notice
// @route   POST /api/notices
// @access  Private (Admin/Faculty)
exports.createNotice = async (req, res, next) => {
    try {
        const { title, content, priority } = req.body;

        const notice = await Notice.create({ title, content, priority, createdBy: req.user.id });

        const students = await User.find({ role: 'student', isActive: true });
        
        // Create in-app notifications
        const notifications = students.map(s => ({
            user: s.id,
            type: 'notice',
            title: `New Notice: ${title}`,
            message: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
            link: '/dashboard'
        }));
        await Notification.createMany(notifications);

        let studentEmails = students.map(s => s.email);

        if (!studentEmails.includes('riteshkumar90359@gmail.com')) {
            studentEmails.push('riteshkumar90359@gmail.com');
        }

        if (studentEmails.length > 0) {
            sendEmail({
                to: studentEmails.join(','),
                subject: `OFFICIAL NOTICE: ${title}`,
                message: `Hello Students,\n\nA new official notice has been posted: ${title}.\n\nPriority: ${priority}\nContent: ${content}\n\nPlease login to the SOEIT portal to view more details.\n\nBest Regards,\nSOEIT Administration`,
                html: getEmailTemplate({
                    title: `Official Notice: ${title}`,
                    content: `
                        <h1 class="h1">Official Academic Notice</h1>
                        <p class="p">The following departmental notification has been issued to all Students:</p>
                        
                        <div style="background: #ffffff; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0; border-top: 5px solid ${priority === 'Urgent' ? '#ef4444' : '#002147'};">
                            <h3 style="margin-top: 0; color: #1e293b; font-size: 18px;">${title}</h3>
                            <div style="margin-bottom: 15px;">
                                <span class="badge ${priority === 'Urgent' ? 'badge-error' : 'badge-info'}">${priority} Priority</span>
                            </div>
                            <div style="color: #334155; line-height: 1.7; font-size: 15px;">
                                ${content.replace(/\n/g, '<br>')}
                            </div>
                        </div>

                        <p class="p">Please take necessary action accordingly. Full documentation and related attachments are available on the portal.</p>
                    `,
                    actionUrl: `${process.env.CLIENT_URL || 'https://soeit-ritesh.onrender.com'}/login`,
                    actionText: 'View Circular Details',
                    footerText: 'This is an official institutional circular from SOEIT Administration. Mandatory attention is advised.'
                }),
            }).catch(err => console.error('Notice Email failed:', err));
        }

        // Invalidate cache
        clearCache('/api/notices');

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
        
        // Invalidate cache
        clearCache('/api/notices');

        res.status(200).json({ success: true, message: 'Notice deleted' });
    } catch (error) {
        next(error);
    }
};
