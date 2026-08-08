import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { logger } from './utils/logger';
import { swaggerSpec } from './config/swagger';
import cors from 'cors';
import bodyParser from 'body-parser';
import legacyRoutes from './routes/legacy.routes';
import backOfficeUser from './routes/backOfficeUser.routes';
import authRoutes from './routes/auth.routes.js';
import fcmRoutes from './routes/fcm.routes.js';
import usersRoutes from './routes/users.routes.js';
import neckAngleRoutes from './routes/neckAngle.routes';
import transactionRoutes from './routes/transaction.routes';
import goalsroutes from './routes/goals.routes.js';
import emailRoutes from './routes/email.routes.js';
import { startMonthlyReminderJob } from './jobs/monthlyReminder.job';
import { startSubscriptionSyncJob } from './jobs/subscriptionSync.job';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cervitechdb';
const frontendUrl = process.env.FRONTEND_URL;

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(
  morgan(':method :url :status :response-time ms - :res[content-length]', {
    stream: logger.stream,
  })
);

app.use(
  cors({
    origin: 'http://localhost:5173', // frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, // if you use cookies or auth headers
  })
);

// app.use('/api/v1', legacyRoutes);

// API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/fcm', fcmRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/neck-angle', neckAngleRoutes);
app.use('/api/v1/backoffice-users', backOfficeUser);
app.use('/api/v1/transaction', transactionRoutes);
app.use('/api/v1/goals', goalsroutes);
app.use('/api/v1/email', emailRoutes);

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI, {
    dbName: 'cervitechdb', // 👈 force your app to use "cervitech" database
  })

  .then(() => {
    logger.info('MongoDB connected');
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      console.log(frontendUrl);
    });
    startMonthlyReminderJob();
    startSubscriptionSyncJob();
  })
  .catch((err) => {
    logger.error('MongoDB connection error:', err);
  });

export default app;
