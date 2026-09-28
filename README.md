# ExpressJS_ORM REST API

A scalable RESTful Backend API built with **Node.js, Express 5, Sequelize ORM, and MySQL**, secured with **JWT Authentication**.

---

## Tech Stack

- **Runtime & Framework:** Node.js (ES Modules), Express 5
- **ORM & Database:** Sequelize v6, MySQL 8
- **Authentication:** JSON Web Token (JWT), bcryptjs
- **File Uploads:** Multer
- **DevOps & Containerization:** Docker, Docker Compose

---

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Postman](https://www.postman.com/) (for API testing)

### 1. Start MySQL Database
Launch the MySQL container with pre-configured schemas and seed data:
```bash
docker compose up -d
```
> This automatically initializes the `expressjs_orm_db` database along with tables (`users`, `images`, `comments`, `saved_images`) and sample seed records from `database/init.sql`.

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default configuration:
```env
PORT=3001
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=expressjs_orm_db
DB_USER=root
DB_PASSWORD=123456
JWT_SECRET=secret_key
JWT_EXPIRES_IN=1d
```

### 3. Install Dependencies & Run
```bash
npm install
npm run dev
```
Server will start listening on: `http://localhost:3001`

---

## Demo Accounts

All demo accounts share the default password: `123456`

| Full Name | Email | Age | Role |
|---|---|:---:|---|
| Nguyen Thi An | `an.nguyen@gmail.com` | 24 | User / Creator |
| Tran Quoc Bao | `bao.tran@gmail.com` | 26 | User / Creator |
| Le Thi Cam | `cam.le@gmail.com` | 22 | User / Creator |
| Pham Van Dinh | `dinh.pham@gmail.com` | 28 | User / Creator |

---

## Postman Collection

1. Import `docs/expressjs-orm.postman_collection.json` into Postman.
2. Execute the **Auth > Login** request first to automatically save `{{token}}` for protected endpoints.

---

## Project Structure

```text
ExpressJS_ORM/
|-- database/          # Database schema and seed data (database/init.sql)
|-- docs/              # Postman collection API test suite
|   \-- expressjs-orm.postman_collection.json
|-- src/
|   |-- common/        # AppError, validators, response wrappers
|   |-- config/        # Database and file upload configuration
|   |-- controllers/   # Request controllers (auth, image, comment, user)
|   |-- middlewares/   # JWT auth and centralized error middleware
|   |-- models/        # Sequelize models & associations
|   |-- routes/        # Express route definitions
|   |-- services/      # Business logic and database operations
|   \-- server.js      # App entry point
|-- uploads/           # Uploaded static assets
|-- docker-compose.yml
|-- Dockerfile
|-- package.json
\-- README.md
```

---

## API Reference

All responses follow the unified JSON envelope:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... }
}
```

### 1. Authentication

| Method | Endpoint | Auth | Description | Payload |
|---|---|:---:|---|---|
| `POST` | `/api/auth/register` | No | Register new user account | `{ "email", "password", "full_name", "age" }` |
| `POST` | `/api/auth/login` | No | Authenticate & return JWT token | `{ "email", "password" }` |

### 2. Images & Gallery

| Method | Endpoint | Auth | Description | Payload / Query |
|---|---|:---:|---|---|
| `GET` | `/api/images` | Yes | List images (paginated) | `?page=1&pageSize=20` |
| `GET` | `/api/images/search` | Yes | Search images by name | `?name=keyword` |
| `GET` | `/api/images/:id` | Yes | Get image details & creator | - |
| `POST` | `/api/images` | Yes | Upload new image | Multipart: `image` (file, max 25MB), `image_name`, `description` |
| `DELETE` | `/api/images/:id` | Yes | Delete image (creator only) | - |

### 3. Comments & Bookmarks

| Method | Endpoint | Auth | Description | Payload |
|---|---|:---:|---|---|
| `GET` | `/api/images/:id/comments` | Yes | Get comments for an image | - |
| `POST` | `/api/images/:id/comments` | Yes | Add comment to image | `{ "content": "Great image!" }` |
| `DELETE` | `/api/comments/:id` | Yes | Delete comment (author or image owner) | - |
| `GET` | `/api/images/:id/saved` | Yes | Check if current user saved image | - |
| `POST` | `/api/images/:id/save` | Yes | Save image to collection | - |
| `DELETE` | `/api/images/:id/save` | Yes | Remove image from collection | - |

### 4. Users & Profile

| Method | Endpoint | Auth | Description | Payload |
|---|---|:---:|---|---|
| `GET` | `/api/users/me` | Yes | Get current user profile | - |
| `PUT` | `/api/users/me` | Yes | Update profile info or avatar | JSON: `{ "full_name", "age" }` or Multipart: `avatar` (file) |
| `GET` | `/api/users/:id/saved-images` | Yes | Get saved images by user ID | `?page=1&pageSize=20` |
| `GET` | `/api/users/:id/created-images` | Yes | Get created images by user ID | `?page=1&pageSize=20` |
