import db from './connection';
import { Room, CreateRoomInput } from '../types';

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
