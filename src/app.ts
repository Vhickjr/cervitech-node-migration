import express from 'express';
import morgan from 'morgan';
import { loggerStream } from './utils/logger';
import authRoutes from './routes/auth.routes';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());
app.use(morgan('dev', { stream: loggerStream }));

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://mabdurrahmanbalogun:pass.word123@afretec.i5dm3.mongodb.net/' )
  .then(() => console.log('MongoDB connected'))
  .catch((err: unknown) => console.error(err));
  
export default app;
