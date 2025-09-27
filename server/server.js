const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./Config/db');
const authRoutes = require('./Routes/Auth');
const scheduleRoutes = require('./Routes/Schedule');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

const allowedOrigins = [
  process.env.CLIENT_URL,       // deployed frontend
  "http://localhost:3000",      // local frontend
  "http://localhost:3001",      // optional
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', scheduleRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to HEELOS backend!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
