require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/ai', require('./routes/ai'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running on port ${PORT}`);
});
