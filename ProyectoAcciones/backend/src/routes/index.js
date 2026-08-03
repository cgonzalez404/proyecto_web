const express = require('express');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const marketRoutes = require('./marketRoutes');
const purchaseRoutes = require('./purchaseRoutes');

const router = express.Router();

router.use(healthRoutes);
router.use('/auth', authRoutes);
router.use('/market', marketRoutes);
router.use('/portfolio', purchaseRoutes);

module.exports = router;
