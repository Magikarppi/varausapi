import { Router, Request, Response } from 'express';
import { createRoom, getBookingsByRoom } from '../db';
import { CreateRoomInput } from '../types';
import { validateCreateRoom } from '../middleware/validation';

const router = Router();

router.post('/', validateCreateRoom, (req: Request, res: Response) => {
  const { name, capacity } = req.body as CreateRoomInput;
  const room = createRoom({ name, capacity });
  res.status(201).json(room);
});

router.get('/:id/bookings', (req: Request<{ id: string }>, res: Response) => {
  const roomId = parseInt(req.params.id, 10);

  if (isNaN(roomId)) {
    res.status(400).json({ error: 'Invalid room id' });
    return;
  }

  const bookings = getBookingsByRoom(roomId);
  res.json(bookings);
});

export default router;
