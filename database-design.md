# TaskMaster Database Design

## Database Schema Overview

### 1. User Model
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(80) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
- `id` - Primary key
- `username` - Unique username (String, 80 chars)
- `email` - Unique email address (String, 120 chars)
- `password_hash` - Hashed password (String, 255 chars)
- `created_at` - Account creation timestamp

### 2. Project Model
```sql
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    creator_id INTEGER NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
);
```

**Columns:**
- `id` - Primary key
- `title` - Project title (String, 200 chars)
- `description` - Project description (Text)
- `created_at` - Project creation timestamp
- `creator_id` - Foreign key to User who created the project

### 3. Task Model
```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    due_date DATETIME,
    project_id INTEGER NOT NULL,
    assigned_to INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);
```

**Columns:**
- `id` - Primary key
- `title` - Task title (String, 200 chars)
- `description` - Task description (Text)
- `status` - Task status: 'pending', 'in_progress', 'completed' (String, 50 chars)
- `due_date` - Task due date (DateTime)
- `project_id` - Foreign key to Project
- `assigned_to` - Foreign key to User (who is assigned the task)
- `created_at` - Task creation timestamp

### 4. Category Model
```sql
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

**Columns:**
- `id` - Primary key
- `name` - Category name (String, 100 chars, unique)
- `description` - Category description (Text)
- `created_at` - Category creation timestamp
- `created_by` - Foreign key to User who created the category

### 5. Task-Category Junction Table (Many-to-Many)
```sql
CREATE TABLE task_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE(task_id, category_id)
);
```

## Relationships Summary

### One-to-Many Relationships:
1. **User → Projects**: One user can create many projects
2. **Project → Tasks**: One project can have many tasks
3. **User → Categories**: One user can create many categories
4. **User → Tasks**: One user can be assigned many tasks

### Many-to-Many Relationships:
1. **Tasks ↔ Categories**: Tasks can belong to multiple categories, categories can have multiple tasks

## Database Indexes (for performance)
```sql
-- User table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Project table indexes
CREATE INDEX idx_projects_creator ON projects(creator_id);
CREATE INDEX idx_projects_created_at ON projects(created_at);

-- Task table indexes
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Category table indexes
CREATE INDEX idx_categories_created_by ON categories(created_by);
CREATE INDEX idx_categories_name ON categories(name);

-- Junction table indexes
CREATE INDEX idx_task_categories_task ON task_categories(task_id);
CREATE INDEX idx_task_categories_category ON task_categories(category_id);
```

## Sample Data Structure

### Users
```json
{
  "id": 1,
  "username": "victor_dev",
  "email": "victor@taskmaster.com",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Projects
```json
{
  "id": 1,
  "title": "TaskMaster MVP",
  "description": "Build the minimum viable product for TaskMaster",
  "created_at": "2024-01-15T14:20:00Z",
  "creator_id": 1
}
```

### Tasks
```json
{
  "id": 1,
  "title": "Set up database models",
  "description": "Create SQLAlchemy models for all entities",
  "status": "completed",
  "due_date": "2024-01-20T23:59:59Z",
  "project_id": 1,
  "assigned_to": 1,
  "created_at": "2024-01-15T15:00:00Z"
}
```

### Categories
```json
{
  "id": 1,
  "name": "Backend",
  "description": "Backend development tasks",
  "created_at": "2024-01-15T11:00:00Z",
  "created_by": 1
}
```