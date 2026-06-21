# Dynamic QR PWA Backend

Backend service for Dynamic QR PWA application using:

* Node.js
* Express.js
* Sequelize ORM
* PostgreSQL
* Neon Database
* JWT Authentication
* Swagger API Docs
* Socket.IO
* Redis

---

# Tech Stack

| Technology | Usage                  |
| ---------- | ---------------------- |
| Node.js    | Backend Runtime        |
| Express.js | API Framework          |
| PostgreSQL | Database               |
| Sequelize  | ORM                    |
| Neon       | Cloud PostgreSQL       |
| Redis      | Cache & Socket Support |
| Socket.IO  | Realtime Features      |
| Swagger    | API Documentation      |
| JWT        | Authentication         |

---

# Project Structure

```txt
src/
│
├── config/
│   ├── database.js
│   ├── redis.js
│   ├── socket.js
│   └── swagger.js
│
├── controllers/
│
├── middlewares/
│
├── models/
│
├── repositories/
│
├── routes/
│   ├── v1/
│   └── v2/
│
├── services/
│
├── utils/
│
├── validations/
│
├── app.js
└── server.js
```

---

# Installation

Clone repository:

```bash
git clone <repository-url>
```

Move to project folder:

```bash
cd dynamic-qr-pwa-backend
```

Install dependencies:

```bash
npm install
```

---

# Required Packages

```bash
npm install express sequelize pg pg-hstore dotenv cors bcrypt jsonwebtoken joi helmet morgan compression socket.io swagger-ui-express yamljs redis
```

Development dependency:

```bash
npm install --save-dev nodemon
```

---

# Environment Variables

Create `.env` in root folder:

```env
PORT=5000

NODE_ENV=development

JWT_SECRET=your_secret_key

DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST/neondb?sslmode=verify-full

REDIS_URL=redis://localhost:6379
```

---

# Database Setup

## Neon PostgreSQL

Create database on:

[Neon](https://neon.tech?utm_source=chatgpt.com)

Copy connection string and add to `.env`.

---

# Run Project

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

---

# Package.json Scripts

```json
"scripts": {
  "dev": "nodemon src/server.js",
  "start": "node src/server.js"
}
```

---

# Sequelize Model Naming Convention

All tables use:

```txt
_master
```

Example:

| Table Name            |
| --------------------- |
| user_master           |
| qr_transaction_master |
| subscription_master   |
| upi_master            |
| trial_master          |

---

# Common Fields

Every table contains:

| Field       |
| ----------- |
| created_by  |
| modified_by |
| created_on  |
| modified_on |
| is_active   |

---

# Example Model

```js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserMaster = sequelize.define(
	"user_master",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},

		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		mobile_no: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},

		pin: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		is_active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
);

module.exports = UserMaster;
```

---

# Auto Create Tables

Inside `server.js`:

```js
await sequelize.sync({ alter: true });
```

---

# API Versioning

```txt
/api/v1/
/api/v2/
```

---

# Swagger Documentation

Access Swagger docs:

```txt
http://localhost:8080/api-docs
```

---

# DBeaver Setup

Use Neon credentials:

| Field    | Value         |
| -------- | ------------- |
| Host     | Neon Host     |
| Port     | 5432          |
| Database | neondb        |
| Username | Neon Username |
| Password | Neon Password |
| SSL      | require       |

---

# Recommended Features

* JWT Authentication
* Role Based Access
* QR Generation
* Subscription Management
* Trial Management
* Payment History
* Socket Notifications
* Admin Panel APIs

---

# Deployment

## Vercel

Install CLI:

```bash
npm install -g vercel
```

Deploy:

```bash
vercel
```

---

# Vercel Environment Variables

Add in dashboard:

```env
DATABASE_URL=
JWT_SECRET=
NODE_ENV=production
```

---

# Recommended Production Setup

* Use Sequelize migrations
* Use Redis caching
* Use PM2 for server management
* Use Winston or custom logger
* Use Helmet middleware
* Use Rate Limiting
* Use Joi validation

---

# Author
Siddhesh Kulkarni

Requirements
Just need to add history and need to create table f9r that.
Check working of the flow and offline working also
