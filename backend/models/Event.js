const { getDb } = require('../config/db');

const genId = async () => {
    const { nanoid } = await import('nanoid');
    return nanoid();
};

const rowToEvent = (row) => {
    if (!row) return null;
    return {
        _id: row.id,
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        date: row.date ? new Date(row.date) : null,
        venue: row.venue,
        registrationLink: row.registration_link || '',
        createdBy: row.creator_id ? {
            _id: row.creator_id,
            id: row.creator_id,
            name: row.creator_name,
            email: row.creator_email,
            department: row.creator_department,
            profileImage: row.creator_profile_image || '',
        } : row.created_by,
        createdAt: row.created_at ? new Date(row.created_at) : null,

        deleteOne: async function () {
            const db = getDb();
            await db.execute({ sql: 'DELETE FROM events WHERE id = ?', args: [this.id] });
        },

        toObject: function () {
            const obj = { ...this };
            delete obj.deleteOne;
            delete obj.toObject;
            return obj;
        },
    };
};

const BASE_SELECT = `
    SELECT
        e.*,
        u.id         AS creator_id,
        u.name       AS creator_name,
        u.email      AS creator_email,
        u.department AS creator_department,
        u.profile_image AS creator_profile_image
    FROM events e
    LEFT JOIN users u ON e.created_by = u.id
`;

const Event = {
    create: async (data) => {
        const db = getDb();
        const id = await genId();
        await db.execute({
            sql: `INSERT INTO events (id, title, description, category, date, venue, registration_link, created_by)
                  VALUES (?,?,?,?,?,?,?,?)`,
            args: [
                id, data.title, data.description, data.category,
                data.date ? new Date(data.date).toISOString() : null,
                data.venue,
                data.registrationLink || null,
                data.createdBy,
            ],
        });
        const res = await db.execute({ sql: `${BASE_SELECT} WHERE e.id = ?`, args: [id] });
        return rowToEvent(res.rows[0]);
    },

    findById: async (id) => {
        const db = getDb();
        const res = await db.execute({ sql: `${BASE_SELECT} WHERE e.id = ?`, args: [id] });
        return res.rows.length ? rowToEvent(res.rows[0]) : null;
    },

    find: (query = {}) => {
        let _sort = null;

        const buildAndExec = async () => {
            const db = getDb();
            let sql = `${BASE_SELECT} WHERE 1=1`;
            const args = [];

            if (query.category) { sql += ' AND e.category = ?'; args.push(query.category); }

            sql += ' ORDER BY e.date DESC';
            const res = await db.execute({ sql, args });
            return res.rows.map(rowToEvent);
        };

        const chain = {
            populate: () => chain,
            sort: (s) => { _sort = s; return chain; },
            then: (resolve, reject) => buildAndExec().then(resolve, reject),
        };
        return chain;
    },

    findByIdAndUpdate: async (id, updates, options = {}) => {
        const db = getDb();
        const colMap = {
            title: 'title', description: 'description', category: 'category',
            date: 'date', venue: 'venue', registrationLink: 'registration_link',
        };

        const setParts = [];
        const args = [];

        for (const [key, val] of Object.entries(updates)) {
            const col = colMap[key];
            if (!col) continue;
            setParts.push(`${col} = ?`);
            if (col === 'date') args.push(val ? new Date(val).toISOString() : null);
            else args.push(val ?? null);
        }

        if (setParts.length) {
            args.push(id);
            await db.execute({ sql: `UPDATE events SET ${setParts.join(', ')} WHERE id = ?`, args });
        }

        if (options.new !== false) return Event.findById(id);
        return null;
    },
};

module.exports = Event;
