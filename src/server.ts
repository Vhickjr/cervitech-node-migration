import express from 'express';
import morgan from 'morgan';
import { loggerStream } from './utils/logger';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/index';
import appUserRoutes from './routes/appuser.routes';
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
app.use('/api/appusers', appUserRoutes);

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://mabdurrahmanbalogun:pass.word123@afretec.i5dm3.mongodb.net/' )
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));
  
export default app;
