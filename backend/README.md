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
