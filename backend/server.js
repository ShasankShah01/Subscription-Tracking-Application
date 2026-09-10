const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./config/db');
const seedAdmin = require('./scripts/seedAdmin');

const authRoutes = require('./routes/authRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security: Secure HTTP headers (XSS, clickjacking, MIME sniffing, etc.) ──
app.use(helmet());

// ── Security: Strict CORS – only allow known frontend origins ────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  ...(process.env.PROD_CLIENT_URL ? [process.env.PROD_CLIENT_URL] : []),
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server / same-origin requests (origin is undefined)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS policy: origin '${origin}' is not allowed.`));
  },
  credentials: true,
}));

// ── Security: NoSQL injection sanitisation ───────────────────────────────────
app.use(mongoSanitize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Rate Limiting: 100 requests per 15 minutes per IP on all API routes ──────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,  // Return rate-limit info in RateLimit-* headers
  legacyHeaders: false,   // Disable X-RateLimit-* headers
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' },
});

// Mount API Routes (rate limiter applied at prefix level)
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);

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
