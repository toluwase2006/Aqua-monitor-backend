const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.routes');
const dataEntryRoutes = require('./routes/dataentry.routes');
const cors = require('cors');
require("dotenv").config();

const app = express();


// ✅ Enable CORS before routes
app.use(cors({
  origin: [
    "http://localhost:8080",
    'https://aqua-monitor-pro.onrender.com',
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

//  Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Routes
app.use('/api/auth', authRoutes);
app.use('/api/dataentry', dataEntryRoutes);

//  Dynamic port for Render
const PORT = process.env.PORT || 5000;

//  Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error(' Failed to connect to MongoDB', err);
  });
