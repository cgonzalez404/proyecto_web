const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { port } = require('./config/env');
const routes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.json({
    success: true,
    app: 'StockMarket Pro API',
    version: '1.0.0',
  });
});

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

const startServer = () => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

module.exports = {
  app,
  startServer,
};
