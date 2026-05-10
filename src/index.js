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
const PORT = process.env.PORT || 3000;

// ✅ CORS Configuration - FIXED VERSION (no '*' in app.options)
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
  optionsSuccessStatus: 200,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// ✅ FIXED: Use app.use for OPTIONS instead of app.options('*', ...)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// Test endpoint
app.get('/test-cors', (req, res) => {
  res.json({
    message: 'CORS is working!',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Meeting Room Management API',
    version: '1.0.0',
    cors_enabled: true,
  });
});

// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', roomRoutes);
app.use('/api', bookingRoutes);
app.use('/api', adminExportRoutes);
app.use(errorHandler);

// Bind to 0.0.0.0 for Render compatibility
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ CORS enabled for: ${corsOptions.origin}`);
});
