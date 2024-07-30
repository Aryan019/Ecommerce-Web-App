// models/session.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const sessionSchema = new Schema({
    user_id: String,
    loginTime: Date,
    logoutTime: Date,
    ipAddress: String
});

module.exports = mongoose.model('Session', sessionSchema);
