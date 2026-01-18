import { beforeEach, afterAll } from 'vitest';
import db from '../db/connection';

export function cleanDatabase() {
  db.exec('DELETE FROM bookings');
  db.exec('DELETE FROM rooms');
}

beforeEach(() => {
  cleanDatabase();
});

afterAll(() => {
  db.close();
});
