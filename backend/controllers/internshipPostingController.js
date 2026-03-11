const InternshipPosting = require('../models/InternshipPosting');

// @desc    Post a new internship opportunity (Faculty/Admin)
// @route   POST /api/internship-postings
exports.createPosting = async (req, res, next) => {
    try {
        const { companyName, role, location, stipend, deadline, description, requirements, applyLink } = req.body;

        if (!companyName || !role) {
            return res.status(400).json({ success: false, message: 'Company name and role are mandatory' });
        }

        const data = {
            companyName,
            role,
            location,
            stipend,
            deadline,
            description,
            requirements,
            applyLink,
            createdBy: req.user.id
        };

        const posting = await InternshipPosting.create(data);
        res.status(201).json({ success: true, message: 'Internship opportunity broadcasted successfully', data: posting });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all internship opportunities
// @route   GET /api/internship-postings
exports.getPostings = async (req, res, next) => {
    try {
        const { search } = req.query;
        const postings = await InternshipPosting.findAll({ search });
        res.status(200).json({ success: true, count: postings.length, data: postings });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a posting (Creator/Admin)
// @route   PUT /api/internship-postings/:id
exports.updatePosting = async (req, res, next) => {
    try {
        const posting = await InternshipPosting.findById(req.params.id);

        if (!posting) {
            return res.status(404).json({ success: false, message: 'Posting not found' });
        }

        // Only creator or admin can update
        if (posting.created_by !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to modify this posting' });
        }

        const updated = await InternshipPosting.update(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Opportunity updated', data: updated });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a posting
// @route   DELETE /api/internship-postings/:id
exports.deletePosting = async (req, res, next) => {
    try {
        const posting = await InternshipPosting.findById(req.params.id);

        if (!posting) {
            return res.status(404).json({ success: false, message: 'Posting not found' });
        }

        if (posting.created_by !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this posting' });
        }

        await InternshipPosting.delete(req.params.id);
        res.status(200).json({ success: true, message: 'Opportunity removed from registry' });
    } catch (error) {
        next(error);
    }
};
