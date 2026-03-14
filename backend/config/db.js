const { createClient } = require('@libsql/client');
const bcrypt = require('bcryptjs');

let db = null;

const getDb = () => {
  if (!db) throw new Error('Database not initialized. Call connectDB() first.');
  return db;
};

const initSchema = async (client) => {
  await client.batch([
    `CREATE TABLE IF NOT EXISTS users (
            id              TEXT PRIMARY KEY,
            name            TEXT NOT NULL,
            email           TEXT NOT NULL UNIQUE,
            password        TEXT NOT NULL,
            role            TEXT NOT NULL DEFAULT 'student',
            department      TEXT NOT NULL,
            enrollment_no   TEXT UNIQUE,
            student_id      TEXT,
            phone           TEXT,
            bio             TEXT,
            profile_image   TEXT DEFAULT '',
            batch           TEXT,
            semester        INTEGER,
            section         TEXT,
            is_active       INTEGER DEFAULT 1,
            is_verified     INTEGER DEFAULT 0,
            linked_in       TEXT DEFAULT '',
            github          TEXT DEFAULT '',
            portfolio       TEXT DEFAULT '',
            reset_password_token    TEXT,
            reset_password_expire   TEXT,
            last_login      TEXT,
            created_at      TEXT DEFAULT (datetime('now')),
            updated_at      TEXT DEFAULT (datetime('now'))
        )`,
    `CREATE TABLE IF NOT EXISTS achievements (
            id              TEXT PRIMARY KEY,
            student_id      TEXT NOT NULL,
            title           TEXT NOT NULL,
            category        TEXT NOT NULL,
            description     TEXT NOT NULL,
            level           TEXT NOT NULL,
            date            TEXT NOT NULL,
            institution     TEXT,
            certificate_url TEXT DEFAULT '',
            proof_files     TEXT DEFAULT '[]',
            status          TEXT DEFAULT 'pending',
            remarks         TEXT,
            verified_by     TEXT,
            verified_at     TEXT,
            is_public       INTEGER DEFAULT 1,
            tags            TEXT DEFAULT '[]',
            points          INTEGER DEFAULT 0,
            created_at      TEXT DEFAULT (datetime('now')),
            updated_at      TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (student_id) REFERENCES users(id),
            FOREIGN KEY (verified_by) REFERENCES users(id)
        )`,
    `CREATE TABLE IF NOT EXISTS verifications (
            id              TEXT PRIMARY KEY,
            achievement_id  TEXT NOT NULL,
            verified_by     TEXT NOT NULL,
            action          TEXT NOT NULL,
            remarks         TEXT,
            previous_status TEXT,
            new_status      TEXT,
            created_at      TEXT DEFAULT (datetime('now')),
            updated_at      TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (achievement_id) REFERENCES achievements(id),
            FOREIGN KEY (verified_by) REFERENCES users(id)
        )`,
    `CREATE TABLE IF NOT EXISTS events (
            id                  TEXT PRIMARY KEY,
            title               TEXT NOT NULL,
            description         TEXT NOT NULL,
            category            TEXT NOT NULL,
            date                TEXT NOT NULL,
            venue               TEXT NOT NULL,
            registration_link   TEXT,
            created_by          TEXT NOT NULL,
            created_at          TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (created_by) REFERENCES users(id)
        )`,
    `CREATE TABLE IF NOT EXISTS notices (
            id          TEXT PRIMARY KEY,
            title       TEXT NOT NULL,
            content     TEXT NOT NULL,
            priority    TEXT DEFAULT 'Medium',
            created_by  TEXT NOT NULL,
            created_at  TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (created_by) REFERENCES users(id)
        )`,
    `CREATE TABLE IF NOT EXISTS courses (
            id              TEXT PRIMARY KEY,
            student_id      TEXT NOT NULL,
            course_name     TEXT NOT NULL,
            platform        TEXT NOT NULL,
            status          TEXT DEFAULT 'Ongoing',
            progress        INTEGER DEFAULT 0,
            start_date      TEXT,
            completion_date TEXT,
            certificate_url TEXT,
            created_at      TEXT DEFAULT (datetime('now')),
            updated_at      TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (student_id) REFERENCES users(id)
        )`,
    `CREATE TABLE IF NOT EXISTS hackathons (
            id               TEXT PRIMARY KEY,
            title            TEXT NOT NULL,
            type             TEXT NOT NULL,
            img_url          TEXT,
            prize            TEXT,
            students_count   TEXT,
            deadline_date    TEXT,
            badge            TEXT,
            link             TEXT NOT NULL,
            created_by       TEXT NOT NULL,
            created_at       TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (created_by) REFERENCES users(id)
        )`,
    `CREATE TABLE IF NOT EXISTS hackathon_activities (
            id               TEXT PRIMARY KEY,
            student_id       TEXT NOT NULL,
            hackathon_title  TEXT NOT NULL,
            action_type      TEXT NOT NULL DEFAULT 'visit',
            created_at       TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (student_id) REFERENCES users(id)
        )`,
    `CREATE TABLE IF NOT EXISTS files (
            id               TEXT PRIMARY KEY,
            filename         TEXT NOT NULL,
            mimetype         TEXT NOT NULL,
            data             BLOB NOT NULL,
            created_at       TEXT DEFAULT (datetime('now'))
        )`,
    `CREATE TABLE IF NOT EXISTS internships (
            id               TEXT PRIMARY KEY,
            student_id       TEXT NOT NULL,
            company_name     TEXT NOT NULL,
            role             TEXT NOT NULL,
            start_date       TEXT,
            end_date         TEXT,
            status           TEXT DEFAULT 'Ongoing',
            description      TEXT,
            certificate_url  TEXT,
            location         TEXT,
            internship_type  TEXT, -- Part-time, Full-time, Remote, etc.
            created_at       TEXT DEFAULT (datetime('now')),
            updated_at       TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (student_id) REFERENCES users(id)
        )`,
    `CREATE TABLE IF NOT EXISTS internship_postings (
            id               TEXT PRIMARY KEY,
            company_name     TEXT NOT NULL,
            role             TEXT NOT NULL,
            location         TEXT,
            stipend          TEXT,
            deadline         TEXT,
            description      TEXT,
            requirements     TEXT,
            apply_link       TEXT,
            created_by       TEXT NOT NULL,
            created_at       TEXT DEFAULT (datetime('now')),
            updated_at       TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (created_by) REFERENCES users(id)
        )`,
    `CREATE TABLE IF NOT EXISTS projects (
            id               TEXT PRIMARY KEY,
            student_id       TEXT NOT NULL,
            title            TEXT NOT NULL,
            description      TEXT NOT NULL,
            github_link      TEXT,
            live_link        TEXT,
            tech_stack       TEXT,
            status           TEXT DEFAULT 'Completed',
            created_at       TEXT DEFAULT (datetime('now')),
            updated_at       TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (student_id) REFERENCES users(id)
        )`,
    `CREATE TABLE IF NOT EXISTS notifications (
            id          TEXT PRIMARY KEY,
            user_id     TEXT NOT NULL,
            type        TEXT NOT NULL,
            title       TEXT NOT NULL,
            message     TEXT NOT NULL,
            link        TEXT,
            is_read     INTEGER DEFAULT 0,
            created_at  TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`,
    `CREATE TABLE IF NOT EXISTS course_assignments (
            id              TEXT PRIMARY KEY,
            course_name     TEXT NOT NULL,
            subject         TEXT NOT NULL,
            description     TEXT,
            course_link     TEXT DEFAULT '',
            department      TEXT NOT NULL,
            semester        INTEGER NOT NULL,
            assigned_by     TEXT NOT NULL,
            created_at      TEXT DEFAULT (datetime('now')),
            updated_at      TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (assigned_by) REFERENCES users(id)
        )`,
    // Indexing for high-speed performance (O(1) lookups)
    `CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`,
    `CREATE INDEX IF NOT EXISTS idx_users_dept ON users(department)`,
    `CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active)`,
    `CREATE INDEX IF NOT EXISTS idx_users_batch ON users(batch)`,
    `CREATE INDEX IF NOT EXISTS idx_achievements_student_status ON achievements(student_id, status)`,
    `CREATE INDEX IF NOT EXISTS idx_achievements_public_status ON achievements(is_public, status)`,
    `CREATE INDEX IF NOT EXISTS idx_achievements_category_status ON achievements(category, status)`,
    `CREATE INDEX IF NOT EXISTS idx_notices_author ON notices(created_by)`,
    `CREATE INDEX IF NOT EXISTS idx_courses_student ON courses(student_id)`,
    `CREATE INDEX IF NOT EXISTS idx_projects_student ON projects(student_id)`,
    `CREATE INDEX IF NOT EXISTS idx_internships_student ON internships(student_id)`,
    `CREATE INDEX IF NOT EXISTS idx_events_author ON events(created_by)`,
    `CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read)`,
    `CREATE INDEX IF NOT EXISTS idx_course_assignments_dept_sem ON course_assignments(department, semester)`,
    `CREATE INDEX IF NOT EXISTS idx_course_assignments_faculty ON course_assignments(assigned_by)`,
    `CREATE INDEX IF NOT EXISTS idx_files_created ON files(created_at)`
  ], 'write');

  // migration for existing systems
  try {
    await client.execute(`ALTER TABLE course_assignments ADD COLUMN course_link TEXT DEFAULT ''`);
    console.log('✅ Migration: added course_link to course_assignments');
  } catch (err) {
    // column likely exists or other non-critical error
  }
};

const seedDemoUsers = async (client) => {
  const demoUsers = [
    { name: 'Demo Student', email: 'student@soeit.ac.in', enrollmentNo: 'AJU/221403', password: 'Test@123', role: 'student', department: 'CSE', batch: '2022', semester: 4 },
    { name: 'Demo Faculty', email: 'faculty@soeit.ac.in', enrollmentNo: 'AJU/FACULTY', password: 'Faculty@123', role: 'faculty', department: 'CSE' },
    { name: 'System Admin', email: 'admin@soeit.ac.in', enrollmentNo: 'AJU/ADMIN', password: 'Admin@123', role: 'admin', department: 'Other' },
  ];

  for (const u of demoUsers) {
    try {
      const existing = await client.execute('SELECT id FROM users WHERE email = ?', [u.email]);
      if (!existing || !existing.rows || existing.rows.length === 0) {
        const salt = await bcrypt.genSalt(12);
        const hashed = await bcrypt.hash(u.password, salt);
        const id = Math.random().toString(36).substring(2, 15);
        await client.execute(
          `INSERT INTO users (id, name, email, password, role, department, enrollment_no, batch, semester, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [id, u.name, u.email, hashed, u.role, u.department, u.enrollmentNo, u.batch || null, u.semester || null]
        );
        console.log(`👤 Demo ${u.role} created (${u.enrollmentNo})`);
      } else {
        console.log(`🔄 Demo ${u.role} already exists, skipping.`);
      }
    } catch (err) {
      console.error(`❌ Error seeding user ${u.email}:`, err.message);
    }
  }
};

const seedHackathons = async (client) => {
  try {
    const countRes = await client.execute('SELECT COUNT(*) FROM hackathons');
    if (!countRes || !countRes.rows || countRes.rows.length === 0) return;

    const count = Number(countRes.rows[0][0] || 0);
    if (count > 0) return;

    const adminRes = await client.execute("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
    if (!adminRes || !adminRes.rows || adminRes.rows.length === 0) return;

    const adminId = adminRes.rows[0].id || adminRes.rows[0][0];
    if (!adminId) return;

    const hacks = [
      { title: 'Smart India Hackathon 2026', type: 'Govt of India', prize: '₹1,00,000', badge: 'Premier', link: 'https://www.sih.gov.in/', deadline: 'Aug 2026' },
      { title: 'Google AI Challenge 2026', type: 'AI / ML', prize: '$50,000', badge: 'AI', link: 'https://ai.google/challenges/', deadline: 'Mar 2026' },
      { title: 'MLH Global Hackathon 2026', type: 'Web Development', prize: '$20,000', badge: 'Web', link: 'https://mlh.io/', deadline: 'Rolling' }
    ];

    for (const h of hacks) {
      const hackId = 'hack_' + Math.random().toString(36).substring(2, 10);
      await client.execute(
        `INSERT INTO hackathons (id, title, type, prize, badge, link, deadline_date, created_by, students_count)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [hackId, h.title, h.type, h.prize, h.badge, h.link, h.deadline, adminId, '10k+']
      );
    }
  } catch (err) {
    console.log('⚠️ Hackathon seeding skipped:', err.message);
  }
};

const connectDB = async () => {
  try {
    const url = process.env.TURSO_URL;

    if (!url) throw new Error('TURSO_URL is not set in environment variables');

    const client = createClient({ url });

    // Verify connection
    await client.execute('SELECT 1');
    console.log('✅ Turso (LibSQL) Connected');

    await initSchema(client);
    console.log('📐 Schema initialized');

    db = client;

    // Seeding disabled for production environment to prevent demo data persistence
    // await seedDemoUsers(client);
    // await seedHackathons(client);

  } catch (error) {
    console.error('❌ Turso Connection Failed:', error.message);
    console.log('🔄 Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

module.exports = { connectDB, getDb };
