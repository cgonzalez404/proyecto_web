const express = require('express');
const { register, login, logout, me } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authenticateToken');
const { validateRegister, validateLogin } = require('../middleware/validateAuth');

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', authenticateToken, logout);
router.get('/me', authenticateToken, me);

module.exports = router;
