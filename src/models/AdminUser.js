const mongoose = require('mongoose');

const AdminUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /.+\@.+\..+/
    },
    password: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]{10}$/
    },
    documents: {
        type: Array,

    },
    isActive: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['admin', 'manager'],
        default: 'manager'
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: null
    },
    tokens: {
        type: Array,
        default: []
    },
    otps: {
        type: Array,
        default: []
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('AdminUser', AdminUserSchema);