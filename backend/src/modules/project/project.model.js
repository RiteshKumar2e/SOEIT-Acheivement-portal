const { getDb } = require('../../config/db');

const genId = async () => {
    const { nanoid } = await import('nanoid');
    return nanoid();
};

const rowToProject = (row) => {
    if (!row) return null;
    return {
        _id: row.id,
        id: row.id,
        studentId: row.student_id,
        title: row.title,
        description: row.description,
        githubLink: row.github_link,
        liveLink: row.live_link,
        techStack: row.tech_stack,
        status: row.status,
        createdAt: row.created_at ? new Date(row.created_at) : null,
        updatedAt: row.updated_at ? new Date(row.updated_at) : null,
        student: row.student_name ? {
            name: row.student_name,
            email: row.student_email,
            department: row.student_department,
            profileImage: row.student_profile_image
        } : undefined
    };
};

const Project = {
    create: async (data) => {
        const db = getDb();
        const id = await genId();
        await db.execute({
            sql: `INSERT INTO projects (id, student_id, title, description, github_link, live_link, tech_stack, status)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [id, data.studentId, data.title, data.description, data.githubLink || null, data.liveLink || null, data.techStack || null, data.status || 'Completed']
        });
        return Project.findById(id);
    },

    findById: async (id) => {
        const db = getDb();
        const res = await db.execute({
            sql: `SELECT p.*, u.name as student_name, u.email as student_email, u.department as student_department, u.profile_image as student_profile_image
                  FROM projects p
                  LEFT JOIN users u ON p.student_id = u.id
                  WHERE p.id = ?`,
            args: [id]
        });
        return res.rows.length ? rowToProject(res.rows[0]) : null;
    },

    findAll: async (params = {}) => {
        const db = getDb();
        let sql = `SELECT p.*, u.name as student_name, u.email as student_email, u.department as student_department, u.profile_image as student_profile_image
                   FROM projects p
                   LEFT JOIN users u ON p.student_id = u.id
                   WHERE 1=1`;
        const args = [];

        if (params.studentId) {
            sql += ` AND p.student_id = ?`;
            args.push(params.studentId);
        }

        if (params.department) {
            sql += ` AND u.department = ?`;
            args.push(params.department);
        }

        if (params.search) {
            sql += ` AND (p.title LIKE ? OR p.tech_stack LIKE ? OR u.name LIKE ?)`;
            args.push(`%${params.search}%`, `%${params.search}%`, `%${params.search}%`);
        }

        sql += ` ORDER BY p.created_at DESC`;

        const res = await db.execute({ sql, args });
        return res.rows.map(rowToProject);
    },

    delete: async (id, studentId) => {
        const db = getDb();
        await db.execute({
            sql: `DELETE FROM projects WHERE id = ? AND student_id = ?`,
            args: [id, studentId]
        });
    }
};

module.exports = Project;
