const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./Config/db');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./Routes/Schedule');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database first
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to HEELOS backend!');
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
