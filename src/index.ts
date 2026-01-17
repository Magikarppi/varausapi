import express, { Request, Response } from 'express';
import roomsRouter from './routes/roomsRouter';
import bookingsRouter from './routes/bookingsRouter';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, World!' });
});

app.use('/rooms', roomsRouter);
app.use('/bookings', bookingsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
