const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
    {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: [true, 'Achievement title is required'], trim: true, maxlength: [200, 'Title cannot exceed 200 characters'] },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['Academic', 'Sports', 'Cultural', 'Technical', 'Research', 'Internship', 'Certification', 'Competition', 'Community Service', 'Other'],
        },
        description: { type: String, required: [true, 'Description is required'], maxlength: [2000, 'Description cannot exceed 2000 characters'] },
        level: { type: String, enum: ['International', 'National', 'State', 'University', 'College', 'Department'], required: [true, 'Level is required'] },
        date: { type: Date, required: [true, 'Achievement date is required'] },
        institution: { type: String, trim: true },
        certificateUrl: { type: String, default: '' },
        proofFiles: [{ filename: String, originalname: String, url: String, uploadedAt: { type: Date, default: Date.now } }],
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        remarks: { type: String, maxlength: [500, 'Remarks cannot exceed 500 characters'] },
        verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        verifiedAt: Date,
        isPublic: { type: Boolean, default: true },
        tags: [{ type: String }],
        points: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Index for faster queries
achievementSchema.index({ studentId: 1, status: 1 });
achievementSchema.index({ category: 1, level: 1 });
achievementSchema.index({ status: 1, createdAt: -1 });

// Calculate points based on level (async style — Mongoose 9 compatible)
achievementSchema.pre('save', async function () {
    const pointsMap = { International: 100, National: 75, State: 50, University: 30, College: 20, Department: 10 };
    if (this.isModified('level') || this.isNew) {
        this.points = pointsMap[this.level] || 10;
    }
});

module.exports = mongoose.model('Achievement', achievementSchema);
