const Message = require('../models/Message');

exports.createMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const doc = await Message.create({ 
      name, email, subject, message, ipAddress, userAgent 
    });
    res.status(201).json({ success: true, data: doc });
  } catch (err) { next(err); }
};

exports.getMessages = async (req, res, next) => {
  try { 
    // Ambil semua pesan, urutkan dari yang terbaru
    const messages = await Message.find().sort({ createdAt: -1 }); 
    res.json({ success: true, data: messages }); 
  }
  catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['unread','read','archived'].includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' });
    const msg = await Message.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, data: msg });
  } catch (err) { next(err); }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) { next(err); }
};