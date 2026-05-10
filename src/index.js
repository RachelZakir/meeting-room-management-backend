const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

dotenv.config();

const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminExportRoutes = require('./routes/adminExportRoutes');

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ CORS Configuration - NO app.options('*', ...) line!
const corsOptions = {
  origin: 'https://meeting-room-management-frontend.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cookie',
    'X-Requested-With',
  ],
  exposedHeaders: ['Set-Cookie', 'Authorization'],
};

// Apply CORS middleware
app.use(cors(corsOptions));

// ✅ IMPORTANT: Remove this line if it exists:
// app.options('*', cors(corsOptions));  // ← DELETE THIS LINE

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Meeting Room Management API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    endpoints: {
      health: 'GET /health',
      auth: 'POST /api/auth/login',
      refresh: 'POST /api/auth/refresh',
      users: 'POST /api/users',
      rooms: 'GET /api/rooms',
      bookings: 'GET /api/bookings',
    },
  });
});

// Your API routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', roomRoutes);
app.use('/api', bookingRoutes);
app.use('/api', adminExportRoutes);

// 404 handler - NO '*' wildcard!
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot find ${req.originalUrl} on this server`,
  });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(
    `✅ CORS enabled for: https://meeting-room-management-frontend.vercel.app`
  );
});
