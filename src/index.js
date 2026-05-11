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
const PORT = process.env.PORT || 3001;

// ✅ FIXED CORS - Allow your frontend domain
const allowedOrigins = [
  'https://meeting-room-management-frontend.vercel.app',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('Blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cookie',
      'X-Requested-With',
    ],
  })
);

// Handle preflight requests
app.options(/.*/, (req, res) => {
  res.header(
    'Access-Control-Allow-Origin',
    'https://meeting-room-management-frontend.vercel.app'
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS, PATCH'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Cookie'
  );
  res.sendStatus(200);
});

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
  res
    .status(200)
    .json({ status: 'healthy', timestamp: new Date().toISOString() });
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

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, message: `Cannot find ${req.originalUrl}` });
});

app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ CORS enabled for frontend`);
});
