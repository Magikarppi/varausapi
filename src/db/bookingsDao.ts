import db from './connection';
import { Booking, CreateBookingInput } from '../types';

const insertBooking = db.prepare(`
  INSERT INTO bookings (room_id, title, booked_by, start_time, end_time)
  VALUES (@room_id, @title, @booked_by, @start_time, @end_time)
`);

export function createBooking(input: CreateBookingInput): Booking {
  const result = insertBooking.run(input);
  return {
    id: result.lastInsertRowid as number,
    ...input,
    created_at: new Date().toISOString(),
  };
}

const deleteBookingById = db.prepare(`
  DELETE FROM bookings WHERE id = ?
`);

export function deleteBooking(id: number): boolean {
  const result = deleteBookingById.run(id);
  return result.changes > 0;
}
