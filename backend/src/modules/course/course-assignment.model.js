const { getDb } = require('../../config/db');

const genId = async () => {
    const { nanoid } = await import('nanoid');
    return nanoid();
};

const CourseAssignment = {
    create: async (data, assignedBy) => {
        const db = getDb();
        const id = await genId();

        await db.execute({
            sql: `INSERT INTO course_assignments 
                (id, course_name, subject, description, course_link, department, semester, assigned_by)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                id, data.courseName, data.subject, data.description || '', 
                data.courseLink || '', data.department, data.semester, assignedBy
            ],
        });

        const result = await db.execute({ sql: 'SELECT * FROM course_assignments WHERE id=?', args: [id] });
        return result.rows[0];
    },

    findAll: async (filters = {}) => {
        const db = getDb();
        let sql = `
            SELECT ca.*, u.name as faculty_name
            FROM course_assignments ca
            JOIN users u ON ca.assigned_by = u.id
            WHERE 1=1
        `;
        const args = [];

        if (filters.department) {
            sql += ' AND ca.department = ?';
            args.push(filters.department);
        }

        if (filters.semester) {
            sql += ' AND ca.semester = ?';
            args.push(filters.semester);
        }

        sql += ' ORDER BY ca.created_at DESC';

        const result = await db.execute({ sql, args });
        return result.rows;
    },

    findByStudentTarget: async (department, semester) => {
        const db = getDb();
        const result = await db.execute({
            sql: `SELECT ca.*, u.name as faculty_name 
                 FROM course_assignments ca
                 JOIN users u ON ca.assigned_by = u.id
                 WHERE ca.department = ? AND ca.semester = ?
                 ORDER BY ca.created_at DESC`,
            args: [department, semester]
        });
        return result.rows;
    },

    delete: async (id) => {
        const db = getDb();
        await db.execute({ sql: 'DELETE FROM course_assignments WHERE id=?', args: [id] });
        return true;
    }
};

module.exports = CourseAssignment;
