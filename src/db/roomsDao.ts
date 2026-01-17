import db from './connection';

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

const insertRoom = db.prepare(`
  INSERT INTO rooms (name, capacity)
  VALUES (@name, @capacity)
`);

export function createRoom(input: CreateRoomInput): Room {
  const result = insertRoom.run({
    name: input.name,
    capacity: input.capacity ?? null,
  });
  return {
    id: result.lastInsertRowid as number,
    name: input.name,
    capacity: input.capacity ?? null,
    created_at: new Date().toISOString(),
  };
}
