# Learnify LMS — Backend

A RESTful backend for **Learnify**, a Learning Management System (LMS) that enables students to explore courses, enroll in courses, and manage their learning experience.

Built with Node.js and Express.js, using PostgreSQL for relational data storage, Redis for caching and session-related operations, and JWT-based authentication.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** JavaScript (ES Modules)
- **Database:** PostgreSQL / Supabase
- **Caching:** Redis
- **Authentication:** JWT
- **Password Security:** Secure password hashing
- **API Style:** REST API
- **Development Tools:** Git, GitHub, Postman

## Features

- User registration and authentication
- JWT-based authentication using secure HTTP-only cookies
- Course browsing and management
- Course filtering, sorting, and search
- Course enrollment management
- User profile management
- PostgreSQL database operations
- Redis integration for improved performance
- RESTful API architecture
- Environment-based configuration

## Project Structure

```text
lms-b/
├── src/
│   ├── config/          # Database and Redis configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/     # Authentication and error handling
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic
│   ├── utils/            # Shared utilities
│   └── app.js            # Express application setup
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

*Adjust the structure above to match your actual project files.*

## Getting Started

### Prerequisites

- Node.js
- pnpm
- PostgreSQL or a Supabase project
- Redis

### 1. Clone the Repository

```bash
git clone https://github.com/Pasindujeewan/Learnify-b.git
cd Learnify-b
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000
NODE_ENV=development

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_access_token_secret

REDIS_URL=redis://localhost:6379

CLIENT_URL=http://localhost:5173
```

Add any other variables required by your implementation, such as refresh-token secrets or cookie settings.

**Security:** Never commit your `.env` file or expose database credentials and JWT secrets.

### 4. Start Redis

Make sure your Redis server is running locally or configure the application to use your Redis instance.

### 5. Run the Application

Use the scripts defined in your `package.json`. For example:

```bash
pnpm dev
```

For production:

```bash
pnpm start
```

## API Overview

The backend exposes RESTful endpoints for authentication, courses, enrollments, and user management.

| Module | Responsibilities |
|---|---|
| Authentication | Registration, login, logout, token validation |
| Courses | Browse, search, filter, sort, and retrieve course details |
| Enrollments | Enroll in courses and retrieve enrollment information |
| Users | Manage user profiles and account information |

The exact endpoints and HTTP methods depend on the current route implementation.

## Database

Learnify uses PostgreSQL to manage relational data, including:

- **Users:** Account and profile information
- **Courses:** Course details and instructor relationships
- **Enrollments:** Relationships between students and courses

Supabase can provide the managed PostgreSQL database infrastructure.

## Development Workflow

The project follows a modular backend architecture that separates routing, request handling, business logic, and infrastructure configuration.

- Use Git and GitHub for version control.
- Use Postman to test API endpoints.
- Keep sensitive configuration in environment variables.
- Validate incoming requests and handle errors consistently.
- Protect authenticated endpoints with appropriate middleware.

## Future Improvements

- Automated unit and integration testing
- API documentation with Swagger / OpenAPI
- Improved caching and database query optimization
- Role-based access control
- Logging and monitoring

## Author

**Pasindu Jeewan**

- GitHub: [@Pasindujeewan](https://github.com/Pasindujeewan)

---

*Learnify LMS — Building a better learning experience through technology.*
