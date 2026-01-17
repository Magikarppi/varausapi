import { Router, Request, Response } from 'express';
import { createRoom } from '../db';
import { CreateRoomInput } from '../types';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const { name, capacity } = req.body as CreateRoomInput;

  if (!name) {
    res.status(400).json({ error: 'Missing required field: name' });
    return;
  }

  const room = createRoom({ name, capacity });
  res.status(201).json(room);
});

export default router;
