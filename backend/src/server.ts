// Import necessary modules
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables first

import express, { Application, Request, Response } from 'express';
import { sequelize, connectDB } from './config/db';
import authRoutes from './routes/auth';
import recordRoutes from './routes/records';
import cors from 'cors';

// Initialize the Express application
const app: Application = express();

// Define the port the server will run on
// It will use the PORT from the .env file, or default to 5000
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

/**
 * @route   GET /api/health
 * @desc    Health check route to ensure the server is running
 * @access  Public
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);

// Start the server and listen on the specified port
const startServer = async () => {
  await connectDB();
  await sequelize.sync();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();

export default app;