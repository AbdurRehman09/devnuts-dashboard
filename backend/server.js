const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/devnuts_dashboard', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Routes
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/meetings', require('./routes/meetings'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
