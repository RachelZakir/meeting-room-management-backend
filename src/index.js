// this is to test branching on git
//this is to test branching on git 2nd time dear
// now ots to check the ci and cd
//Import packages express, dotenv, cors and morgan
const express = require('express'); // create z server and api
const dotenv = require('dotenv'); // loads my.env variables
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

dotenv.config(); // load my env variables read my env file
//import my route and middleware
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminExportRoutes = require('./routes/adminExportRoutes');

const app = express(); // create my express app
const PORT = process.env.PORT || 3000; // Set port

const allowedOrigins = [
  'http://localhost:3000',
  'https://meeting-room-management-frontend.vercel.app',
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Handle preflight requests globally
app.options('*', cors());

// Then other middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// Routes its the end-point/homepage for apis
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
