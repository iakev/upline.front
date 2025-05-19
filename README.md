# Upline.front - Uplifting Your Web Experience

This project is a modern frontend application built with React, TypeScript, and Vite. It leverages Tailwind CSS for styling, Redux Toolkit for state management, and includes a comprehensive suite of testing tools and linting configurations to ensure code quality and maintainability.

## ✨ Features

*   **Vite:** Fast build tool and development server.
*   **React 18:** For building dynamic user interfaces.
*   **TypeScript:** For static typing and improved code quality.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **Redux Toolkit:** For efficient and predictable state management.
*   **React Router:** For client-side routing.
*   **Framer Motion:** For smooth animations and transitions.
*   **ESLint & Prettier:** For code linting and formatting, configured with Husky pre-commit hooks.
*   **Vitest & Playwright:** For unit, component, and end-to-end testing.
*   **Dockerized:** Includes Docker configurations for development, testing, and production environments.
*   **Express Server:** A simple Express server (`server.ts`) is included, likely for serving the production build or handling specific backend-for-frontend tasks.
*   **PM2:** Configured for process management in production (`ecosystem.config.json`).

## 📂 Project Structure

The project follows a standard structure for React applications:

```
upline.front/
├── public/               # Static assets
├── src/                  # Source files
│   ├── assets/           # Images, SVGs, etc.
│   ├── components/       # Reusable UI components (common, layout, ui)
│   ├── featureConfig/    # Configuration for specific features (e.g., forms)
│   ├── hooks/            # Custom React hooks
│   ├── redux/            # Redux Toolkit setup (store, slices, API)
│   ├── test/             # Test setup and utilities
│   ├── utils/            # Utility functions
│   ├── validation/       # Validation schemas and utilities
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── tests/                # Vitest unit/integration tests
├── e2e/                  # Playwright end-to-end tests
├── .env                  # Environment variables (create this file)
├── .eslint.config.js     # ESLint configuration
├── .gitignore
├── .prettierrc           # Prettier configuration
├── Dockerfile            # Main Dockerfile
├── Dockerfile.test       # Dockerfile for test environment
├── docker-compose.yml    # Base Docker Compose configuration
├── docker-compose.dev.yml # Docker Compose overrides for development
├── docker-compose.prod.yml # Docker Compose overrides for production
├── docker-compose.test.yml # Docker Compose for test environment
├── ecosystem.config.json # PM2 configuration
├── index.html            # Main HTML file
├── lint-staged.config.js # Lint-staged configuration
├── package.json
├── playwright.config.ts  # Playwright configuration
├── postcss.config.js     # PostCSS configuration
├── server.ts             # Express server for production
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.app.json     # TypeScript configuration for the application
├── tsconfig.json         # Base TypeScript configuration
├── tsconfig.node.json    # TypeScript configuration for Node.js specific files
└── vite.config.ts        # Vite configuration
```

##  Prerequisites

*   Node.js (v18 or higher recommended)
*   npm (v8 or higher recommended)
*   Docker and Docker Compose (optional, for containerized workflows)

## 🚀 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd upline.front
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project. You may need to add variables such as:
    ```env
    VITE_APP_ASSET_URL=http://localhost:3030/v1
    # Add other environment variables as needed by your backend or specific configurations
    ```
    Refer to `vite-env.d.ts` and codebase for potential environment variables used.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

## 🛠️ Available Scripts

*   `npm run dev`: Starts the Vite development server.
*   `npm run build`: Builds the application for production.
*   `npm run preview`: Serves the production build locally for preview.
*   `npm run lint`: Lints the codebase using ESLint.
*   `npm run lint:fix`: Lints the codebase and automatically fixes issues.
*   `npm run prettier`: Checks formatting with Prettier.
*   `npm run prettier:fix`: Formats the codebase with Prettier.
*   `npm run test`: Runs all Vitest tests (unit and component).
*   `npm run test:unit`: Runs Vitest unit tests in watch mode.
*   `npm run test:coverage`: Runs Vitest tests and generates a coverage report.
*   `npm run test:react`: Runs Vitest React component tests.
*   `npm run test:e2e`: Runs Playwright end-to-end tests.
*   `npm run test:all`: Runs all unit, component, and e2e tests.
*   `npm run analyze`: Analyzes the bundle size of the production build.
*   `npm run start:pm2`: Starts the application in production using PM2 and the Express server. (Requires a production build first)

### Docker Scripts

*   `npm run docker:build`: Builds Docker images as defined in `docker-compose.yml`.
*   `npm run docker:dev`: Starts the development environment using Docker Compose.
*   `npm run docker:prod`: Starts the production environment using Docker Compose.
*   `npm run docker:test`: Runs tests within a Docker environment.

## ⚙️ Linting and Formatting

This project uses ESLint for linting and Prettier for code formatting. Husky is configured to run linters on pre-commit, ensuring code quality before it enters the repository.

You can manually run the linters and formatters using:
*   `npm run lint`
*   `npm run lint:fix`
*   `npm run prettier`
*   `npm run prettier:fix`

## 🧪 Testing

The project is set up with a comprehensive testing strategy:

*   **Unit & Component Tests:** Written with [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/). Test files are typically located within the `src` directory alongside the components they test (e.g., `*.test.tsx`) or in the `tests` directory.
*   **End-to-End (E2E) Tests:** Written with [Playwright](https://playwright.dev/). E2E test files are located in the `e2e` directory.

Run tests using the scripts mentioned above (e.g., `npm run test`, `npm run test:e2e`).

## 🐳 Dockerization

The project includes Docker configurations for consistent development, testing, and production environments.

*   **Development:** `npm run docker:dev` will spin up the necessary services for development.
*   **Production:** `npm run docker:prod` can be used to deploy the application in a containerized environment. This typically involves building the production application first.
*   **Testing:** `npm run docker:test` allows running tests in an isolated Docker environment.

Refer to the `Dockerfile`, `Dockerfile.test`, and `docker-compose.*.yml` files for more details on the Docker setup.

## 📡 Environment Variables

Key environment variables are managed via a `.env` file in the project root. Ensure this file is created based on your deployment and development needs.

Example (create a `.env` file):
```env
VITE_APP_ASSET_URL=http://your-asset-server.com/api
# Add other necessary variables
```
Vite automatically loads variables prefixed with `VITE_` and makes them available in the client-side code via `import.meta.env`.


This README provides a general overview. For more specific details, please refer to the respective configuration files and the codebase itself.
