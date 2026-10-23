const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { login, logout, me } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });

router.post('/login', loginLimiter,
  [body('username').isString().trim().notEmpty(), body('password').isString().notEmpty()],
  validate, login);
router.post('/logout', requireAuth, logout);
router.get('/me', me);
module.exports = router;
