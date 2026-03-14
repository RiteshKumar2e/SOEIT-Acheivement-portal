const express = require('express');
const router = express.Router();
const {
    getHackathons,
    createHackathon,
    deleteHackathon,
    logActivity,
    getAppliedHackathons
} = require('./hackathon.controller');
const { protect, authorize } = require('../../middleware/auth');

// Public/Student routes
router.get('/', protect, getHackathons);
router.post('/activity', protect, logActivity);

// Faculty/Admin routes
router.post('/', protect, authorize('admin', 'faculty'), createHackathon);
router.delete('/:id', protect, authorize('admin', 'faculty'), deleteHackathon);
router.get('/applied', protect, authorize('admin', 'faculty'), getAppliedHackathons);
router.delete('/activity/:id', protect, authorize('admin', 'faculty'), require('./hackathon.controller').deleteActivity);

module.exports = router;
