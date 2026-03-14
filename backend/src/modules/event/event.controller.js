const Event = require('../event/event.model');
const User = require('../user/user.model');
const Notification = require('../notification/notification.model');
const sendEmail = require('../../utils/sendEmail');
const getEmailTemplate = require('../../utils/emailTemplates');
const { clearCache } = require('../../utils/cache');

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin/Faculty)
exports.createEvent = async (req, res, next) => {
    try {
        const { title, description, category, date, venue, registrationLink } = req.body;

        const event = await Event.create({
            title, description, category, date, venue,
            registrationLink,
            createdBy: req.user.id,
        });

        // Get all students to notify
        const students = await User.find({ role: 'student', isActive: true });

        // Create in-app notifications
        const notifications = students.map(s => ({
            user: s.id,
            type: 'event',
            title: `New Event: ${title}`,
            message: `New event scheduled for ${new Date(date).toLocaleDateString()} at ${venue}`,
            link: '/events'
        }));
        await Notification.createMany(notifications);

        let studentEmails = students.map(s => s.email);

        if (!studentEmails.includes('riteshkumar90359@gmail.com')) {
            studentEmails.push('riteshkumar90359@gmail.com');
        }

        if (studentEmails.length > 0) {
            sendEmail({
                to: studentEmails.join(','),
                subject: `New Event: ${title}`,
                message: `Hello Students,\n\nA new event has been added: ${title}.\n\nCategory: ${category}\nVenue: ${venue}\nDate: ${new Date(date).toLocaleDateString()}\n\nPlease login to the SOEIT portal to view more details.\n\nBest Regards,\nSOEIT Portal`,
                html: getEmailTemplate({
                    title: `New Event: ${title}`,
                    content: `
                        <h1 class="h1">New Academic Event Published!</h1>
                        <p class="p">Hello Students, a new event has been added to the portal that might interest you:</p>
                        
                        <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0;">
                            <h3 style="margin-top: 0; color: #002147; font-size: 20px;">${title}</h3>
                            <div style="margin-bottom: 15px;">
                                <span class="badge badge-info">${category}</span>
                            </div>
                            <p style="margin: 5px 0; color: #475569;"><strong>Venue:</strong> ${venue}</p>
                            <p style="margin: 5px 0; color: #475569;"><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <div style="margin-top: 15px; font-size: 14px; color: #64748b; line-height: 1.5;">${description}</div>
                        </div>

                        <p class="p">For further details, session links, and registration, please access the portal via the button below.</p>
                    `,
                    actionUrl: `${process.env.CLIENT_URL || 'https://soeit-ritesh.onrender.com'}/login`,
                    actionText: 'View Event Details',
                    footerText: 'This is an institutional notification from SOEIT Portal. Your participation is highly encouraged.'
                }),
            }).catch(err => console.error('Email failed:', err));
        }

        // Invalidate cache
        clearCache('/api/events');

        res.status(201).json({ success: true, message: 'Event created and notifications sent', data: event });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Private
exports.getEvents = async (req, res, next) => {
    try {
        const { category } = req.query;
        const query = {};
        if (category && category !== 'All') query.category = category;

        const events = await Event.find(query).sort({ date: -1 });

        res.status(200).json({ success: true, count: events.length, data: events });
    } catch (error) {
        next(error);
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin/Faculty)
exports.updateEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        const creatorId = typeof event.createdBy === 'object' ? event.createdBy.id : event.createdBy;
        if (req.user.role !== 'admin' && creatorId !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this event' });
        }

        const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        // Invalidate cache
        clearCache('/api/events');

        res.status(200).json({ success: true, message: 'Event updated successfully', data: updated });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin/Faculty)
exports.deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        const creatorId = typeof event.createdBy === 'object' ? event.createdBy.id : event.createdBy;
        if (req.user.role !== 'admin' && creatorId !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this event' });
        }

        await event.deleteOne();
        
        // Invalidate cache
        clearCache('/api/events');

        res.status(200).json({ success: true, message: 'Event removed' });
    } catch (error) {
        next(error);
    }
};
