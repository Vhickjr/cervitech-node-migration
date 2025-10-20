import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import bodyParser from 'body-parser';
import backOfficeUser from "./routes/backOfficeUser.routes"
import authRoutes from './routes/auth.routes.js';
import fcmRoutes from './routes/fcm.routes.js'
import userRoutes from './routes/user.routes.js'
import neckAngleRoutes from './routes/neckAngle.routes';
import transactionRoutes from './routes/transaction.routes';
import goalsroutes from './routes/goals.routes.js';
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cervitechdb";

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length]", {
    stream: logger.stream,
  })
);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/fcm', fcmRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/neck-angle', neckAngleRoutes);
app.use("/api/v1/backoffice-users", backOfficeUser);
app.use('/api/v1/transaction', transactionRoutes);
app.use('/api/v1/goals', goalsroutes);
// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI , {
  dbName: "cervitechdb",   // 👈 force your app to use "cervitech" database
})

  .then(() => {
    logger.info("MongoDB connected");
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("MongoDB connection error:", err);
  });

export default app;
