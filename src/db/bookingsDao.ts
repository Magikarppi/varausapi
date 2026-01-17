import db from './connection';

export interface Booking {
  id: number;
  room_id: number;
  title: string;
  booked_by: string;
  start_time: string;
  end_time: string;
  created_at: string;
}

export interface CreateBookingInput {
  room_id: number;
  title: string;
  booked_by: string;
  start_time: string;
  end_time: string;
}

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
