import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { loggerStream } from './utils/logger.js';
import authRoutes from './routes/auth.routes.js';
// import userRoutes from './routes/userRoutes';
import neckAngleRoutes from './routes/neckAngle.routes'; // Add this line
import 'reflect-metadata'; // 👈 ADD THIS AS THE FIRST LINE
// Load environment variables
dotenv.config();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cervitech';
console.log(MONGODB_URI)

// Middleware
app.use(express.json());
app.use(morgan('dev', { stream: loggerStream }));

// Routes

app.use('/auth', authRoutes);
app.use('/api', neckAngleRoutes);

// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err: unknown) => {
    console.error('❌ MongoDB connection error:', err);
  });

export default app;
