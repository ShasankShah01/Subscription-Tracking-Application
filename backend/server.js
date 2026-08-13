const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./config/db');
const seedAdmin = require('./scripts/seedAdmin');

const authRoutes = require('./routes/authRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS configuration for HttpOnly cookie credential transport
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/admin', adminRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'STArt API Engine is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Root Welcome Route
app.get('/', (req, res) => {
  res.status(200).json({
    app: 'STArt - Subscription Tracking Application API',
    version: '1.0.0',
    status: 'Active',
  });
});

// Start Server & Run Admin Seeding
app.listen(PORT, async () => {
  console.log(`STArt Backend Server listening on port: ${PORT}`);
  // Execute Master Admin Seeding automatically on server boot
  await seedAdmin();
});
