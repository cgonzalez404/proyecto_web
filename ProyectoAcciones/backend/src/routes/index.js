const express = require('express');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const marketRoutes = require('./marketRoutes');

const router = express.Router();

router.use(healthRoutes);
router.use('/auth', authRoutes);
router.use('/market', marketRoutes);

module.exports = router;
