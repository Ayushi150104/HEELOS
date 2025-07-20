const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./Config/db');
const authRoutes = require('./Routes/Auth');
const scheduleRoutes = require('./Routes/Schedule');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', scheduleRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to HEELOS backend!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
