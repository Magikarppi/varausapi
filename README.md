# Meeting Room Booking API

REST API for booking meeting rooms.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Server runs at `http://localhost:3000`

### Build & Start Production

```bash
npm run build
npm start
```

## API Endpoints

### Rooms

#### Create Room

```
POST /rooms
Content-Type: application/json

{
  "name": "Conference Room A",
  "capacity": 10
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "name": "Conference Room A",
  "capacity": 10,
  "created_at": "2026-01-17T10:00:00.000Z"
}
```

#### Get Room Bookings

```
GET /rooms/:id/bookings
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "room_id": 1,
    "title": "Team meeting",
    "booked_by": "user@example.com",
    "start_time": "2026-01-17T10:00:00Z",
    "end_time": "2026-01-17T11:00:00Z",
    "created_at": "2026-01-17T09:00:00.000Z"
  }
]
```

### Bookings

#### Create Booking

```
POST /bookings
Content-Type: application/json

{
  "room_id": 1,
  "title": "Team meeting",
  "booked_by": "user@example.com",
  "start_time": "2026-01-17T10:00:00Z",
  "end_time": "2026-01-17T11:00:00Z"
}
```

**Response:** `201 Created`

**Validation Rules:**
- All fields required
- `start_time` must be before `end_time`
- `start_time` and `end_time` cannot be in the past
- Booking cannot overlap with existing bookings for the same room

**Error Responses:**
- `400 Bad Request` - Missing fields or invalid times
- `409 Conflict` - Booking overlaps with existing booking

#### Delete Booking

```
DELETE /bookings/:id
```

**Response:** `204 No Content`

**Error Responses:**
- `400 Bad Request` - Invalid booking id
- `404 Not Found` - Booking not found

## Database

SQLite database stored in `data/database.db`. The database is created automatically on first server start.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `DB_PATH` | Database file path | `data/database.db` |
