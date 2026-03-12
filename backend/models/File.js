const { getDb } = require('../config/db');
const zlib = require('zlib');
const { promisify } = require('util');

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

const genId = async () => {
    const { nanoid } = await import('nanoid');
    return nanoid();
};

const File = {
    /** UPLOAD FILE TO DB (Compressed) */
    upload: async (buffer, filename, mimetype) => {
        const db = getDb();
        const id = await genId();

        // Compress buffer before saving
        const compressedData = await gzip(buffer);

        await db.execute({
            sql: `INSERT INTO files (id, filename, mimetype, data) VALUES (?, ?, ?, ?)`,
            args: [id, filename, mimetype, compressedData],
        });

        return id;
    },

    /** GET FILE FROM DB (Decompressed) */
    findById: async (id) => {
        const db = getDb();
        const res = await db.execute({
            sql: `SELECT * FROM files WHERE id = ?`,
            args: [id],
        });

        if (res.rows.length === 0) return null;
        
        const file = res.rows[0];
        
        // Try to decompress data (handle potential old uncompressed files)
        try {
            file.data = await gunzip(Buffer.from(file.data));
        } catch (err) {
            // If decompression fails, assume it was not compressed (legacy file)
            file.data = Buffer.from(file.data);
        }

        return file;
    },

    /** DELETE FILE FROM DB */
    delete: async (id) => {
        const db = getDb();
        await db.execute({
            sql: `DELETE FROM files WHERE id = ?`,
            args: [id],
        });
    }
};

module.exports = File;
