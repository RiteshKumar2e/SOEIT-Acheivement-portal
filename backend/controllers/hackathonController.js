const Hackathon = require('../models/Hackathon');
const HackathonActivity = require('../models/HackathonActivity');

// @desc    Get all hackathons
// @route   GET /api/hackathons
exports.getHackathons = async (req, res, next) => {
    try {
        const hackathons = await Hackathon.findAll();
        res.status(200).json({ success: true, count: hackathons.length, data: hackathons });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new hackathon
// @route   POST /api/hackathons
exports.createHackathon = async (req, res, next) => {
    try {
        // Faculty and Admin can create hackathons
        if (req.user.role !== 'admin' && req.user.role !== 'faculty') {
            return res.status(403).json({ success: false, message: 'Unauthorized profile' });
        }

        const hackathon = await Hackathon.create(req.body, req.user.id);
        res.status(201).json({ success: true, data: hackathon });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a hackathon
// @route   DELETE /api/hackathons/:id
exports.deleteHackathon = async (req, res, next) => {
    try {
        const hackathon = await Hackathon.findById(req.params.id);
        if (!hackathon) {
            return res.status(404).json({ success: false, message: 'Hackathon result not located' });
        }

        // Authorized roles (Admin/Faculty) as defined in routes can manage all listings
        if (req.user.role !== 'admin' && req.user.role !== 'faculty') {
            return res.status(403).json({ success: false, message: 'Institutional permission denied' });
        }

        await Hackathon.delete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

// @desc    Log hackathon activity
// @route   POST /api/hackathons/activity
exports.logActivity = async (req, res, next) => {
    try {
        const activity = await HackathonActivity.create({
            studentId: req.user.id,
            hackathonTitle: req.body.hackathonTitle,
            actionType: req.body.actionType
        });
        res.status(201).json({ success: true, data: activity });
    } catch (error) {
        next(error);
    }
};

// @desc    Get applied hackathons (for admin/faculty monitoring)
// @route   GET /api/hackathons/applied
exports.getAppliedHackathons = async (req, res, next) => {
    try {
        const activities = await HackathonActivity.findAllEnriched(req.query);
        res.status(200).json({ success: true, count: activities.length, data: activities });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a hackathon activity log
// @route   DELETE /api/hackathons/activity/:id
exports.deleteActivity = async (req, res, next) => {
    try {
        // Faculty and Admin can delete activity logs
        if (req.user.role !== 'admin' && req.user.role !== 'faculty') {
            return res.status(403).json({ success: false, message: 'Institutional permission denied' });
        }

        await HackathonActivity.delete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
