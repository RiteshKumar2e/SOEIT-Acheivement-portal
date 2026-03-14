const express = require('express');
const router = express.Router();
const {
    addProject,
    getMyProjects,
    getAllProjects,
    deleteProject
} = require('./project.controller');
const { protect, authorize } = require('../../middleware/auth');

router.use(protect);

router.post('/', addProject);
router.get('/my', getMyProjects);
router.get('/', authorize('faculty', 'admin'), getAllProjects);
router.delete('/:id', deleteProject);

module.exports = router;
