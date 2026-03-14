const { getDb } = require('../../config/db');

// nanoid - dynamic import helper
const genId = async () => {
    const { nanoid } = await import('nanoid');
    return nanoid();
};

const Course = {
    /** CREATE */
    create: async (data) => {
        const db = getDb();
        const id = await genId();

        await db.execute({
            sql: `INSERT INTO courses 
                (id, student_id, course_name, platform, status, progress, start_date, course_link, sync_credentials, category, expected_completion_date, skills_to_be_learnt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                id, data.studentId, data.courseName, data.platform,
                data.status || 'Ongoing', data.progress || 0, data.startDate || new Date().toISOString(),
                data.courseLink || '', data.syncCredentials || '{}',
                data.category || 'Technical', data.expectedCompletionDate || '', data.skillsToBeLearnt || ''
            ],
        });

        const result = await db.execute({ sql: 'SELECT * FROM courses WHERE id=?', args: [id] });
        return result.rows[0];
    },

    /** FIND BY ID */
    findById: async (id) => {
        const db = getDb();
        const result = await db.execute({ sql: 'SELECT * FROM courses WHERE id=?', args: [id] });
        return result.rows[0];
    },

    /** FIND BY STUDENT ID */
    findByStudentId: async (studentId) => {
        const db = getDb();
        const result = await db.execute({
            sql: 'SELECT * FROM courses WHERE student_id=? ORDER BY created_at DESC',
            args: [studentId]
        });
        return result.rows;
    },

    /** UPDATE PROGRESS */
    updateProgress: async (id, progress, status, completionDate) => {
        const db = getDb();
        await db.execute({
            sql: `UPDATE courses SET 
                progress=?, status=?, completion_date=?, updated_at=datetime('now') 
                WHERE id=?`,
            args: [progress, status, completionDate || null, id],
        });
        return Course.findById(id);
    },

    /** SYNC PROGRESS FROM EXTERNAL */
    sync: async (id, progress, status, credentials = null) => {
        const db = getDb();
        let sql = `UPDATE courses SET progress=?, status=?, last_synced_at=datetime('now'), updated_at=datetime('now')`;
        const args = [progress, status];

        if (credentials) {
            sql += `, sync_credentials=?`;
            args.push(JSON.stringify(credentials));
        }

        sql += ` WHERE id=?`;
        args.push(id);

        await db.execute({ sql, args });
        return Course.findById(id);
    },

    /** DELETE */
    delete: async (id) => {
        const db = getDb();
        await db.execute({ sql: 'DELETE FROM courses WHERE id=?', args: [id] });
        return true;
    },

    /** GET ALL (Admin/Faculty View) */
    findAllEnriched: async (filters = {}) => {
        const db = getDb();
        let sql = `
            SELECT c.*, u.name as student_name, u.department, u.enrollment_no
            FROM courses c
            JOIN users u ON c.student_id = u.id
            WHERE 1=1
        `;
        const args = [];

        if (filters.department) {
            sql += ' AND u.department = ?';
            args.push(filters.department);
        }

        if (filters.status) {
            sql += ' AND c.status = ?';
            args.push(filters.status);
        }

        if (filters.search) {
            sql += ' AND (u.name LIKE ? OR u.enrollment_no LIKE ? OR c.course_name LIKE ?)';
            const searchVal = `%${filters.search}%`;
            args.push(searchVal, searchVal, searchVal);
        }

        sql += ' ORDER BY c.updated_at DESC';

        const result = await db.execute({ sql, args });
        return result.rows;
    }
};

module.exports = Course;
