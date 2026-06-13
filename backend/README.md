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
