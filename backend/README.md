# Cafe POS Backend

Backend foundation for the Cafe POS application, built with Node.js, Express, and MySQL.

## Setup

Install dependencies:

```bash
npm install
```

Create a local environment file by copying the example:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Update `.env` with your local database settings when MySQL is available.

## Run

Start the server in development mode:

```bash
npm run dev
```

Start the server normally:

```bash
npm start
```

The server defaults to port `5000` unless `PORT` is set in the environment.

<<<<<<< HEAD
=======
## Database

The migration script creates the configured MySQL database if it does not already exist, runs `database/schema.sql`, and then runs `database/seed.sql`.

Before running migrations, make sure `.env` contains valid MySQL settings:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=cafe_pos
DB_PORT=3306
```

Run the migration and seed data:

```bash
npm run db:migrate
```

This will create the database tables and insert the initial admin user, product categories, starter products, payment methods, and cafe tables.

>>>>>>> main
## Health Check

```http
GET /api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Backend is running"
}
```

## Authentication

Register an employee user:

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Jayesh",
  "email": "jayesh@example.com",
  "password": "password123"
}
```

Login:

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "jayesh@example.com",
  "password": "password123"
}
```

Use the returned token for protected routes:

```http
Authorization: Bearer YOUR_TOKEN
```

Protected test routes:

```http
GET /api/auth/me
GET /api/auth/admin-only
```

## Categories

All category routes require a JWT. Create, update, and delete require an admin token.

```http
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

Create or update body:

```json
{
  "name": "Beverages",
  "color": "#2563EB"
}
```

## Products

All product routes require a JWT. Create, update, and archive require an admin token.

```http
GET    /api/products?page=1&limit=20&search=tea&category_id=1
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

Create or update body:

```json
{
  "name": "Masala Tea",
  "category_id": 1,
  "price": 20,
  "tax_rate": "5",
  "description": "Hot tea"
}
```
