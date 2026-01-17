import { Request, Response, NextFunction } from 'express';
import { CreateBookingInput, CreateRoomInput } from '../types';
import { hasOverlappingBooking } from '../db';

export function validateCreateBooking(req: Request, res: Response, next: NextFunction): void {
  const { room_id, title, booked_by, start_time, end_time } = req.body as CreateBookingInput;

  if (!room_id || !title || !booked_by || !start_time || !end_time) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  if (start_time >= end_time) {
    res.status(400).json({ error: 'start_time must be before end_time' });
    return;
  }

  const now = new Date().toISOString();
  if (start_time < now) {
    res.status(400).json({ error: 'start_time cannot be in the past' });
    return;
  }

  if (end_time < now) {
    res.status(400).json({ error: 'end_time cannot be in the past' });
    return;
  }

  if (hasOverlappingBooking(room_id, start_time, end_time)) {
    res.status(409).json({ error: 'Booking overlaps with an existing booking' });
    return;
  }

  next();
}

export function validateCreateRoom(req: Request, res: Response, next: NextFunction): void {
  const { name } = req.body as CreateRoomInput;

  if (!name) {
    res.status(400).json({ error: 'Missing required field: name' });
    return;
  }

  next();
}
