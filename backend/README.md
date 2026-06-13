# Cafe POS Backend

Node.js, Express, and MySQL backend for a cafe POS system.

## Features

- Authentication with JWT
- Admin and employee roles
- Categories, products, customers, orders, KDS, promotions, and reports
- MySQL schema and seed data
- Swagger documentation
- Centralized validation and error handling

## Tech Stack

- Node.js
- Express
- MySQL
- JWT
- bcryptjs
- express-validator
- Swagger

## Setup

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Update `.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=cafe_pos
DB_PORT=3306
JWT_SECRET=your_jwt_secret
```

Run migrations and seed data:

```bash
npm run db:migrate
```

Start the server:

```bash
npm run dev
```

Or:

```bash
npm start
```

Base URL:

```text
http://localhost:5000
```

## Demo Admin

```json
{
  "email": "admin@cafepos.com",
  "password": "password123"
}
```

Use this account to test admin-only APIs.

## Authentication

Login:

```http
POST /api/auth/login
```

```json
{
  "email": "admin@cafepos.com",
  "password": "password123"
}
```

Use the returned token:

```http
Authorization: Bearer YOUR_TOKEN
```

## API Overview

### Health

```http
GET /api/health
```

### Auth

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
GET  /api/auth/admin-only
```

### Categories

Admin is required for create, update, and delete.

```http
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

### Products

Admin is required for create, update, and archive.

```http
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Customers

```http
GET    /api/customers
GET    /api/customers/:id
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id
```

### Orders

```http
GET  /api/orders
GET  /api/orders/:id
POST /api/orders
PUT  /api/orders/:id
DELETE /api/orders/:id
POST /api/orders/:id/send-to-kitchen
POST /api/orders/:id/pay
```

### Kitchen Display System

```http
GET /api/kds
GET /api/kds/stats
GET /api/kds/:id
PUT /api/kds/:id/status
```

Valid KDS flow:

```text
to_cook -> preparing -> completed
```

### Promotions

Admin is required for create, update, and delete.

```http
GET    /api/promotions
GET    /api/promotions/:id
POST   /api/promotions
PUT    /api/promotions/:id
DELETE /api/promotions/:id
POST   /api/promotions/validate
```

### Reports

Admin only.

```http
GET /api/reports/summary
GET /api/reports/sales-trend
GET /api/reports/top-products
GET /api/reports/top-categories
GET /api/reports/export?format=csv
```

Date filters:

```text
?startDate=2026-01-01&endDate=2026-12-31
```

## Swagger

```text
http://localhost:5000/api/docs
```

## Standard JSON Response

Most JSON APIs return:

```json
{
  "success": true,
  "data": {}
}
```

Error responses return:

```json
{
  "success": false,
  "message": "Error message"
}
```

`/api/reports/export` returns CSV.

## Useful Test Flow

1. Login as admin.
2. Create a category.
3. Create a product.
4. Create a customer.
5. Create an order.
6. Send the order to kitchen.
7. Move KDS status to `preparing`.
8. Move KDS status to `completed`.
9. Pay the order.
10. Check reports.
