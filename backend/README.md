# Backend Project

## Setup and Run Locally

### Prerequisites

- Node.js (version >= 16)
- npm
- PostgreSQL database
- Redis server

### Steps

1. Clone the repository:

   ```git clone <repository-url>
   cd backend
   ```

2. Install dependencies:

   ```npm install

   ```

3. Run Docker compose file for PostgreSQL DB and Redis Server (docker-compose.yml)

```
docker-compose up -d
```

3. Set up environment variables:

   - i already push .env file to repo.

4. Run database migrations:

   ```npm run migrate:generate
      npm run migrate:apply
   ```

5. Run the development server:

   ```npm run dev

   ```

   The project will be running at `http://localhost:5000`.

## How to Use

- After running the server, you can use an API client like Postman to test the endpoints.

## Scripts in `package.json`

- **`dev`**: Starts the development server with live reload.

  ```bun run dev

  ```

- **`test`**: Runs unit tests using Bun.

  ```bun run test

  ```

- **`migrate:generate`**: Generates database migration files.

  ```bun run migrate:generate

  ```

- **`migrate:apply`**: Applies migrations to the database.

  ```bun run migrate:apply

  ```

- **`lint`**: Runs ESLint to check for code quality issues.

  ```bun run lint

  ```

- **`lint:fix`**: Automatically fixes linting issues.

  ```bun run lint:fix

  ```

- **`format`**: Formats the code using Prettier.

  ```bun run format

  ```

## Features Implemented

### 1. **GIT & Source Control**

- The project is hosted on GitHub.
- Regular commits descriptive messages.
- Includes a structured README file.

### 2. **TypeScript**

- Fully implemented using TypeScript.
- Type safety ensured with proper interfaces and types.

### 3. **Database & Caching**

- Uses PostgreSQL for persistent data storage.
- Redis is integrated for caching frequently accessed data (e.g., GET /posts).

### 4. **Authentication**

- Implemented user authentication using opaque tokens stored in Redis.
- Supports login, register, forget password, and logout functionalities.
- Users can log in using either their email or username.
- Secured private endpoints to restrict unauthorized access.

### 5. **CRUD Operations**

- **Categories**: Users can create, edit, delete, and view categories, with restrictions on modifying other users’ data.
- **Posts**: Users can create, edit, delete, and view posts, which belong to categories and can have multiple comments.
- **Comments**: Users can create, edit, delete, and view comments linked to posts.
- **Tags**: Users can create, edit, delete, and view tags with a many-to-many relationship with posts.

### 6. **Validation**

- Used Zod for request validation.
- Provides detailed error messages for invalid inputs or unauthorized actions.

### 7. **Testing**

- Unit and integration tests implemented for API endpoints using BUN.
- Focus on access control and data validation.

### 8. **Error Handling & Best Practices**

- Create Global MiddleWare for Collection and Handling Errors.
- Follows best practices for clean code, naming conventions, and maintainability.

### 9. **ESLint and Prettier**

- Configured ESLint for linting and Prettier for formatting.
- Ensures consistent coding style.

### 10. **Multi-Language Support**

- Supports English and Arabic.
- Localized error messages, validation messages, and success responses based on `Accept-Language` header.

## Backend Bonus Points Done

- **Rate Limiting**: Implemented (LOGIN API) to protect login endpoints from brute-force attacks.
- **Caching**: Implemented (GET Public Posts API) and remove cache when creating/editing/deleting Posts Redis is used for frequently accessed endpoints to optimize performance.
- **Logging/Monitoring**: Implemented With WINSTON use can see logs folder with debug/error logs files we can check it when login with wrong crediential or any error in server.

## Possible Improvements

- Add email integration like sendgrid to complete forget/reset pass i did it with ingnore integration and make static otp (1111)
- Integration Testing needed to rest of apis
