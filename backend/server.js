const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const path = require('path');

// Load env vars
dotenv.config({ path: './.env' });

// Route imports
const authRoutes = require('./routes/authRoutes');
const issueRoutes = require('./routes/issueRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Middleware imports
const errorMiddleware = require('./middleware/errorMiddleware');

// Connect to database
const connectDB = require('./config/db');
connectDB();

const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourfrontenddomain.com'] 
    : '*',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Prevent XSS attacks
app.use(xss());

// Sanitize data
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp());

// Compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS 
    ? parseInt(process.env.RATE_LIMIT_WINDOW_MS) 
    : 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS 
    ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) 
    : 100,
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiting to auth routes only
app.use('/api/v1/auth', limiter);

// Static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/issues', issueRoutes);
app.use('/api/v1/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot find ${req.originalUrl} on this server`
  });
});

// Error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});