import { Router, Request, Response } from 'express';
import { createRoom } from '../db';
import { CreateRoomInput } from '../types';
import { validateCreateRoom } from '../middleware/validation';

const router = Router();

router.post('/', validateCreateRoom, (req: Request, res: Response) => {
  const { name, capacity } = req.body as CreateRoomInput;
  const room = createRoom({ name, capacity });
  res.status(201).json(room);
});

export default router;
