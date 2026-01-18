import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';
import { createRoom, createBooking } from '../db';
import { futureDate } from '../test/helpers';

describe('POST /rooms', () => {
  it('should create a room with name only', async () => {
    const response = await request(app)
      .post('/rooms')
      .send({ name: 'Conference Room A' });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: 'Conference Room A',
      capacity: null,
    });
    expect(response.body.id).toBeDefined();
  });

  it('should create a room with name and capacity', async () => {
    const response = await request(app)
      .post('/rooms')
      .send({ name: 'Meeting Room B', capacity: 10 });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: 'Meeting Room B',
      capacity: 10,
    });
  });

  it('should return 400 when name is missing', async () => {
    const response = await request(app)
      .post('/rooms')
      .send({ capacity: 5 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing required field: name');
  });

  it('should return 400 when name is empty', async () => {
    const response = await request(app)
      .post('/rooms')
      .send({ name: '' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing required field: name');
  });

  it('should return 500 when creating duplicate room name', async () => {
    await request(app)
      .post('/rooms')
      .send({ name: 'Duplicate Room' });

    const response = await request(app)
      .post('/rooms')
      .send({ name: 'Duplicate Room' });

    expect(response.status).toBe(500);
  });
});

describe('GET /rooms/:id/bookings', () => {
  it('should return empty array for room with no bookings', async () => {
    const room = createRoom({ name: 'Empty Room' });

    const response = await request(app)
      .get(`/rooms/${room.id}/bookings`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return bookings for a room', async () => {
    const room = createRoom({ name: 'Booked Room' });
    const startTime = futureDate(1);
    const endTime = futureDate(2);

    createBooking({
      room_id: room.id,
      title: 'Team Meeting',
      booked_by: 'John',
      start_time: startTime,
      end_time: endTime,
    });

    const response = await request(app)
      .get(`/rooms/${room.id}/bookings`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      room_id: room.id,
      title: 'Team Meeting',
      booked_by: 'John',
    });
  });

  it('should return bookings sorted by start_time', async () => {
    const room = createRoom({ name: 'Multi-Booking Room' });

    createBooking({
      room_id: room.id,
      title: 'Later Meeting',
      booked_by: 'Alice',
      start_time: futureDate(5),
      end_time: futureDate(6),
    });

    createBooking({
      room_id: room.id,
      title: 'Earlier Meeting',
      booked_by: 'Bob',
      start_time: futureDate(1),
      end_time: futureDate(2),
    });

    const response = await request(app)
      .get(`/rooms/${room.id}/bookings`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].title).toBe('Earlier Meeting');
    expect(response.body[1].title).toBe('Later Meeting');
  });

  it('should return 400 for invalid room id', async () => {
    const response = await request(app)
      .get('/rooms/invalid/bookings');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid room id');
  });

  it('should return empty array for non-existent room', async () => {
    const response = await request(app)
      .get('/rooms/99999/bookings');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
