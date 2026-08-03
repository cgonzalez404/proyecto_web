const { healthModel } = require('../models');

const healthCheck = (_req, res) => {
  res.json({
    success: true,
    ...healthModel,
    status: 'ok',
  });
};

module.exports = {
  healthCheck,
};
