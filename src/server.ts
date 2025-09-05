import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import backOfficeUser from "./routes/backOfficeUser.routes"
import { loggerStream } from './utils/logger.js';
import authRoutes from './routes/auth.routes.js';
// import userRoutes from './routes/userRoutes';
import neckAngleRoutes from './routes/neckAngle.routes';
import transactionRoutes from './routes/transactionRoutes';
import 'reflect-metadata'; // 👈 ADD THIS AS THE FIRST LINE
import goalsroutes from './routes/goals.routes.js';
// Load environment variables
dotenv.config();

const app = express();
app.use(bodyParser.json())
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cervitech';
console.log(MONGODB_URI);

// Middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboardcat", // secret for signing
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // ⚠️ set secure: true if using HTTPS
  })
);
app.use(morgan('dev', { stream: loggerStream }));


// Routes

app.use('/api/v1/auth', authRoutes);
app.use('/api/neck-angle', neckAngleRoutes);
app.use("/api/backoffice-users", backOfficeUser);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/goals', goalsroutes);

// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI , {
  dbName: "cervitechdb",   // 👈 force your app to use "cervitech" database
})

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
