# AuthBridge Backend

A robust, secure, and production-ready authentication backend service built with **NestJS** and **MongoDB**. This project demonstrates advanced software engineering practices including comprehensive security layers, structured logging, centralized exception handling, and strict input validation.

## 🚀 Key Features & Highlights

### 🔒 Advanced Security

This application implements a defense-in-depth security strategy:

- **JWT Authentication**: Stateless authentication using JSON Web Tokens.
- **Secure Cookie Storage**: Tokens are stored in `HttpOnly`, `Secure` (optional), and `SameSite` cookies to prevent XSS attacks.
- **CSRF Protection**: Implements the Double Submit Cookie pattern with a custom `CsrfGuard` and token generation endpoints.
- **Rate Limiting**: Uses `ThrottlerGuard` to protect authentication endpoints (Login/Signup) against brute-force and DDoS attacks.
- **Password Hashing**: Utilizes `bcryptjs` for secure password hashing before storage.
- **Input Validation**: Strict DTO validation using `class-validator` with whitelisting to prevent parameter pollution and injection attacks.

### 🛠️ Robust Architecture

- **Structured Logging**: Integrated logging across all layers (Controllers, Services, Guards) to track request flow, authentication attempts, and critical errors.
- **Centralized Exception Handling**: Custom exception classes (e.g., `UserNotFoundException`, `InvalidCredentialsException`) combined with a `GlobalHttpExceptionFilter` ensure consistent and meaningful error responses for the client.
- **Separation of Concerns**: Clean architecture separating business logic (Services), request handling (Controllers), and data access (Mongoose Models).

### 📚 Documentation

- **Swagger/OpenAPI**: Fully documented API endpoints with DTO schemas, response types, and example values, available at `/api/docs`.

---

## 🛠️ Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (v16 or higher recommended)
- **npm** or **yarn**
- **MongoDB**: You can run a local instance or use MongoDB Atlas.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd AuthBridge-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory of the project. You can copy the structure below:

```bash
# .env

# Application Port
PORT=8000

# MongoDB Connection String
# Example for local: mongodb://localhost:27017/auth-bridge
# Example for Atlas: mongodb+srv://<user>:<password>@cluster.mongodb.net/auth-bridge
MONGO_URI=mongodb://localhost:27017/auth-bridge

# JWT Secret Key (Use a strong, random string)
JWT_SECRET=super_secret_jwt_key_123!

# Frontend URL (For CORS configuration)
# Matches the origin set in main.ts
FRONTEND_URL=http://localhost:5173
```

### 4. Running the Application

**Development Mode:**

```bash
npm run start # without live reload
npm run start:dev
```

**Production Mode:**

```bash
npm run build
npm run start:prod
```

The server will start on `http://localhost:8000` (or the port defined in your `.env`).

---

## ✅ Running Tests

This project uses Jest for testing. You can run the included unit tests with the following commands:

```bash
# Run all unit tests
npm run test

# Run tests in watch mode (useful during development)
npm run test:watch
```

---

## 📖 API Documentation

Once the server is running, you can access the interactive Swagger API documentation at:

👉 **http://localhost:8000/api/docs**

This interface allows you to test endpoints directly from your browser.

---

## 🧪 Project Structure

```
src/
├── auth/
│   ├── dto/                 # Data Transfer Objects (Validation)
│   ├── auth.controller.ts   # Auth Endpoints (Login, Signup, Reset PW)
│   ├── auth.guard.ts        # JWT Authentication Guard
│   ├── auth.service.ts      # Auth Business Logic
│   └── ...
├── common/
│   ├── exceptions/          # Custom Exception Classes
│   └── exception-filter.ts  # Global Error Handler
├── users/
│   ├── user.schema.ts       # MongoDB Schema
│   ├── users.controller.ts  # User Management Endpoints
│   └── users.service.ts     # User CRUD Operations
├── main.ts                  # Application Entry Point
└── app.module.ts            # Root Module
```

---

## 🛡️ Security Workflow Example

1. **Signup/Login**: User sends credentials.
2. **Validation**: `ValidationPipe` checks input format.
3. **Processing**: Service hashes password/verifies hash.
4. **Token Issue**: Server sets `access_token` (HttpOnly) and `csrf_token` (Cookie).
5. **Protected Requests**: Client must send the cookie _and_ the CSRF token in headers for subsequent requests.
