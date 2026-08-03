const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'stockmarket-pro-backend' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
