const express = require('express');
const router = express.Router();
const { logActivity, getAllActivities, deleteActivity } = require('../controllers/hackathonController');
const { protect, authorize } = require('../middleware/auth');

router.post('/activity', protect, logActivity);
router.get('/activity', protect, authorize('admin', 'faculty'), getAllActivities);
router.delete('/activity/:id', protect, authorize('admin', 'faculty'), deleteActivity);

module.exports = router;
