const Notification = require('../../modules/notification/notification.model');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.findByUser(req.user.id);
        const cleanedNotifications = notifications.map(notif => notif.toObject ? notif.toObject() : notif);
        res.status(200).json({ success: true, count: cleanedNotifications.length, data: cleanedNotifications });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
    try {
        await Notification.markAllAsRead(req.user.id);
        res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
        
        if (notification.user !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        await notification.markAsRead();
        const cleanedNotification = notification.toObject ? notification.toObject() : notification;
        res.status(200).json({ success: true, message: 'Notification marked as read', data: cleanedNotification });
    } catch (error) {
        next(error);
    }
};
