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

// ✅ FIXED CORS CONFIGURATION
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://meeting-room-management-frontend.vercel.app',
  'https://meeting-room-management-frontend.vercel.app',
  /\.vercel\.app$/,
  /\.onrender\.com$/,
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    // Check if origin is allowed
    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return allowedOrigin === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('❌ Blocked CORS request from:', origin);
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
  exposedHeaders: ['Set-Cookie', 'Authorization'],
  optionsSuccessStatus: 200,
};

// ✅ Apply CORS middleware BEFORE all routes
app.use(cors(corsOptions));

// ✅ Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// ✅ Log all requests for debugging (put after CORS)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Meeting Room Management API',
    version: '1.0.0',
    endpoints: {
      users: 'POST /api/users - Register user',
      rooms: 'GET /api/rooms - List rooms',
      rooms_create: 'POST /api/rooms - Create room',
    },
  });
});

// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', roomRoutes);
app.use('/api', bookingRoutes);
app.use('/api', adminExportRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}`);
  console.log(`✅ CORS enabled for origins:`, allowedOrigins);
});
