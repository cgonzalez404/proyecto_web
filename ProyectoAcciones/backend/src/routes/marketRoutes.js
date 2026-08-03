const express = require('express');
const { getStockQuote } = require('../controllers/marketController');

const router = express.Router();

router.get('/quote', getStockQuote);

module.exports = router;
