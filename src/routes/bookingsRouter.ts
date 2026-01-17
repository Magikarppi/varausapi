import { Router, Request, Response } from 'express';
import { createBooking } from '../db';
import { CreateBookingInput } from '../types';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const { room_id, title, booked_by, start_time, end_time } = req.body as CreateBookingInput;

  if (!room_id || !title || !booked_by || !start_time || !end_time) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const booking = createBooking({ room_id, title, booked_by, start_time, end_time });
  res.status(201).json(booking);
});

export default router;
