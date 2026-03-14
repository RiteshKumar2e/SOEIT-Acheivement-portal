const express = require('express');
const router = express.Router();
const {
    createAchievement,
    getMyAchievements,
    getAchievement,
    updateAchievement,
    deleteAchievement,
    getPublicPortfolio,
    getPublicStudents,
    getStudentStats,
    serveFile,
} = require('./achievement.controller');
const { protect, authorize, optionalProtect } = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const { cacheMiddleware } = require('../../utils/cache');

// Public routes (with optional auth for identification)
router.get('/portfolio/:userId', optionalProtect, cacheMiddleware(60), getPublicPortfolio);
router.get('/public-students', optionalProtect, cacheMiddleware(120), getPublicStudents);
router.get('/files/:id', serveFile); // Critical: Database-driven file serving route

router.use(protect);

router.get('/stats', cacheMiddleware(30), getStudentStats);
router.get('/my', cacheMiddleware(30), getMyAchievements);
router.post('/', upload.array('proofFiles', 5), createAchievement);
router.get('/:id', cacheMiddleware(60), getAchievement);
router.put('/:id', upload.array('proofFiles', 5), updateAchievement);
router.delete('/:id', deleteAchievement);

module.exports = router;

