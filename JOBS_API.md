# Jobs API Documentation

## Overview

The Jobs API allows managing job listings for the StudentenAtHome career page. Jobs are stored in a PostgreSQL database and can be managed through admin-authenticated endpoints.

## Endpoints

### Public Endpoints

#### GET `/api/jobs`

Get all active published job listings.

**Query Parameters:**
- `all` (optional): Set to `"true"` to get all jobs including inactive (requires admin authentication)

**Request (Public):**
```bash
curl https://studentenathome-api.up.railway.app/api/jobs
```

**Request (Admin - all jobs):**
```bash
curl https://studentenathome-api.up.railway.app/api/jobs?all=true \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Junior Tech Support Specialist",
    "type": "Vollzeit / Teilzeit",
    "location": "Berlin / Deutschlandweit / Remote",
    "description": "Job description...",
    "requirements": ["Requirement 1", "Requirement 2"],
    "benefits": ["Benefit 1", "Benefit 2"],
    "status": "active",
    "is_published": true,
    "created_at": "2025-12-31T00:00:00.000Z",
    "updated_at": "2025-12-31T00:00:00.000Z",
    "published_at": "2025-12-31T00:00:00.000Z"
  }
]
```

#### GET `/api/jobs/:id`

Get a specific job by ID.

**Request:**
```bash
curl https://studentenathome-api.up.railway.app/api/jobs/uuid
```

**Response:** Same as single job object above

---

### Admin Endpoints (Require JWT Authentication)

#### POST `/api/jobs`

Create a new job listing.

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "Junior Tech Support Specialist",
  "type": "Vollzeit / Teilzeit",
  "location": "Berlin / Deutschlandweit / Remote",
  "description": "Detailed job description (minimum 20 characters)",
  "requirements": [
    "Requirement 1",
    "Requirement 2",
    "Requirement 3"
  ],
  "benefits": [
    "Benefit 1",
    "Benefit 2",
    "Benefit 3"
  ],
  "status": "active",
  "is_published": true
}
```

**Validation:**
- `title`: 5-255 characters (required)
- `type`: Any string (required)
- `location`: Any string (required)
- `description`: Minimum 20 characters (required)
- `requirements`: Array with at least 1 item (required)
- `benefits`: Array with at least 1 item (required)
- `status`: One of "active", "inactive", "archived" (default: "active")
- `is_published`: Boolean (default: true)

**Response:**
```json
{
  "id": "uuid",
  "title": "Junior Tech Support Specialist",
  ...
}
```

#### PUT `/api/jobs/:id`

Update an existing job listing.

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: application/json`

**Request Body:** Same as POST (all fields)

**Response:** Updated job object

#### PATCH `/api/jobs/:id`

Update only the status of a job.

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "status": "inactive"
}
```

**Valid statuses:** "active", "inactive", "archived"

**Response:** Updated job object

#### DELETE `/api/jobs/:id`

Delete a job listing permanently.

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Response:**
```json
{
  "message": "Job deleted successfully"
}
```

---

## Job Status Values

- **active**: Job is visible to the public and accepting applications
- **inactive**: Job is hidden from public view but kept in database
- **archived**: Job is no longer available but kept for historical records

---

## Database Schema

```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  requirements JSONB NOT NULL DEFAULT '[]',
  benefits JSONB NOT NULL DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'active' NOT NULL,
  is_published BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

---

## Seeding Initial Data

To populate the database with the initial 5 job listings:

```bash
cd server/database
node seed-jobs.js
```

This will insert the 5 job listings that are currently hardcoded in the frontend.

---

## Frontend Integration

The JobsPage component fetches jobs from the API and falls back to static data if the API is unavailable:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://studentenathome-api.up.railway.app";

const fetchJobs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/jobs`);
    const data = await response.json();
    setJobListings(data);
  } catch (err) {
    // Fallback to static data
    setJobListings(staticJobListings);
  }
};
```

---

## Security

- All mutation endpoints (POST, PUT, PATCH, DELETE) require admin JWT authentication
- Input is sanitized using validator.escape() to prevent XSS
- JSONB fields (requirements, benefits) are properly validated as arrays
- Audit logging records all job creation, updates, and deletions
- Rate limiting applies to all endpoints

---

## Error Handling

### Common Error Responses

**401 Unauthorized** - Missing or invalid authentication token
```json
{
  "error": "Access token required"
}
```

**403 Forbidden** - User is not an admin
```json
{
  "error": "Admin access required"
}
```

**404 Not Found** - Job doesn't exist
```json
{
  "error": "Job not found"
}
```

**400 Bad Request** - Validation error
```json
{
  "error": "Title must be between 5 and 255 characters"
}
```

**500 Internal Server Error** - Server error
```json
{
  "error": "Failed to create job"
}
```
