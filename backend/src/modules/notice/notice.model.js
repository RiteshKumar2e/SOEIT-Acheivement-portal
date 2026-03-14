const { getDb } = require('../../config/db');

const genId = async () => {
    const { nanoid } = await import('nanoid');
    return nanoid();
};

const rowToNotice = (row) => {
    if (!row) return null;
    return {
        _id: row.id,
        id: row.id,
        title: row.title,
        content: row.content,
        priority: row.priority || 'Medium',
        createdBy: row.creator_id ? {
            _id: row.creator_id,
            id: row.creator_id,
            name: row.creator_name,
            email: row.creator_email,
            department: row.creator_department,
        } : row.created_by,
        createdAt: row.created_at ? new Date(row.created_at) : null,

        deleteOne: async function () {
            const db = getDb();
            await db.execute({ sql: 'DELETE FROM notices WHERE id = ?', args: [this.id] });
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
        n.*,
        u.id         AS creator_id,
        u.name       AS creator_name,
        u.email      AS creator_email,
        u.department AS creator_department
    FROM notices n
    LEFT JOIN users u ON n.created_by = u.id
`;

const Notice = {
    create: async (data) => {
        const db = getDb();
        const id = await genId();
        await db.execute({
            sql: `INSERT INTO notices (id, title, content, priority, created_by)
                  VALUES (?,?,?,?,?)`,
            args: [id, data.title, data.content, data.priority || 'Medium', data.createdBy],
        });
        const res = await db.execute({ sql: `${BASE_SELECT} WHERE n.id = ?`, args: [id] });
        return rowToNotice(res.rows[0]);
    },

    findById: async (id) => {
        const db = getDb();
        const res = await db.execute({ sql: `${BASE_SELECT} WHERE n.id = ?`, args: [id] });
        return res.rows.length ? rowToNotice(res.rows[0]) : null;
    },

    find: (query = {}) => {
        const buildAndExec = async () => {
            const db = getDb();
            const sql = `${BASE_SELECT} ORDER BY n.created_at DESC`;
            const res = await db.execute({ sql, args: [] });
            return res.rows.map(rowToNotice);
        };

        const chain = {
            select: () => chain,
            populate: () => chain,
            sort: () => chain,
            then: (resolve, reject) => buildAndExec().then(resolve, reject),
        };
        return chain;
    },
};

module.exports = Notice;
