require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const requestRoutes = require('./routes/requestRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
//app.use('/uploads', express.static('uploads'));

// CORS middleware — must come BEFORE routes
app.use(cors({
  origin: 'http://localhost:5173',
credentials: true, // Only needed if you use cookies or auth headers
}));

// Body parser middleware
app.use(express.json());

// API Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/requests', requestRoutes);
app.use('/admin', adminRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/mentors', require('./routes/mentorRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Sync DB and start server
const PORT = process.env.PORT || 5000;

sequelize.sync()
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('DB sync error:', err);
  });
