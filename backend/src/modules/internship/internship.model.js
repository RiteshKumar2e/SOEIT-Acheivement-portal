const { getDb } = require('../../config/db');

const genId = async () => {
    const { nanoid } = await import('nanoid');
    return nanoid();
};

const rowToInternship = (row) => {
    if (!row) return null;
    return {
        ...row,
        _id: row.id, // For compatibility with parts of frontend expecting _id
    };
};

const Internship = {
    /** CREATE */
    create: async (data) => {
        const db = getDb();
        const id = await genId();

        await db.execute({
            sql: `INSERT INTO internships 
                (id, student_id, company_name, role, start_date, end_date, status, description, certificate_url, location, internship_type)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                id, data.studentId, data.companyName, data.role,
                data.startDate, data.endDate || null, data.status || 'Ongoing',
                data.description || null, data.certificateUrl || null,
                data.location || null, data.internshipType || null
            ],
        });

        const result = await db.execute({ sql: 'SELECT * FROM internships WHERE id=?', args: [id] });
        return rowToInternship(result.rows[0]);
    },

    /** FIND BY ID */
    findById: async (id) => {
        const db = getDb();
        const result = await db.execute({ sql: 'SELECT * FROM internships WHERE id=?', args: [id] });
        return result.rows.length ? rowToInternship(result.rows[0]) : null;
    },

    /** FIND BY STUDENT ID */
    findByStudentId: async (studentId) => {
        const db = getDb();
        const result = await db.execute({
            sql: 'SELECT * FROM internships WHERE student_id=? ORDER BY created_at DESC',
            args: [studentId]
        });
        return result.rows.map(rowToInternship);
    },

    /** UPDATE */
    update: async (id, data) => {
        const db = getDb();
        const fields = [];
        const args = [];

        if (data.companyName) { fields.push('company_name=?'); args.push(data.companyName); }
        if (data.role) { fields.push('role=?'); args.push(data.role); }
        if (data.startDate) { fields.push('start_date=?'); args.push(data.startDate); }
        if (data.endDate) { fields.push('end_date=?'); args.push(data.endDate); }
        if (data.status) { fields.push('status=?'); args.push(data.status); }
        if (data.description) { fields.push('description=?'); args.push(data.description); }
        if (data.certificateUrl) { fields.push('certificate_url=?'); args.push(data.certificateUrl); }
        if (data.location) { fields.push('location=?'); args.push(data.location); }
        if (data.internshipType) { fields.push('internship_type=?'); args.push(data.internshipType); }

        if (fields.length === 0) return Internship.findById(id);

        fields.push("updated_at=datetime('now')");
        args.push(id);

        await db.execute({
            sql: `UPDATE internships SET ${fields.join(', ')} WHERE id=?`,
            args: args,
        });
        return Internship.findById(id);
    },

    /** DELETE */
    delete: async (id) => {
        const db = getDb();
        await db.execute({ sql: 'DELETE FROM internships WHERE id=?', args: [id] });
        return true;
    },

    /** GET ALL (Admin/Faculty View) */
    findAllEnriched: async (filters = {}) => {
        const db = getDb();
        let sql = `
            SELECT i.*, u.name as student_name, u.department, u.enrollment_no, u.profile_image as student_profile_image
            FROM internships i
            JOIN users u ON i.student_id = u.id
            WHERE 1=1
        `;
        const args = [];

        if (filters.department) {
            sql += ' AND u.department = ?';
            args.push(filters.department);
        }

        if (filters.status) {
            sql += ' AND i.status = ?';
            args.push(filters.status);
        }

        if (filters.search) {
            sql += ' AND (u.name LIKE ? OR u.enrollment_no LIKE ? OR i.company_name LIKE ? OR i.role LIKE ?)';
            const searchVal = `%${filters.search}%`;
            args.push(searchVal, searchVal, searchVal, searchVal);
        }

        sql += ' ORDER BY i.created_at DESC';

        const result = await db.execute({ sql, args });
        return result.rows.map(rowToInternship);
    }
};

module.exports = Internship;
