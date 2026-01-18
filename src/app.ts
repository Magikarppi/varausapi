import express, { Request, Response } from 'express';
import roomsRouter from './routes/roomsRouter';
import bookingsRouter from './routes/bookingsRouter';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, World!' });
});

app.use('/rooms', roomsRouter);
app.use('/bookings', bookingsRouter);

app.use(errorHandler);

export default app;
