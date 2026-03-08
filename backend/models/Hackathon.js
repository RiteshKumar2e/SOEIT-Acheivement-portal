const { getDb } = require('../config/db');

const genId = async () => {
    const crypto = require('crypto');
    return crypto.randomBytes(10).toString('hex');
};

const Hackathon = {
    create: async (data, userId) => {
        const db = getDb();
        const id = await genId();

        await db.execute({
            sql: `INSERT INTO hackathons (id, title, type, img_url, prize, students_count, deadline_date, badge, link, created_by)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                id, data.title, data.type, data.img_url || '',
                data.prize || '', data.students_count || '',
                data.deadline_date || '', data.badge || '',
                data.link, userId
            ],
        });

        const result = await db.execute({ sql: 'SELECT * FROM hackathons WHERE id=?', args: [id] });
        return result.rows[0];
    },

    findAll: async () => {
        const db = getDb();
        const result = await db.execute({
            sql: `SELECT h.*, u.name as creator_name 
                  FROM hackathons h
                  LEFT JOIN users u ON h.created_by = u.id
                  ORDER BY h.created_at DESC`,
            args: []
        });
        return result.rows;
    },

    findById: async (id) => {
        const db = getDb();
        const result = await db.execute({
            sql: 'SELECT * FROM hackathons WHERE id=?',
            args: [id]
        });
        return result.rows[0];
    },

    delete: async (id) => {
        const db = getDb();
        await db.execute({ sql: 'DELETE FROM hackathons WHERE id = ?', args: [id] });
    }
};

module.exports = Hackathon;
