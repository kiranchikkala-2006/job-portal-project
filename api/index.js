import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from '../backend/server/config/db.js';

import authRoutes from '../backend/server/routes/authRoutes.js';
import userRoutes from '../backend/server/routes/userRoutes.js';
import jobRoutes from '../backend/server/routes/jobRoutes.js';
import applicationRoutes from '../backend/server/routes/applicationRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error:', error);

    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Job Portal API',
    time: new Date()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

app.use((err, req, res, next) => {
  console.error('API Error:', err);

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

export default app;