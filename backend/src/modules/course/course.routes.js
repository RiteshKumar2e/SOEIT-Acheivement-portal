const express = require('express');
const router = express.Router();
const { 
    addCourse, 
    getMyCourses, 
    updateProgress, 
    deleteCourse, 
    getAllCourses,
    assignCourse,
    getAssignedCourses,
    getMyAssignedCourses,
    deleteAssignment,
    syncCourse
} = require('./course.controller');
const { protect, authorize } = require('../../middleware/auth');
const { cacheMiddleware } = require('../../utils/cache');

router.use(protect);

// Assignment Routes
router.post('/assignments', authorize('admin', 'faculty'), assignCourse);
router.get('/assignments', authorize('admin', 'faculty'), getAssignedCourses);
router.get('/assignments/my', authorize('student'), getMyAssignedCourses);
router.delete('/assignments/:id', authorize('admin', 'faculty'), deleteAssignment);

// Student Routes
router.post('/', authorize('student'), addCourse);
router.get('/my', authorize('student'), cacheMiddleware(60), getMyCourses);
router.put('/:id/progress', authorize('student'), updateProgress);
router.post('/:id/sync', authorize('student'), syncCourse);
router.delete('/:id', authorize('student'), deleteCourse);

// Admin / Faculty Routes
router.get('/', authorize('admin', 'faculty'), cacheMiddleware(120), getAllCourses);


module.exports = router;
