import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';
import { createRoom, createBooking } from '../db';
import { futureDate, pastDate } from '../test/helpers';

describe('POST /bookings', () => {
  it('should create a booking', async () => {
    const room = createRoom({ name: 'Test Room' });

    const response = await request(app)
      .post('/bookings')
      .send({
        room_id: room.id,
        title: 'Team Standup',
        booked_by: 'Alice',
        start_time: futureDate(1),
        end_time: futureDate(2),
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      room_id: room.id,
      title: 'Team Standup',
      booked_by: 'Alice',
    });
    expect(response.body.id).toBeDefined();
  });

  it('should return 400 when room_id is missing', async () => {
    const response = await request(app)
      .post('/bookings')
      .send({
        title: 'Meeting',
        booked_by: 'Bob',
        start_time: futureDate(1),
        end_time: futureDate(2),
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing required fields');
  });

  it('should return 400 when title is missing', async () => {
    const room = createRoom({ name: 'Room 1' });

    const response = await request(app)
      .post('/bookings')
      .send({
        room_id: room.id,
        booked_by: 'Bob',
        start_time: futureDate(1),
        end_time: futureDate(2),
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing required fields');
  });

  it('should return 400 when booked_by is missing', async () => {
    const room = createRoom({ name: 'Room 2' });

    const response = await request(app)
      .post('/bookings')
      .send({
        room_id: room.id,
        title: 'Meeting',
        start_time: futureDate(1),
        end_time: futureDate(2),
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing required fields');
  });

  it('should return 400 when start_time is missing', async () => {
    const room = createRoom({ name: 'Room 3' });

    const response = await request(app)
      .post('/bookings')
      .send({
        room_id: room.id,
        title: 'Meeting',
        booked_by: 'Bob',
        end_time: futureDate(2),
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing required fields');
  });

  it('should return 400 when end_time is missing', async () => {
    const room = createRoom({ name: 'Room 4' });

    const response = await request(app)
      .post('/bookings')
      .send({
        room_id: room.id,
        title: 'Meeting',
        booked_by: 'Bob',
        start_time: futureDate(1),
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing required fields');
  });

  it('should return 400 when start_time is after end_time', async () => {
    const room = createRoom({ name: 'Room 5' });

    const response = await request(app)
      .post('/bookings')
      .send({
        room_id: room.id,
        title: 'Meeting',
        booked_by: 'Bob',
        start_time: futureDate(3),
        end_time: futureDate(1),
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('start_time must be before end_time');
  });

  it('should return 400 when start_time equals end_time', async () => {
    const room = createRoom({ name: 'Room 6' });
    const sameTime = futureDate(1);

    const response = await request(app)
      .post('/bookings')
      .send({
        room_id: room.id,
        title: 'Meeting',
        booked_by: 'Bob',
        start_time: sameTime,
        end_time: sameTime,
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('start_time must be before end_time');
  });

  it('should return 400 when start_time is in the past', async () => {
    const room = createRoom({ name: 'Room 7' });

    const response = await request(app)
      .post('/bookings')
      .send({
        room_id: room.id,
        title: 'Meeting',
        booked_by: 'Bob',
        start_time: pastDate(2),
        end_time: futureDate(1),
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('start_time cannot be in the past');
  });

  it('should return 400 when end_time is in the past', async () => {
    const room = createRoom({ name: 'Room 8' });

    const response = await request(app)
      .post('/bookings')
      .send({
        room_id: room.id,
        title: 'Meeting',
        booked_by: 'Bob',
        start_time: pastDate(3),
        end_time: pastDate(1),
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('start_time cannot be in the past');
  });

  it('should return 409 when booking overlaps with existing booking', async () => {
    const room = createRoom({ name: 'Busy Room' });

    createBooking({
      room_id: room.id,
      title: 'Existing Meeting',
      booked_by: 'Alice',
      start_time: futureDate(2),
      end_time: futureDate(4),
    });

    const response = await request(app)
      .post('/bookings')
      .send({
        room_id: room.id,
        title: 'Conflicting Meeting',
        booked_by: 'Bob',
        start_time: futureDate(3),
        end_time: futureDate(5),
      });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe('Booking overlaps with an existing booking');
  });

  it('should return 409 when booking is completely inside existing booking', async () => {
    const room = createRoom({ name: 'Another Busy Room' });

    createBooking({
      room_id: room.id,
      title: 'Long Meeting',
      booked_by: 'Alice',
      start_time: futureDate(1),
      end_time: futureDate(5),
    });

    const response = await request(app)
      .post('/bookings')
      .send({
        room_id: room.id,
        title: 'Short Meeting',
        booked_by: 'Bob',
        start_time: futureDate(2),
        end_time: futureDate(3),
      });

    expect(response.status).toBe(409);
  });

  it('should allow booking in different room at same time', async () => {
    const room1 = createRoom({ name: 'Room Alpha' });
    const room2 = createRoom({ name: 'Room Beta' });

    createBooking({
      room_id: room1.id,
      title: 'Meeting in Alpha',
      booked_by: 'Alice',
      start_time: futureDate(1),
      end_time: futureDate(2),
    });

    const response = await request(app)
      .post('/bookings')
      .send({
        room_id: room2.id,
        title: 'Meeting in Beta',
        booked_by: 'Bob',
        start_time: futureDate(1),
        end_time: futureDate(2),
      });

    expect(response.status).toBe(201);
  });

  it('should allow booking immediately after existing booking', async () => {
    const room = createRoom({ name: 'Back to Back Room' });
    const boundary = futureDate(2);

    createBooking({
      room_id: room.id,
      title: 'First Meeting',
      booked_by: 'Alice',
      start_time: futureDate(1),
      end_time: boundary,
    });

    const response = await request(app)
      .post('/bookings')
      .send({
        room_id: room.id,
        title: 'Second Meeting',
        booked_by: 'Bob',
        start_time: boundary,
        end_time: futureDate(3),
      });

    expect(response.status).toBe(201);
  });
});

describe('DELETE /bookings/:id', () => {
  it('should delete an existing booking', async () => {
    const room = createRoom({ name: 'Delete Test Room' });
    const booking = createBooking({
      room_id: room.id,
      title: 'To Be Deleted',
      booked_by: 'Alice',
      start_time: futureDate(1),
      end_time: futureDate(2),
    });

    const response = await request(app)
      .delete(`/bookings/${booking.id}`);

    expect(response.status).toBe(204);
  });

  it('should return 404 when booking does not exist', async () => {
    const response = await request(app)
      .delete('/bookings/99999');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Booking not found');
  });

  it('should return 400 for invalid booking id', async () => {
    const response = await request(app)
      .delete('/bookings/invalid');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid booking id');
  });
});
