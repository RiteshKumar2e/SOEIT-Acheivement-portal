const multer = require('multer');
const path = require('path');

// Memory storage to handle files as buffers for DB insertion
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = /image\/(jpeg|jpg|png|gif)|application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)/.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error('Only images (JPG, PNG, GIF), PDFs, and Word documents are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
});

module.exports = upload;
