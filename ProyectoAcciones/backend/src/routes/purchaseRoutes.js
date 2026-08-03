const express = require('express');
const { purchaseStock } = require('../controllers/purchaseController');
const { authenticateToken } = require('../middleware/authenticateToken');

const router = express.Router();

router.post('/buy', authenticateToken, purchaseStock);

module.exports = router;
