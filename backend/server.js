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

// --- Boot Sequence: Connect DB → Seed → Listen ---
(async () => {
  // connectDB returns { usingFallback: boolean } so the seeder knows which
  // admin accounts to create (fallback state needs the dev admin too).
  const { usingFallback } = await connectDB();

  // Seed admin accounts after the DB connection is confirmed ready
  await seedAdmin({ usingFallback });

  app.listen(PORT, () => {
    console.log('');
    console.log(`🚀 STArt Backend Server listening on port: ${PORT}`);
    console.log(`   DB mode: ${usingFallback ? '⚠️  In-Memory (volatile)' : '✅ Primary MongoDB (persistent)'}`);
    console.log('');
  });
})();
