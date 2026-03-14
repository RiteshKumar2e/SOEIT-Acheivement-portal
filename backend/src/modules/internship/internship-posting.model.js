const { getDb } = require('../../config/db');

const genId = async () => {
    const { nanoid } = await import('nanoid');
    return nanoid();
};

const rowToPosting = (row) => {
    if (!row) return null;
    return {
        ...row,
        _id: row.id,
        creator: row.creator_name ? {
            name: row.creator_name,
            role: row.creator_role,
            id: row.created_by
        } : undefined
    };
};

const InternshipPosting = {
    /** CREATE */
    create: async (data) => {
        const db = getDb();
        const id = await genId();

        await db.execute({
            sql: `INSERT INTO internship_postings 
                (id, company_name, role, location, stipend, deadline, description, requirements, apply_link, created_by)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                id, data.companyName, data.role, data.location || null,
                data.stipend || null, data.deadline || null, data.description || null,
                data.requirements || null, data.apply_link || data.applyLink || null,
                data.createdBy
            ],
        });

        return InternshipPosting.findById(id);
    },

    /** FIND BY ID */
    findById: async (id) => {
        const db = getDb();
        const result = await db.execute({
            sql: `SELECT p.*, u.name as creator_name, u.role as creator_role 
                  FROM internship_postings p
                  JOIN users u ON p.created_by = u.id
                  WHERE p.id = ?`,
            args: [id]
        });
        return result.rows.length ? rowToPosting(result.rows[0]) : null;
    },

    /** GET ALL */
    findAll: async (filters = {}) => {
        const db = getDb();
        let sql = `
            SELECT p.*, u.name as creator_name, u.role as creator_role
            FROM internship_postings p
            JOIN users u ON p.created_by = u.id
            WHERE 1=1
        `;
        const args = [];

        if (filters.search) {
            sql += ' AND (p.company_name LIKE ? OR p.role LIKE ? OR p.location LIKE ?)';
            const searchVal = `%${filters.search}%`;
            args.push(searchVal, searchVal, searchVal);
        }

        sql += ' ORDER BY p.created_at DESC';

        const result = await db.execute({ sql, args });
        return result.rows.map(rowToPosting);
    },

    /** UPDATE */
    update: async (id, data) => {
        const db = getDb();
        const fields = [];
        const args = [];

        const map = {
            companyName: 'company_name',
            role: 'role',
            location: 'location',
            stipend: 'stipend',
            deadline: 'deadline',
            description: 'description',
            requirements: 'requirements',
            applyLink: 'apply_link'
        };

        for (const [key, col] of Object.entries(map)) {
            if (data[key] !== undefined) {
                fields.push(`${col}=?`);
                args.push(data[key]);
            }
        }

        if (fields.length === 0) return InternshipPosting.findById(id);

        fields.push("updated_at=datetime('now')");
        args.push(id);

        await db.execute({
            sql: `UPDATE internship_postings SET ${fields.join(', ')} WHERE id=?`,
            args: args,
        });
        return InternshipPosting.findById(id);
    },

    /** DELETE */
    delete: async (id) => {
        const db = getDb();
        await db.execute({ sql: 'DELETE FROM internship_postings WHERE id=?', args: [id] });
        return true;
    }
};

module.exports = InternshipPosting;
