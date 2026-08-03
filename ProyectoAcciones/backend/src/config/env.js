const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'stockmarket-pro-secret',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/stockmarket_pro',
  alphaVantageKey: process.env.ALPHA_VANTAGE_API_KEY || 'demo',
};
