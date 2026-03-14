const { getDb } = require('../../config/db');

const genId = async () => {
    const { nanoid } = await import('nanoid');
    return nanoid();
};

const Verification = {
    create: async (data) => {
        const db = getDb();
        const id = await genId();
        await db.execute({
            sql: `INSERT INTO verifications (id, achievement_id, verified_by, action, remarks, previous_status, new_status)
                  VALUES (?,?,?,?,?,?,?)`,
            args: [
                id,
                data.achievementId,
                data.verifiedBy,
                data.action,
                data.remarks || null,
                data.previousStatus || null,
                data.newStatus || null,
            ],
        });
        return { _id: id, id, ...data };
    },
};

module.exports = Verification;
