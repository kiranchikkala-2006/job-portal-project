import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import net from 'node:net';

import { connectDB } from './server/config/db.js';
import { seedDatabase } from './server/seed.js';

import authRoutes from './server/routes/authRoutes.js';
import userRoutes from './server/routes/userRoutes.js';
import jobRoutes from './server/routes/jobRoutes.js';
import applicationRoutes from './server/routes/applicationRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = __dirname;
const frontendDir = path.resolve(backendDir, '../frontend');
const uploadsDir = path.resolve(backendDir, 'uploads');
const envPath = path.resolve(__dirname, '../.env');

dotenv.config({ path: envPath });

function getAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const tester = net.createServer();

    tester.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(getAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });

    tester.once('listening', () => {
      const port = tester.address().port;
      tester.close(() => resolve(port));
    });

    tester.listen(startPort, '0.0.0.0');
  });
}

async function startServer() {
  const app = express();
  const requestedPort = Number(process.env.PORT) || 3000;
  const PORT = await getAvailablePort(requestedPort);

  // Connect to DB and seed
  await connectDB();
  await seedDatabase();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Static uploads directory
  app.use('/uploads', express.static(uploadsDir));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Job Portal API', time: new Date() });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/applications', applicationRoutes);

  // Global Error Handler for API
  app.use('/api', (err, req, res, next) => {
    console.error('API Error:', err.stack);
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
    });
  });

  // Frontend is served separately during development. In production we can still serve the built app.
  if (process.env.NODE_ENV === 'production') {
    console.log('Serving static files in production mode...');
    const distPath = path.join(frontendDir, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=================================`);
    console.log(`Job Portal Server running on http://0.0.0.0:${PORT}`);
    console.log(`=================================`);
  });
}

startServer();
