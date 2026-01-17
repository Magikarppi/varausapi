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

const selectBookingsByRoom = db.prepare(`
  SELECT * FROM bookings WHERE room_id = ? ORDER BY start_time
`);

export function getBookingsByRoom(roomId: number): Booking[] {
  return selectBookingsByRoom.all(roomId) as Booking[];
}

const selectOverlappingBooking = db.prepare(`
  SELECT id FROM bookings
  WHERE room_id = @room_id
    AND start_time < @end_time
    AND end_time > @start_time
  LIMIT 1
`);

export function hasOverlappingBooking(roomId: number, startTime: string, endTime: string): boolean {
  const result = selectOverlappingBooking.get({ room_id: roomId, start_time: startTime, end_time: endTime });
  return result !== undefined;
}
