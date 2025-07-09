import express from 'express';
import morgan from 'morgan';
import { loggerStream } from './utils/logger';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/index';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


app.use(express.json());
app.use(morgan('dev', { stream: loggerStream }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cervitech' )
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));
  
export default app;
