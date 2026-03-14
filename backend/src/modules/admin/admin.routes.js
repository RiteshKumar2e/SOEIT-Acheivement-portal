const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getPendingAchievements,
    verifyAchievement,
    getAllAchievements,
    getStudents,
    getFaculty,
    getReports,
    manageUser,
    deleteUsers,
} = require('./admin.controller');
const { protect, authorize } = require('../../middleware/auth');
const { cacheMiddleware } = require('../../utils/cache');

router.use(protect, authorize('admin', 'faculty'));

router.get('/dashboard', cacheMiddleware(10), getDashboardStats);
router.get('/achievements/pending', cacheMiddleware(30), getPendingAchievements);
router.get('/achievements', cacheMiddleware(30), getAllAchievements);
router.get('/faculty', authorize('admin'), getFaculty);
router.put('/achievements/:id/verify', verifyAchievement);
router.get('/students', getStudents);
router.get('/reports', getReports);
router.put('/users/:id', authorize('admin'), manageUser);
router.delete('/users', deleteUsers);

module.exports = router;
