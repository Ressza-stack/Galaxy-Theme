const express = require('express');
const { body, param } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { createMessage, getMessages, updateStatus, deleteMessage } = require('../controllers/messageController');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

// Batasi maksimal 3 pesan per 15 menit per IP
const contactLimiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 3, 
  message: { success: false, message: 'Terlalu banyak pesan. Anda hanya bisa mengirim 3 pesan per 15 menit.' },
  standardHeaders: true, 
  legacyHeaders: false 
});

router.post('/', contactLimiter, [
  body('name').isString().trim().isLength({ min: 2, max: 80 }),
  body('email').isEmail().normalizeEmail(),
  body('subject').isString().trim().isLength({ min: 2, max: 150 }),
  body('message').isString().trim().isLength({ min: 10, max: 5000 })
], validate, createMessage);

router.get('/', requireAuth, getMessages);
router.patch('/:id/status', requireAuth,
  [param('id').isMongoId(), body('status').isIn(['unread','read','archived'])],
  validate, updateStatus);
router.delete('/:id', requireAuth, [param('id').isMongoId()], validate, deleteMessage);

module.exports = router;