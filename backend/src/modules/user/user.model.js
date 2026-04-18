const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { getDb } = require('../../config/db');

// nanoid - dynamic import helper
const genId = async () => {
    const { nanoid } = await import('nanoid');
    return nanoid();
};

const pointsMap = {
    International: 100, National: 75, State: 50,
    University: 30, College: 20, Department: 10,
};

/**
 * Map a raw DB row → JS object matching the old Mongoose shape.
 * We expose _id for backward compatibility.
 */
const rowToUser = (row) => {
    if (!row) return null;
    return {
        _id: row.id,
        id: row.id,
        name: row.name,
        email: row.email,
        password: row.password,
        role: row.role,
        department: row.department,
        enrollmentNo: row.enrollment_no,
        studentId: row.student_id,
        phone: row.phone,
        bio: row.bio,
        profileImage: row.profile_image || '',
        batch: row.batch,
        semester: row.semester,
        section: row.section,
        isActive: row.is_active === 1 || row.is_active === true,
        isVerified: row.is_verified === 1 || row.is_verified === true,
        linkedIn: row.linked_in || '',
        github: row.github || '',
        portfolio: row.portfolio || '',
        edu10thSchool: row.edu_10th_school || '',
        edu10thYear: row.edu_10th_year || '',
        edu10thPercent: row.edu_10th_percent || '',
        edu12thSchool: row.edu_12th_school || '',
        edu12thYear: row.edu_12th_year || '',
        edu12thPercent: row.edu_12th_percent || '',
        universityName: row.university_name || 'Arka Jain University, Jamshedpur',
        universityCgpa: row.university_cgpa || '',
        skills: row.skills || '',
        resetPasswordToken: row.reset_password_token || undefined,
        resetPasswordExpire: row.reset_password_expire ? new Date(row.reset_password_expire) : undefined,
        lastLogin: row.last_login ? new Date(row.last_login) : undefined,
        createdAt: row.created_at ? new Date(row.created_at) : undefined,
        updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,

        // Methods (mimic Mongoose)
        matchPassword: async function (entered) {
            return bcrypt.compare(entered, this.password);
        },
        getResetPasswordToken: function () {
            const resetToken = crypto.randomBytes(20).toString('hex');
            this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
            return resetToken;
        },
        toObject: function () {
            const obj = { ...this };
            delete obj.matchPassword;
            delete obj.getResetPasswordToken;
            delete obj.save;
            delete obj.updateLastLogin;
            delete obj.toObject;
            return obj;
        },
        save: async function () {
            const db = getDb();
            await db.execute({
                sql: `UPDATE users SET
                    name=?, email=?, password=?, role=?, department=?,
                    enrollment_no=?, student_id=?, phone=?, bio=?, profile_image=?,
                    batch=?, semester=?, section=?, is_active=?, is_verified=?,
                    linked_in=?, github=?, portfolio=?,
                    edu_10th_school=?, edu_10th_year=?, edu_10th_percent=?,
                    edu_12th_school=?, edu_12th_year=?, edu_12th_percent=?,
                    university_name=?, university_cgpa=?, skills=?,
                    reset_password_token=?, reset_password_expire=?, last_login=?,
                    updated_at=datetime('now')
                    WHERE id=?`,
                args: [
                    this.name, this.email, this.password, this.role, this.department,
                    this.enrollmentNo || null, this.studentId || null,
                    this.phone || null, this.bio || null, this.profileImage || '',
                    this.batch || null, this.semester || null, this.section || null,
                    this.isActive ? 1 : 0, this.isVerified ? 1 : 0,
                    this.linkedIn || '', this.github || '', this.portfolio || '',
                    this.edu10thSchool || null, this.edu10thYear || null, this.edu10thPercent || null,
                    this.edu12thSchool || null, this.edu12thYear || null, this.edu12thPercent || null,
                    this.universityName || 'Arka Jain University, Jamshedpur', this.universityCgpa || null,
                    this.skills || null,
                    this.resetPasswordToken || null,
                    this.resetPasswordExpire ? this.resetPasswordExpire.toISOString() : null,
                    this.lastLogin ? this.lastLogin.toISOString() : null,
                    this.id,
                ],
            });
        },
        updateLastLogin: async function () {
            const db = getDb();
            this.lastLogin = new Date();
            // Fire and forget single column update (no await used in controller call anyway)
            await db.execute({
                sql: `UPDATE users SET last_login=?, updated_at=datetime('now') WHERE id=?`,
                args: [this.lastLogin.toISOString(), this.id],
            });
        },
    };
};

const User = {
    /** CREATE */
    create: async (data) => {
        const db = getDb();
        const id = await genId();

        // Hash password
        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        await db.execute({
            sql: `INSERT INTO users
                (id, name, email, password, role, department, enrollment_no, student_id,
                 batch, semester, section, is_active, is_verified)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,1,0)`,
            args: [
                id, data.name, data.email.toLowerCase(), hashedPassword,
                data.role || 'student', data.department,
                data.enrollmentNo || null, data.studentId || null,
                data.batch || null, data.semester || null, data.section || null,
            ],
        });

        const result = await db.execute({ sql: 'SELECT * FROM users WHERE id=?', args: [id] });
        return rowToUser(result.rows[0]);
    },

    /** FIND ONE */
    findOne: async (query) => {
        const db = getDb();
        let sql = 'SELECT * FROM users WHERE 1=1';
        const args = [];

        if (query.$or) {
            const orParts = [];
            for (const cond of query.$or) {
                if (cond.email !== undefined) { orParts.push('email = ?'); args.push(cond.email.toLowerCase()); }
                if (cond.enrollmentNo !== undefined) { orParts.push('enrollment_no = ?'); args.push(cond.enrollmentNo); }
                if (cond.resetPasswordToken !== undefined) { orParts.push('reset_password_token = ?'); args.push(cond.resetPasswordToken); }
            }
            if (orParts.length) sql += ` AND (${orParts.join(' OR ')})`;
        } else {
            if (query.email !== undefined) { sql += ' AND email = ?'; args.push(query.email.toLowerCase ? query.email.toLowerCase() : query.email); }
            if (query.enrollmentNo !== undefined) { sql += ' AND enrollment_no = ?'; args.push(query.enrollmentNo); }
            if (query.resetPasswordToken !== undefined) { sql += ' AND reset_password_token = ?'; args.push(query.resetPasswordToken); }
            if (query.resetPasswordExpire?.$gt !== undefined) { sql += ' AND reset_password_expire > ?'; args.push(new Date(query.resetPasswordExpire.$gt).toISOString()); }
        }

        const result = await db.execute({ sql, args });
        return result.rows.length ? rowToUser(result.rows[0]) : null;
    },

    /** FIND BY ID */
    findById: async (id) => {
        const db = getDb();
        const result = await db.execute({ sql: 'SELECT * FROM users WHERE id=?', args: [id] });
        return result.rows.length ? rowToUser(result.rows[0]) : null;
    },

    /** FIND (multiple) with chainable select / sort / skip / limit */
    find: (query = {}) => {
        let _selectFields = null;
        let _sort = null;
        let _skip = 0;
        let _limit = null;

        const buildAndExec = async () => {
            const db = getDb();
            let sql = 'SELECT * FROM users WHERE 1=1';
            const args = [];

            if (query.role) { sql += ' AND role = ?'; args.push(query.role); }
            if (query.isActive !== undefined) { sql += ' AND is_active = ?'; args.push(query.isActive ? 1 : 0); }
            if (query.department) { sql += ' AND department = ?'; args.push(query.department); }
            if (query.batch) { sql += ' AND batch = ?'; args.push(query.batch); }
            if (query.semester) { sql += ' AND semester = ?'; args.push(query.semester); }
            if (query.section) { sql += ' AND section = ?'; args.push(query.section); }
            if (query.$or) {
                const likes = [];
                for (const cond of query.$or) {
                    const key = Object.keys(cond)[0];
                    const colMap = { name: 'name', email: 'email', studentId: 'student_id', enrollmentNo: 'enrollment_no' };
                    const col = colMap[key];
                    if (col && cond[key]?.$regex) { likes.push(`${col} LIKE ?`); args.push(`%${cond[key].$regex}%`); }
                }
                if (likes.length) sql += ` AND (${likes.join(' OR ')})`;
            }

            if (_sort) {
                const [field, dir] = Object.entries(_sort)[0];
                const colMap = { name: 'name', createdAt: 'created_at' };
                sql += ` ORDER BY ${colMap[field] || field} ${dir === -1 || dir === 'desc' ? 'DESC' : 'ASC'}`;
            }
            if (_limit) sql += ` LIMIT ${_limit}`;
            if (_skip) sql += ` OFFSET ${_skip}`;

            const result = await db.execute({ sql, args });
            return result.rows.map(rowToUser);
        };

        const chain = {
            select: (fields) => { _selectFields = fields; return chain; },
            sort: (s) => { _sort = s; return chain; },
            skip: (n) => { _skip = n; return chain; },
            limit: (n) => { _limit = n; return chain; },
            then: (resolve, reject) => buildAndExec().then(resolve, reject),
        };
        return chain;
    },

    /** COUNT */
    countDocuments: async (query = {}) => {
        const db = getDb();
        let sql = 'SELECT COUNT(*) as cnt FROM users WHERE 1=1';
        const args = [];
        if (query.role) { sql += ' AND role = ?'; args.push(query.role); }
        if (query.isActive !== undefined) { sql += ' AND is_active = ?'; args.push(query.isActive ? 1 : 0); }
        if (query.department) { sql += ' AND department = ?'; args.push(query.department); }
        if (query.batch) { sql += ' AND batch = ?'; args.push(query.batch); }
        if (query.semester) { sql += ' AND semester = ?'; args.push(query.semester); }
        if (query.section) { sql += ' AND section = ?'; args.push(query.section); }
        if (query.$or) {
            const likes = [];
            for (const cond of query.$or) {
                const key = Object.keys(cond)[0];
                const colMap = { name: 'name', email: 'email', studentId: 'student_id', enrollmentNo: 'enrollment_no' };
                const col = colMap[key];
                if (col && cond[key]?.$regex) { likes.push(`${col} LIKE ?`); args.push(`%${cond[key].$regex}%`); }
            }
            if (likes.length) sql += ` AND (${likes.join(' OR ')})`;
        }
        const result = await db.execute({ sql, args });
        return Number(result.rows[0].cnt);
    },

    /** FIND BY ID AND UPDATE */
    findByIdAndUpdate: async (id, updates, options = {}) => {
        const db = getDb();
        const colMap = {
            name: 'name', phone: 'phone', bio: 'bio', batch: 'batch',
            semester: 'semester', section: 'section', linkedIn: 'linked_in',
            github: 'github', portfolio: 'portfolio', profileImage: 'profile_image',
            isActive: 'is_active', role: 'role',
            edu10thSchool: 'edu_10th_school', edu10thYear: 'edu_10th_year', edu10thPercent: 'edu_10th_percent',
            edu12thSchool: 'edu_12th_school', edu12thYear: 'edu_12th_year', edu12thPercent: 'edu_12th_percent',
            universityName: 'university_name', universityCgpa: 'university_cgpa',
            skills: 'skills',
        };

        const setParts = [];
        const args = [];

        for (const [key, val] of Object.entries(updates)) {
            const col = colMap[key];
            if (col) {
                setParts.push(`${col} = ?`);
                if (col === 'is_active') args.push(val ? 1 : 0);
                else args.push(val ?? null);
            }
        }
        if (!setParts.length) return User.findById(id);

        setParts.push(`updated_at = datetime('now')`);
        args.push(id);

        await db.execute({ sql: `UPDATE users SET ${setParts.join(', ')} WHERE id = ?`, args });

        if (options.new) return User.findById(id);
        return null;
    },
    findByIdAndDelete: async (id) => {
        const db = getDb();
        const statements = [
            { sql: `DELETE FROM verifications WHERE verified_by = ?`, args: [id] },
            { sql: `DELETE FROM verifications WHERE achievement_id IN (SELECT id FROM achievements WHERE student_id = ?)`, args: [id] },
            { sql: `DELETE FROM achievements WHERE student_id = ?`, args: [id] },
            { sql: `UPDATE achievements SET verified_by = NULL WHERE verified_by = ?`, args: [id] },
            { sql: `DELETE FROM events WHERE created_by = ?`, args: [id] },
            { sql: `DELETE FROM notices WHERE created_by = ?`, args: [id] },
            { sql: `DELETE FROM courses WHERE student_id = ?`, args: [id] },
            { sql: `DELETE FROM projects WHERE student_id = ?`, args: [id] },
            { sql: `DELETE FROM internships WHERE student_id = ?`, args: [id] },
            { sql: `DELETE FROM notifications WHERE user_id = ?`, args: [id] },
            { sql: `DELETE FROM hackathons WHERE created_by = ?`, args: [id] },
            { sql: `DELETE FROM internship_postings WHERE created_by = ?`, args: [id] },
            { sql: `DELETE FROM course_assignments WHERE assigned_by = ?`, args: [id] },
            { sql: `DELETE FROM hackathon_activities WHERE student_id = ?`, args: [id] },
            { sql: `DELETE FROM users WHERE id = ?`, args: [id] }
        ];
        await db.batch(statements, 'write');
        return true;
    },
    deleteMany: async (ids) => {
        const db = getDb();
        if (!ids || ids.length === 0) return true;
        const placeholders = ids.map(() => '?').join(',');

        const statements = [
            { sql: `DELETE FROM verifications WHERE verified_by IN (${placeholders})`, args: ids },
            { sql: `DELETE FROM verifications WHERE achievement_id IN (SELECT id FROM achievements WHERE student_id IN (${placeholders}))`, args: ids },
            { sql: `DELETE FROM achievements WHERE student_id IN (${placeholders})`, args: ids },
            { sql: `UPDATE achievements SET verified_by = NULL WHERE verified_by IN (${placeholders})`, args: ids },
            { sql: `DELETE FROM events WHERE created_by IN (${placeholders})`, args: ids },
            { sql: `DELETE FROM notices WHERE created_by IN (${placeholders})`, args: ids },
            { sql: `DELETE FROM courses WHERE student_id IN (${placeholders})`, args: ids },
            { sql: `DELETE FROM projects WHERE student_id IN (${placeholders})`, args: ids },
            { sql: `DELETE FROM internships WHERE student_id IN (${placeholders})`, args: ids },
            { sql: `DELETE FROM notifications WHERE user_id IN (${placeholders})`, args: ids },
            { sql: `DELETE FROM hackathons WHERE created_by IN (${placeholders})`, args: ids },
            { sql: `DELETE FROM internship_postings WHERE created_by IN (${placeholders})`, args: ids },
            { sql: `DELETE FROM course_assignments WHERE assigned_by IN (${placeholders})`, args: ids },
            { sql: `DELETE FROM hackathon_activities WHERE student_id IN (${placeholders})`, args: ids },
            { sql: `DELETE FROM users WHERE id IN (${placeholders})`, args: ids }
        ];

        await db.batch(statements, 'write');
        return true;
    },
};

module.exports = User;
