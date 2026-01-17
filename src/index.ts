import express, { Request, Response } from 'express';
import { initializeDatabase, createBooking, CreateBookingInput } from './db';

initializeDatabase();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, World!' });
});

app.post('/bookings', (req: Request, res: Response) => {
  const { room_id, title, booked_by, start_time, end_time } = req.body as CreateBookingInput;

  if (!room_id || !title || !booked_by || !start_time || !end_time) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const booking = createBooking({ room_id, title, booked_by, start_time, end_time });
  res.status(201).json(booking);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
