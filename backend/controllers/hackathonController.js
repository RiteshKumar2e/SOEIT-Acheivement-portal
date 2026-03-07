const HackathonActivity = require('../models/HackathonActivity');

// @desc    Log a student hackathon activity (e.g., clicking on apply/visit)
// @route   POST /api/hackathons/activity
exports.logActivity = async (req, res, next) => {
    try {
        const { hackathonTitle, actionType } = req.body;
        const studentId = req.user.id; // User must be authenticated

        if (!hackathonTitle) {
            return res.status(400).json({ success: false, message: 'Hackathon title is required' });
        }

        const data = {
            studentId,
            hackathonTitle,
            actionType: actionType || 'visit'
        };

        const activity = await HackathonActivity.create(data);
        res.status(201).json({ success: true, message: 'Activity logged', data: activity });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all hackathon activities (Admin/Faculty)
// @route   GET /api/hackathons/activity
exports.getAllActivities = async (req, res, next) => {
    try {
        const { department, search } = req.query;
        const activities = await HackathonActivity.findAllEnriched({ department, search });

        // Format to JS camelCase conventions
        const transformed = activities.map(a => ({
            id: a.id,
            hackathonTitle: a.hackathon_title,
            actionType: a.action_type,
            studentName: a.student_name,
            department: a.department,
            enrollmentNo: a.enrollment_no,
            batch: a.batch,
            createdAt: a.created_at
        }));

        res.status(200).json({ success: true, count: transformed.length, data: transformed });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a hackathon activity log (Admin/Faculty)
// @route   DELETE /api/hackathons/activity/:id
exports.deleteActivity = async (req, res, next) => {
    try {
        await HackathonActivity.delete(req.params.id);
        res.status(200).json({ success: true, message: 'Activity log purged successfully' });
    } catch (error) {
        next(error);
    }
};
