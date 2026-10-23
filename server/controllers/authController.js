const Admin = require('../models/Admin');
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const ok = await admin.comparePassword(password);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    req.session.adminId = admin._id.toString();
    res.json({ success: true, data: { username: admin.username } });
  } catch (err) { next(err); }
};
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ success: false, message: 'Logout failed' });
    res.clearCookie('sid');
    res.json({ success: true, message: 'Logged out' });
  });
};
exports.me = async (req, res, next) => {
  try {
    if (!req.session.adminId) return res.status(401).json({ success: false, message: 'Not authenticated' });
    const admin = await Admin.findById(req.session.adminId).select('username');
    if (!admin) return res.status(401).json({ success: false, message: 'Not authenticated' });
    res.json({ success: true, data: admin });
  } catch (err) { next(err); }
};
