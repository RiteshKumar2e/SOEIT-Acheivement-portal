const { getDb } = require('../config/db');

const genId = async () => {
    const { nanoid } = await import('nanoid');
    return nanoid();
};

const HackathonActivity = {
    /** Log a new activity */
    create: async (data) => {
        const db = getDb();
        const id = await genId();

        await db.execute({
            sql: `INSERT INTO hackathon_activities (id, student_id, hackathon_title, action_type) VALUES (?, ?, ?, ?)`,
            args: [id, data.studentId, data.hackathonTitle, data.actionType || 'visit'],
        });

        const result = await db.execute({ sql: 'SELECT * FROM hackathon_activities WHERE id=?', args: [id] });
        return result.rows[0];
    },

    /** Fetch all activities enriched with student details (for admin/faculty) */
    findAllEnriched: async (filters = {}) => {
        const db = getDb();
        let sql = `
            SELECT h.*, u.name as student_name, u.department, u.enrollment_no, u.batch
            FROM hackathon_activities h
            JOIN users u ON h.student_id = u.id
            WHERE 1=1
        `;
        const args = [];

        if (filters.department) {
            sql += ' AND u.department = ?';
            args.push(filters.department);
        }

        if (filters.search) {
            sql += ' AND (u.name LIKE ? OR u.enrollment_no LIKE ? OR h.hackathon_title LIKE ?)';
            const searchVal = `%${filters.search}%`;
            args.push(searchVal, searchVal, searchVal);
        }

        sql += ' ORDER BY h.created_at DESC';

        const result = await db.execute({ sql, args });
        return result.rows;
    },

    /** Count distinct hackathons a student has explored */
    countByStudent: async (studentId) => {
        const db = getDb();
        const result = await db.execute({
            sql: `SELECT COUNT(DISTINCT hackathon_title) as cnt FROM hackathon_activities WHERE student_id = ?`,
            args: [studentId],
        });
        return Number(result.rows[0]?.cnt) || 0;
    },

    /** Delete an activity log */
    delete: async (id) => {
        const db = getDb();
        await db.execute({ sql: 'DELETE FROM hackathon_activities WHERE id = ?', args: [id] });
    }
};

module.exports = HackathonActivity;
