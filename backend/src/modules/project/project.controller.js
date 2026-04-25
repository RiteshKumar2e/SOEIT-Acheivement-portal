const Project = require('../../modules/project/project.model');

// @desc    Add new project
// @route   POST /api/projects
// @access  Private (Student)
exports.addProject = async (req, res) => {
    try {
        const { title, description, githubLink, liveLink, techStack, status } = req.body;

        if (!title || !description) {
            return res.status(400).json({ success: false, message: 'Please provide title and description' });
        }

        const project = await Project.create({
            studentId: req.user.id,
            title,
            description,
            githubLink,
            liveLink,
            techStack,
            status
        });

        res.status(201).json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get my projects
// @route   GET /api/projects/my
// @access  Private (Student)
exports.getMyProjects = async (req, res) => {
    try {
        const projects = await Project.findAll({ studentId: req.user.id });
        res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all projects (for Faculty/Admin)
// @route   GET /api/projects
// @access  Private (Faculty/Admin)
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.findAll(req.query);
        res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Student)
exports.updateProject = async (req, res) => {
    try {
        const { title, description, githubLink, liveLink, techStack, status } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        if (project.studentId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this project' });
        }

        const db = require('../../config/db').getDb();
        await db.execute({
            sql: `UPDATE projects SET title = ?, description = ?, github_link = ?, live_link = ?, tech_stack = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            args: [
                title || project.title,
                description || project.description,
                githubLink !== undefined ? githubLink : project.githubLink,
                liveLink !== undefined ? liveLink : project.liveLink,
                techStack !== undefined ? techStack : project.techStack,
                status || project.status,
                req.params.id
            ]
        });

        const updated = await Project.findById(req.params.id);
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Student)
exports.deleteProject = async (req, res) => {
    try {
        await Project.delete(req.params.id, req.user.id);
        res.status(200).json({ success: true, message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
