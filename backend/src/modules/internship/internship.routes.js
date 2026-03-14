const express = require('express');
const router = express.Router();
const {
    addInternship,
    getMyInternships,
    updateInternship,
    deleteInternship,
    getAllInternships
} = require('./internship.controller');
const { protect, authorize } = require('../../middleware/auth');

router.use(protect);

// Student Routes
router.post('/', authorize('student'), addInternship);
router.get('/my', authorize('student'), getMyInternships);
router.put('/:id', authorize('student'), updateInternship);
router.delete('/:id', authorize('student'), deleteInternship);

// Admin / Faculty Routes
router.get('/', authorize('admin', 'faculty'), getAllInternships);

module.exports = router;
