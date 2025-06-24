# TaskMaster API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
- **Type**: JWT (JSON Web Token)
- **Header**: `Authorization: Bearer <token>`
- **Token expires**: 24 hours

---

## 🔓 Public Endpoints (No Authentication Required)

### 1. User Registration
```http
POST /api/register
```

**Request Body:**
```json
{
  "username": "joyce_dev",
  "email": "joyce@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "joyce_dev",
    "email": "joyce@example.com",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### 2. User Login
```http
POST /api/login
```

**Request Body:**
```json
{
  "email": "joyce@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "joyce_dev",
    "email": "joyce@example.com"
  }
}
```

### 3. Get All Projects
```http
GET /api/projects
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (default: 10)

**Response (200 OK):**
```json
{
  "projects": [
    {
      "id": 1,
      "title": "TaskMaster MVP",
      "description": "Build the minimum viable product",
      "created_at": "2024-01-15T14:20:00Z",
      "creator": {
        "id": 1,
        "username": "joyce_dev"
      },
      "task_count": 5
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total": 1,
    "pages": 1
  }
}
```

### 4. Get Project Details
```http
GET /api/projects/{id}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "TaskMaster MVP",
  "description": "Build the minimum viable product for TaskMaster",
  "created_at": "2024-01-15T14:20:00Z",
  "creator": {
    "id": 1,
    "username": "joyce_dev",
    "email": "joyce@example.com"
  },
  "tasks": [
    {
      "id": 1,
      "title": "Set up database models",
      "description": "Create SQLAlchemy models",
      "status": "completed",
      "due_date": "2024-01-20T23:59:59Z",
      "assigned_to": {
        "id": 1,
        "username": "joyce_dev"
      },
      "categories": [
        {
          "id": 1,
          "name": "Backend"
        }
      ]
    }
  ]
}
```

---

## 🔒 Protected Endpoints (Authentication Required)

### 5. Create New Project
```http
POST /api/projects
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "New Project",
  "description": "Project description here"
}
```

**Response (201 Created):**
```json
{
  "message": "Project created successfully",
  "project": {
    "id": 2,
    "title": "New Project",
    "description": "Project description here",
    "created_at": "2024-01-16T09:00:00Z",
    "creator_id": 1
  }
}
```

### 6. Update Project
```http
PUT /api/projects/{id}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Project Title",
  "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "message": "Project updated successfully",
  "project": {
    "id": 1,
    "title": "Updated Project Title",
    "description": "Updated description",
    "created_at": "2024-01-15T14:20:00Z",
    "creator_id": 1
  }
}
```

**Error (403 Forbidden):**
```json
{
  "error": "You can only update projects you created"
}
```

### 7. Delete Project
```http
DELETE /api/projects/{id}
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Project deleted successfully"
}
```

**Error (403 Forbidden):**
```json
{
  "error": "You can only delete projects you created"
}
```

### 8. Update Task Status
```http
PATCH /api/tasks/{id}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "completed"
}
```

**Response (200 OK):**
```json
{
  "message": "Task updated successfully",
  "task": {
    "id": 1,
    "title": "Set up database models",
    "status": "completed",
    "updated_at": "2024-01-16T10:00:00Z"
  }
}
```

---

## 🔒 Additional Protected Endpoints

### 9. Create Task
```http
POST /api/projects/{project_id}/tasks
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "due_date": "2024-01-25T23:59:59Z",
  "assigned_to": 1,
  "category_ids": [1, 2]
}
```

### 10. Get User Profile
```http
GET /api/profile
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "username": "joyce_dev",
    "email": "joyce@example.com",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "projects_created": 3,
  "tasks_assigned": 8,
  "tasks_completed": 5
}
```

### 11. Get Categories
```http
GET /api/categories
Authorization: Bearer <token>
```

### 12. Create Category
```http
POST /api/categories
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Frontend",
  "description": "Frontend development tasks"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": {
    "email": ["Email is required"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied. You don't have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "error": "Email already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Status Codes Summary

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

---

## Task Status Options
- `pending` - Task is not started
- `in_progress` - Task is being worked on
- `completed` - Task is finished
- `cancelled` - Task is cancelled