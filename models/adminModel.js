const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const Admin = new mongoose.model('Admin', adminSchema);
module.exports = Admin