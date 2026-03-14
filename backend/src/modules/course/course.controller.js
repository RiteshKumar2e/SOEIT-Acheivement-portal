const Course = require('../course/course.model');
const CourseAssignment = require('../course/course-assignment.model');
const User = require('../user/user.model');
const { clearCache } = require('../../utils/cache');
const syncEngine = require('../../utils/syncEngine');

// @desc    Add a course (Student)
// @route   POST /api/courses
exports.addCourse = async (req, res, next) => {
    try {
        const { courseName, platform, status, progress, startDate } = req.body;
        const studentId = req.user.id;

        if (!courseName || !platform) {
            return res.status(400).json({ success: false, message: 'Course name and platform are required' });
        }

        const data = {
            studentId,
            courseName,
            platform,
            status: status || 'Ongoing',
            progress: progress || 0,
            startDate: startDate || new Date().toISOString(),
        };

        const course = await Course.create(data);
        
        // Invalidate cache
        clearCache('/api/courses');
        
        res.status(201).json({ success: true, message: 'Ongoing course initialized in registry', data: course });
    } catch (error) {
        next(error);
    }
};

// @desc    Get my courses (Student)
// @route   GET /api/courses/my
exports.getMyCourses = async (req, res, next) => {
    try {
        const courses = await Course.findByStudentId(req.user.id);
        res.status(200).json({ success: true, count: courses.length, data: courses });
    } catch (error) {
        next(error);
    }
};

// @desc    Update course progress (Student)
// @route   PUT /api/courses/:id/progress
exports.updateProgress = async (req, res, next) => {
    try {
        const { progress, status, completionDate } = req.body;
        const courseId = req.params.id;

        const course = await Course.findById(courseId);
        if (!course || course.student_id !== req.user.id) {
            return res.status(404).json({ success: false, message: 'Synchronized record not found' });
        }

        const updatedCourse = await Course.updateProgress(courseId, progress, status, completionDate);
        
        // Invalidate cache
        clearCache('/api/courses');

        res.status(200).json({ success: true, message: 'Analytical progress synchronized', data: updatedCourse });
    } catch (error) {
        next(error);
    }
};

// @desc    Sync course progress from external platform (Student)
// @route   POST /api/courses/:id/sync
exports.syncCourse = async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const credentials = req.body; 

        const course = await Course.findById(courseId);
        if (!course || course.student_id !== req.user.id) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }

        const result = await syncEngine.syncProgress(course.platform, course.course_name, course.course_link, credentials);
        const updatedCourse = await Course.sync(courseId, result.progress, result.status, credentials);
        
        clearCache('/api/courses');

        res.status(200).json({ 
            success: true, 
            message: `Progress synchronized from ${course.platform}`, 
            data: updatedCourse 
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete course (Student)
// @route   DELETE /api/courses/:id
exports.deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course || course.student_id !== req.user.id) {
            return res.status(404).json({ success: false, message: 'Record purged from local cache (Not found in registry)' });
        }

        await Course.delete(req.params.id);
        
        // Invalidate cache
        clearCache('/api/courses');

        res.status(200).json({ success: true, message: 'Analytical record purged from institutional registry' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all students' courses (Admin/Faculty)
// @route   GET /api/courses
exports.getAllCourses = async (req, res, next) => {
    try {
        const { department, status, search } = req.query;
        const courses = await Course.findAllEnriched({ department, status, search });

        // Transform row names back to JS names if needed (though the frontend can handle row keys too)
        const transformed = courses.map(c => ({
            id: c.id,
            courseName: c.course_name,
            platform: c.platform,
            status: c.status,
            progress: c.progress,
            studentName: c.student_name,
            department: c.department,
            enrollmentNo: c.enrollment_no,
            updatedAt: c.updated_at,
            lastSyncedAt: c.last_synced_at
        }));

        res.status(200).json({ success: true, count: transformed.length, data: transformed });
    } catch (error) {
        next(error);
    }
};

// @desc    Assign a course (Admin/Faculty)
// @route   POST /api/courses/assignments
exports.assignCourse = async (req, res, next) => {
    try {
        const { courseName, subject, description, courseLink, department, semester } = req.body;
        const assignedBy = req.user.id;

        if (!courseName || !subject || !department || !semester) {
            return res.status(400).json({ success: false, message: 'Required parameters missing' });
        }

        const assignment = await CourseAssignment.create({
            courseName, subject, description, courseLink, department, semester
        }, assignedBy);

        clearCache('/api/courses');
        res.status(201).json({ success: true, message: 'Course assigned to cohort successfully', data: assignment });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all assigned courses (Admin/Faculty)
// @route   GET /api/courses/assignments
exports.getAssignedCourses = async (req, res, next) => {
    try {
        const { department, semester } = req.query;
        const assignments = await CourseAssignment.findAll({ department, semester });
        res.status(200).json({ success: true, count: assignments.length, data: assignments });
    } catch (error) {
        next(error);
    }
};

// @desc    Get assignments for logged in student
// @route   GET /api/courses/assignments/my
exports.getMyAssignedCourses = async (req, res, next) => {
    try {
        const user = req.user;
        if (user.role !== 'student') {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        const assignments = await CourseAssignment.findByStudentTarget(user.department || 'CSE', user.semester || 1);
        res.status(200).json({ success: true, count: assignments.length, data: assignments });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete assignment (Admin/Faculty)
// @route   DELETE /api/courses/assignments/:id
exports.deleteAssignment = async (req, res, next) => {
    try {
        await CourseAssignment.delete(req.params.id);
        clearCache('/api/courses');
        res.status(200).json({ success: true, message: 'Assignment purged' });
    } catch (error) {
        next(error);
    }
};

