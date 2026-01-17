export interface Room {
  id: number;
  name: string;
  capacity: number | null;
  created_at: string;
}

export interface CreateRoomInput {
  name: string;
  capacity?: number | null;
}

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
