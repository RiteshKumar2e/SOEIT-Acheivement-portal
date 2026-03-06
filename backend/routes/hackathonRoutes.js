const express = require('express');
const router = express.Router();
const { logActivity, getAllActivities } = require('../controllers/hackathonController');
const { protect, authorize } = require('../middleware/auth');

router.post('/activity', protect, logActivity);
router.get('/activity', protect, authorize('admin', 'faculty'), getAllActivities);

module.exports = router;
