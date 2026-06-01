# UA-Shop Backend

Universal Acceptance-Compliant E-Commerce Identity & Registration Platform

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up your .env file
Make sure backend/.env contains:
```
PORT=5000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/ua_compliance_db?schema=public"
MAIL_HOST=smtp.ethereal.email
MAIL_PORT=587
MAIL_USER=your_ethereal_user
MAIL_PASS=your_ethereal_pass
```

### 3. Create the database (run once in pgAdmin or psql)
```sql
CREATE DATABASE ua_compliance_db WITH ENCODING = 'UTF8';
```

### 4. Run migrations
```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Seed the product catalogue
```bash
npm run seed
```

### 6. Start the server
```bash
npm run dev
```

Server runs on http://localhost:5000

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/email/validate | UA-compliant user registration |
| GET | /api/users | Get all registered users |
| GET | /api/users/:id | Get user profile with orders |
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get single product |
| POST | /api/orders | Place an order |
| GET | /api/orders/:userId | Get orders for a user |

---

## Test with Postman

**Register a user:**
```json
POST http://localhost:5000/api/email/validate
{
  "usernameUnicode": "TestUser",
  "rawEmail": "test@example.com"
}
```

**Test multilingual email:**
```json
{
  "usernameUnicode": "用户",
  "rawEmail": "用户@例子.公司"
}
```
