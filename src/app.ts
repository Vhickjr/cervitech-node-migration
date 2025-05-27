import express from 'express';
import morgan from 'morgan';
import { loggerStream } from './utils/logger';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(morgan('dev', { stream: loggerStream }));

app.use('/api/v1', routes);

export default app;
