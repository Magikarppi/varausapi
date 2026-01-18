import express, { Request, Response } from 'express';
import roomsRouter from './routes/roomsRouter';
import bookingsRouter from './routes/bookingsRouter';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/rooms', roomsRouter);
app.use('/bookings', bookingsRouter);

app.use(errorHandler);

export default app;
