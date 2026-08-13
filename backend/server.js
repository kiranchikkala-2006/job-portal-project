import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import { connectDB } from './server/config/db.js';
import { seedDatabase } from './server/seed.js';

import authRoutes from './server/routes/authRoutes.js';
import userRoutes from './server/routes/userRoutes.js';
import jobRoutes from './server/routes/jobRoutes.js';
import applicationRoutes from './server/routes/applicationRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.resolve(__dirname, 'uploads');
const envPath = path.resolve(__dirname, '../.env');

dotenv.config({ path: envPath });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Job Portal API',
    time: new Date()
  });
});

let databasePromise = null;

async function initializeDatabase() {
  if (!databasePromise) {
    databasePromise = (async () => {
      await connectDB();
      await seedDatabase();
    })();
  }

  return databasePromise;
}

app.use(async (req, res, next) => {
  if (req.path === '/api/health') {
    return next();
  }

  try {
    await initializeDatabase();
    next();
  } catch (error) {
    console.error('Database initialization failed:', error);

    res.status(500).json({
      message: 'Database connection failed',
      error: error.message
    });
  }
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