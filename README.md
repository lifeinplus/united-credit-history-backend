# United Credit History - Backend

## Description

This repository contains the backend part of the United Credit History project. The backend manages credit report data, connects to the MongoDB database, and handles API requests to serve the frontend application.

## Development

-   **Technologies**: Node.js, TypeScript, MongoDB (with Mongoose).
-   **TypeScript**: Strict type checking to ensure code quality and consistency.
-   **Main Entry**: `src/index.ts`
-   **Build Output**: Compiled TypeScript files are stored in the `dist` directory.

## Database

-   **Data Management**: Reads and writes to MongoDB collections, ensuring data integrity for client credit history.
-   **MongoDB**: Stores credit report data, including personal information, payments, loans, and payment histories.
-   **Mongoose**: Provides a schema-based solution for modeling application data and interacting with MongoDB.
-   **Connection**: Uses a dynamically built URI that incorporates environment variables for the username, password, port, and database name.

https://github.com/lifeinplus/united-credit-history-backend/blob/1658fdb2d1cc61cfc033a7cdfab2508854e3b670/src/config/index.ts#L13-L17

## Configuration

### Environment Variables

The project relies on several environment variables to configure its behavior:

-   **Auth**:

    -   `PASSWORD_LENGTH_MIN`: Sets a minimum password length for authentication, using an environment variable or defaulting to 8 if not provided.

-   **CORS**:

    -   `CORS_CREDENTIALS`: Specifies whether credentials are included in CORS requests.
    -   `CORS_ORIGIN`: Defines the allowed origins for CORS.

-   **File Upload**:

    -   `FILE_UPLOAD_SIZE_KB`: Configures the maximum file upload size, using an environment variable or defaulting to 150 KB if not provided.

-   **MongoDB**:

    -   `MONGO_USERNAME`, `MONGO_PASSWORD`, `MONGO_PORT`, `MONGO_DBNAME`: Used to construct the MongoDB connection URI.

-   **Server**:

    -   `SERVER_PORT`: Defines the port the server will run on (default: 1337).

-   **Tokens**:

    -   `ACCESS_TOKEN_EXPIRES_IN`: Expiration time for access tokens (default: 5 minutes).
    -   `ACCESS_TOKEN_SECRET`: Secret key for signing access tokens.
    -   `REFRESH_TOKEN_EXPIRES_IN`: Expiration time for refresh tokens (default: 1 hour).
    -   `REFRESH_TOKEN_SECRET`: Secret key for signing refresh tokens.

-   **User Roles**:
    -   `Admin`: 1010
    -   `User`: 2020

## API Endpoints

The backend provides several API routes:

-   **Auth** (`/auth`):

    -   `GET /refresh`: Generates a new access token and refresh token when a valid refresh token is presented.
    -   `POST /login`: User login using a username and password. If valid, the server responds with an access token and a refresh token in a secure cookie.
    -   `POST /logout`: Logs out the user by clearing the refresh token from the cookie and the database.
    -   `POST /register`: Registers a new user with a hashed password and assigns a default user role.

-   **Common** (`/commons`): Manage common data entries related to credit history.
-   **Delinquency** (`/delinquencies`): Handle delinquency records for loans.
-   **FLC** (`/flcs`): Full Loan Cost (FLC) data management.
-   **Loan** (`/loans`): Manage loan records.
-   **Payment History** (`/payment-histories`): Store and retrieve payment histories by loan ID.
-   **Person** (`/persons`): Manage person records by report ID.

-   **Report** (`/reports`):

    -   `GET /`: Retrieves all reports sorted by application number.
    -   `GET /paginated`: Retrieves paginated reports filtered by client name and returns the reports and pagination details.
    -   `GET /:id`: Retrieves a report by its ID.
    -   `GET /:id/full`: Retrieves a full report by its ID, including related common data, loans, request counts, and persons.
    -   `POST /`: Adds a new report, returning the created report.
    -   `POST /list`: Adds multiple reports from a list, returning the created reports.

-   **Request Count** (`/request-counts`): Track requests related to credit history.

-   **User** (`/users`):

    -   `GET /`: Retrieves all users sorted by creation date, returning user data or a 404 status if no users are found.
    -   `GET /:id/avatar/:filename`: Serves a user’s avatar file based on their ID and filename, retrieving it from the uploads/users directory.
    -   `GET /paginated`: Retrieves paginated users, filtering by username, and returns user data along with pagination details.
    -   `PUT /:id/avatar`: Changes a user’s avatar by ID, saving the uploaded file and updating the user’s avatar path.
    -   `PUT /:id/password`: Allows a user to change their password by providing their current password and new password.
    -   `PUT /:id`: Edits a user’s roles by ID, returning the updated user or a 204 status if the user doesn’t exist.
    -   `DELETE /:id`: Deletes a user by ID, returning the result or a 204 status if the user doesn’t exist.

https://github.com/lifeinplus/united-credit-history-backend/blob/35e9ebdb25bf13317ae6d897ac4eae6d67d64756/src/routes/User.ts#L17-L24

## Models

The following data models are used:

-   **Common**: Represents various financial amounts (e.g., credit cards, loans, and payments in GBP, RUB, and TRY) and a credit score (300-800).
-   **Delinquency**: Tracks delinquency across different time frames (e.g., 0+, 30+, 60+, 90+ days) and refinancing data for loans.
-   **FLC** (Full Loan Cost): Represents Full Loan Cost data including payment, amount taken, and two numeric codes (Nchb and Ucb).
-   **Loan**: Includes detailed loan data such as balance, currency, delinquency amount, loan number (Nchb and Ucb), and unpaid percentage.
-   **Payment History**: Contains payment history records with a loan ID, date, and status.
-   **Person**: Represents a person's data, including name, birth date, and document details (series, number, and issue date).
-   **Report**: Contains details of a report, including application number, client name, and report creation date.
-   **Request Count**: Tracks the number of requests related to credit history over various periods (e.g., last 30 days, last 24 months) including microcredit requests.
-   **User**: Represents user information, including avatarName, creation date, user names, password, refresh tokens, and roles.

https://github.com/lifeinplus/united-credit-history-backend/blob/35e9ebdb25bf13317ae6d897ac4eae6d67d64756/src/models/UserModel.ts#L17-L27

## Middleware

The project uses the following middleware:

-   **File Upload Limiter**: Limits file uploads by checking size and allowed file extensions, returning an error if files are missing, too large, or have disallowed extensions.
-   **JWT Verifier**: Validates JWT tokens for secure endpoints. The `jwtVerifier` middleware checks if the token is present, verifies it, and extracts the user roles. If the token is expired or invalid, it responds with appropriate status codes.
-   **Pagination**: Extracts pagination options (limit, page, and search query) from the request and makes them available in the response for routes that return paginated results.
-   **Password Verifier**: Checks if the user is required to change their password before accessing specific routes.
-   **Request Logger**: Logs incoming requests and their corresponding status codes after completion. The `requestLogger` middleware records method, URL, and IP address for both the incoming request and the response.
-   **Roles Verifier**: Ensures that only users with specific roles can access certain endpoints. It checks if the user's roles match any of the allowed roles for the route.
-   **CORS**: Configured based on environment variables to allow cross-origin requests.
-   **Cookie Parser**: Handles cookies in requests.

## Scripts

Here are the available scripts for development and production:

| Script     | Description                                                                        |
| ---------- | ---------------------------------------------------------------------------------- |
| `build`    | Compiles the TypeScript files and outputs them to the `dist` directory.            |
| `prestart` | Runs the `build` script before starting the server.                                |
| `start`    | Starts the Node.js server using the compiled files in the `dist` directory.        |
| `preserve` | Runs the `build` script before starting the server.                                |
| `serve`    | Runs the project in watch mode for development using `concurrently` and `nodemon`. |

---

v1.17.0 © 2024 Artem Denisov
