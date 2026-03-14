const Internship = require('../internship/internship.model');

// @desc    Add an internship (Student)
// @route   POST /api/internships
exports.addInternship = async (req, res, next) => {
    try {
        const { companyName, role, startDate, endDate, status, description, certificateUrl, location, internshipType } = req.body;
        const studentId = req.user.id;

        if (!companyName || !role) {
            return res.status(400).json({ success: false, message: 'Company name and role are required' });
        }

        const data = {
            studentId,
            companyName,
            role,
            startDate,
            endDate,
            status: status || 'Ongoing',
            description,
            certificateUrl,
            location,
            internshipType
        };

        const internship = await Internship.create(data);
        res.status(201).json({ success: true, message: 'Internship record added successfully', data: internship });
    } catch (error) {
        next(error);
    }
};

// @desc    Get my internships (Student)
// @route   GET /api/internships/my
exports.getMyInternships = async (req, res, next) => {
    try {
        const internships = await Internship.findByStudentId(req.user.id);
        res.status(200).json({ success: true, count: internships.length, data: internships });
    } catch (error) {
        next(error);
    }
};

// @desc    Update internship (Student)
// @route   PUT /api/internships/:id
exports.updateInternship = async (req, res, next) => {
    try {
        const internshipId = req.params.id;
        const internship = await Internship.findById(internshipId);

        if (!internship || internship.student_id !== req.user.id) {
            return res.status(404).json({ success: false, message: 'Internship record not found' });
        }

        const updatedInternship = await Internship.update(internshipId, req.body);
        res.status(200).json({ success: true, message: 'Internship record updated', data: updatedInternship });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete internship (Student)
// @route   DELETE /api/internships/:id
exports.deleteInternship = async (req, res, next) => {
    try {
        const internship = await Internship.findById(req.params.id);
        if (!internship || internship.student_id !== req.user.id) {
            return res.status(404).json({ success: false, message: 'Internship record not found' });
        }

        await Internship.delete(req.params.id);
        res.status(200).json({ success: true, message: 'Internship record deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all students' internships (Admin/Faculty)
// @route   GET /api/internships
exports.getAllInternships = async (req, res, next) => {
    try {
        const { department, status, search } = req.query;
        const internships = await Internship.findAllEnriched({ department, status, search });

        res.status(200).json({ success: true, count: internships.length, data: internships });
    } catch (error) {
        next(error);
    }
};
