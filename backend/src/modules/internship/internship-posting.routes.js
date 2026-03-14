const express = require('express');
const router = express.Router();
const {
    createPosting,
    getPostings,
    updatePosting,
    deletePosting
} = require('./internship-posting.controller');
const { protect, authorize } = require('../../middleware/auth');

router.use(protect);

// Publicly available to all authenticated users
router.get('/', getPostings);

// Management restricted to Faculty and Admin
router.post('/', authorize('admin', 'faculty'), createPosting);
router.put('/:id', authorize('admin', 'faculty'), updatePosting);
router.delete('/:id', authorize('admin', 'faculty'), deletePosting);

module.exports = router;
