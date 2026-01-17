import { Router, Request, Response } from 'express';
import { createBooking } from '../db';
import { CreateBookingInput } from '../types';
import { validateCreateBooking } from '../middleware/validation';

const router = Router();

router.post('/', validateCreateBooking, (req: Request, res: Response) => {
  const { room_id, title, booked_by, start_time, end_time } = req.body as CreateBookingInput;
  const booking = createBooking({ room_id, title, booked_by, start_time, end_time });
  res.status(201).json(booking);
});

export default router;
