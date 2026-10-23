const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema(
  { 
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    ipAddress: { type: String, default: 'Unknown' },
    userAgent: { type: String, default: 'Unknown' },
    status: { type: String, enum: ['unread','read','archived'], default: 'unread' } 
  },
  { timestamps: true }
);
module.exports = mongoose.model('Message', messageSchema);