import { Router, Request, Response } from 'express';
import { createBooking, deleteBooking } from '../db';
import { CreateBookingInput } from '../types';
import { validateCreateBooking } from '../middleware/validation';

const router = Router();

router.post('/', validateCreateBooking, (req: Request, res: Response) => {
  const { room_id, title, booked_by, start_time, end_time } = req.body as CreateBookingInput;
  const booking = createBooking({ room_id, title, booked_by, start_time, end_time });
  res.status(201).json(booking);
});

router.delete('/:id', (req: Request<{ id: string }>, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid booking id' });
    return;
  }

  const deleted = deleteBooking(id);

  if (!deleted) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  res.status(204).send();
});

export default router;
