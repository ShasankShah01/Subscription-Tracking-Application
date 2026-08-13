const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/subscription_tracker';

mongoose.connect(mongoURI)
  .then(() => console.log('Successfully connected to MongoDB Database.'))
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

// Simple Health Check/Welcome Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Subscription Tracking Application API',
    status: 'Healthy'
  });
});

// A boilerplate route for subscription tracking APIs
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API server is up and running'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
