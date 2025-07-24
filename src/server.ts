import express from 'express';
import morgan from 'morgan';
import { loggerStream } from './utils/logger.js';
import authRoutes from './routes/auth.routes.js';
// import userRoutes from './routes/userRoutes';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


app.use(express.json());
app.use(morgan('dev', { stream: loggerStream }));

app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);

// console.log('MongoDB URI: ', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cervitech' )
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));
  
export default app;
