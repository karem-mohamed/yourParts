# Frontend Project

## Setup and Run Locally

### Prerequisites

- Node.js (version >= 16)
- npm

### Steps

1. Clone the repository:

   ```
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:

   ```npm install

   ```

3. Run the development server:

   ```npm run dev

   ```

   The project will be running at `http://localhost:3000`.

## How to Use

- After running the server, you can navigate to `http://localhost:3000` in your browser.
- You can start developing and the server will reload automatically for any code changes.
- create user from regiter page
- create category before creating post for categories page (third item in sidebar)
- create post from home page which include public posts

## Scripts in `package.json`

- **`dev`**: Runs the development server with Turbopack for faster page refreshes and optimizations. Use this in development mode.
  `   npm run dev`

- **`build`**: Builds the project for production. This optimizes the app for best performance.

  ```npm run build

  ```

- **`start`**: Starts the production server after the build has been completed.

  ```npm run start

  ```

- **`lint`**: Lints the codebase using Next.js linting rules to ensure your code is clean and follows best practices.

  ```npm run lint

  ```

- **`storybook`**: Starts Storybook in development mode, allowing you to test UI components in isolation on port `6006`.

  ```npm run storybook

  ```

- **`build-storybook`**: Builds the Storybook project for production. It creates a static version of your Storybook to deploy.

  ```npm run build-storybook

  ```

  ## Features Implemented

### 1. **GIT & Source Control**

- The project is hosted on GitHub and the code is regularly committed with descriptive commit messages.

### 2. **TypeScript**

- The entire project is built using TypeScript to ensure type safety, with interfaces and types used where appropriate.

### 3. **Next.js**

- Used the Next.js App Router for routing.
- Implemented pages for creating, reading, updating, and deleting data fetched from a public API.
- The app supports multiple languages (English and Arabic) for localization.

### 4. **TailwindCSS**

- The application is styled using only TailwindCSS, ensuring a clean, responsive, and visually appealing UI.

### 5. **CRUD Operations**

- Full CRUD operations have been implemented using a public API.
- The homepage displays a list of items fetched from the API.
- Functionality for creating, editing, and deleting items is included.
- Pagination has been implemented for the list view.

### 6. **Form Validation**

- Implemented form validation (login/sigup page) to ensure that user inputs are valid.
- User-friendly error messages are provided for invalid inputs.

### 7. **Responsive Design**

- The application is fully responsive, working well across different screen sizes and devices.

### 8. **ESLint and Prettier**

- ESLint has been set up for linting to enforce coding standards.
- Prettier is configured to ensure consistent code formatting across the project.

### 9. **Unit Tests**

- (Not yet implemented)

### 10. **Authentication**

- User authentication is implemented using opaque tokens stored in cookies.
- Users can log in using either their email or username.
- if user make refresh we use token to fetch it's data again and still on same page.

### 11. **Categories, Posts, Comments, and Tags**

- CRUD operations are implemented for categories, posts, comments, and tags.
- Users can edit/delete only their own categories, posts, comments, and tags, while public access is allowed for viewing other users’ data.

## Frontend Bonus Points Done

### 1. **Search and Filter Functionality**

- done inside home page with search category input and i add pagination.

### 2. **UI/UX Improvements**

- done.

### 3. **Accessibility Standards**

- I tried to make the design simple and lightweight for the user to access.

  ## Possible Improvements

- Whenever an element is added, modified, or deleted, the current state is updated to improve and confirm the change to the user. This is easily done by modifying the component's state with some code, but currently, a refresh is required to display the values after the change.
- Unit testing
