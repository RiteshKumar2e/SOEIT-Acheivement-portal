const express = require('express');
const router = express.Router();
const { createNotice, getNotices, deleteNotice } = require('./notice.controller');
const { protect, authorize } = require('../../middleware/auth');
const { cacheMiddleware } = require('../../utils/cache');

router.use(protect);

router.get('/', cacheMiddleware(120), getNotices);
router.post('/', authorize('admin', 'faculty'), createNotice);
router.delete('/:id', authorize('admin', 'faculty'), deleteNotice);

module.exports = router;
