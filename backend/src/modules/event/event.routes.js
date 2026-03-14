const express = require('express');
const router = express.Router();
const { createEvent, getEvents, deleteEvent, updateEvent } = require('./event.controller');
const { protect, authorize } = require('../../middleware/auth');
const { cacheMiddleware } = require('../../utils/cache');

router.use(protect);

router.get('/', cacheMiddleware(180), getEvents);
router.post('/', authorize('admin', 'faculty'), createEvent);
router.put('/:id', authorize('admin', 'faculty'), updateEvent);
router.delete('/:id', authorize('admin', 'faculty'), deleteEvent);

module.exports = router;
