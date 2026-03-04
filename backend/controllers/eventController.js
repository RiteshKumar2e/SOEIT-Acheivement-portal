const Event = require('../models/Event');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

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
        let studentEmails = students.map(s => s.email);

        if (!studentEmails.includes('riteshkumar90359@gmail.com')) {
            studentEmails.push('riteshkumar90359@gmail.com');
        }

        if (studentEmails.length > 0) {
            sendEmail({
                to: studentEmails.join(','),
                subject: `New Event: ${title}`,
                message: `Hello Students,\n\nA new event has been added: ${title}.\n\nCategory: ${category}\nVenue: ${venue}\nDate: ${new Date(date).toLocaleDateString()}\n\nPlease login to the SOEIT portal to view more details.\n\nBest Regards,\nSOEIT Portal`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                        <h2 style="color: #3b82f6;">New Academic Event Published!</h2>
                        <p>Hello Students,</p>
                        <p>A new event has been added to the portal that might interest you:</p>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #1e293b;">${title}</h3>
                            <p><strong>Category:</strong> ${category}</p>
                            <p><strong>Venue:</strong> ${venue}</p>
                            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
                        </div>
                        <p>For further details and registration links, please login to your portal dashboard.</p>
                        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Portal</a>
                        <p style="margin-top: 20px; font-size: 0.8rem; color: #64748b;">This is an automated notification from SOEIT Portal. Please do not reply.</p>
                    </div>
                `,
            }).catch(err => console.error('Email failed:', err));
        }

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
        res.status(200).json({ success: true, message: 'Event removed' });
    } catch (error) {
        next(error);
    }
};
