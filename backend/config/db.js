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
    `CREATE TABLE IF NOT EXISTS hackathon_activities (
            id               TEXT PRIMARY KEY,
            student_id       TEXT NOT NULL,
            hackathon_title  TEXT NOT NULL,
            action_type      TEXT NOT NULL DEFAULT 'visit',
            created_at       TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (student_id) REFERENCES users(id)
        )`
  ], 'write');
};

const seedDemoUsers = async (client) => {
  const demoUsers = [
    { name: 'Demo Student', email: 'student@soeit.ac.in', enrollmentNo: 'AJU/221403', password: 'Test@123', role: 'student', department: 'CSE', batch: '2022', semester: 4 },
    { name: 'Demo Faculty', email: 'faculty@soeit.ac.in', enrollmentNo: 'AJU/FACULTY', password: 'Faculty@123', role: 'faculty', department: 'CSE' },
    { name: 'System Admin', email: 'admin@soeit.ac.in', enrollmentNo: 'AJU/ADMIN', password: 'Admin@123', role: 'admin', department: 'Other' },
  ];

  for (const u of demoUsers) {
    const existing = await client.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [u.email] });
    if (existing.rows.length === 0) {
      const salt = await bcrypt.genSalt(12);
      const hashed = await bcrypt.hash(u.password, salt);
      const { nanoid } = await import('nanoid');
      const id = nanoid();
      await client.execute({
        sql: `INSERT INTO users (id, name, email, password, role, department, enrollment_no, batch, semester, is_active)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        args: [id, u.name, u.email, hashed, u.role, u.department, u.enrollmentNo, u.batch || null, u.semester || null],
      });
      console.log(`👤 Demo ${u.role} created (${u.enrollmentNo})`);
    } else {
      console.log(`🔄 Demo ${u.role} already exists, skipping.`);
    }
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

    await seedDemoUsers(client);
    console.log('🌱 Demo users seeded');

  } catch (error) {
    console.error('❌ Turso Connection Failed:', error.message);
    console.log('🔄 Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

module.exports = { connectDB, getDb };
