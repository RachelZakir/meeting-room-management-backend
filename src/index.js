//Import packages express, dotenv, cors and morgan
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

dotenv.config();

//import my route and middleware
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminExportRoutes = require('./routes/adminExportRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://meeting-room-management-frontend.vercel.app',
];

// ✅ Correct CORS setup
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight requests

// Other middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
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

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', roomRoutes);
app.use('/api', bookingRoutes);
app.use('/api', adminExportRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}`);
  console.log(`📋 Test endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/users`);
  console.log(`   POST http://localhost:${PORT}/api/rooms`);
  console.log(`   GET http://localhost:${PORT}/api/rooms?capacity=5&limit=10`);
});
