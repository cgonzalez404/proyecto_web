const express = require('express');
const { purchaseStock, sellStock } = require('../controllers/purchaseController');
const { authenticateToken } = require('../middleware/authenticateToken');

const router = express.Router();

router.post('/buy', authenticateToken, purchaseStock);
router.post('/sell', authenticateToken, sellStock);

module.exports = router;
