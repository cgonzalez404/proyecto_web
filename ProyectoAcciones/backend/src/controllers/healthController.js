const healthCheck = (_req, res) => {
  res.json({
    success: true,
    service: 'stockmarket-pro-backend',
    status: 'ok',
  });
};

module.exports = {
  healthCheck,
};
