<div align="center">

# BAIUST Academix
### Academic Resource Hub for the Department of CSE, BAIUST

**Server Application**

[![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express.js-Framework-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Render](https://img.shields.io/badge/Deployed_on-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://render.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

[Live API](https://baiust-academix-server.onrender.com/api) · [Health Check](https://baiust-academix-server.onrender.com/api/health) · [Client Repo](#)

</div>

---

## Overview

**BAIUST Academix** consolidates the academic resources of the Department of Computer Science and Engineering, BAIUST — previously scattered across messaging groups, personal drives, and informal peer sharing — into a single **structured, searchable, administrator-verified platform** accessible to every enrolled CSE student.

The platform spans the complete **8-semester BAIUST CSE curriculum**, offering organized access to course textbooks, lecture notes, and instructional video content across **60+ registered courses**, from Level 1.1 through Level 4.2.

> This repository contains the **backend REST API**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Authentication | JSON Web Tokens (JWT) |
| Password Hashing | bcryptjs |
| File Uploads | Multer |
| Deployment | Render |

---

## Live Deployment

| Endpoint | URL |
|---|---|
| Base | `https://baiust-academix-server.onrender.com` |
| API Info | `https://baiust-academix-server.onrender.com/api` |
| Health Check | `https://baiust-academix-server.onrender.com/api/health` |

---

## Project Structure

```
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── resourceController.js
│   └── adminController.js
├── middleware/
│   ├── authMiddleware.js
│   └── errorHandler.js
├── models/
│   ├── User.js
│   └── Resource.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── resourceRoutes.js
│   └── adminRoutes.js
├── uploads/
├── createAdmin.js
├── seed.js
├── server.js
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- MongoDB Atlas connection string

### Installation

```bash
# Install project dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

### Environment Variables

Create a `.env` file in the project root for local development:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=https://baiust-academix-client.vercel.app
```

For production, set these in the **Render Dashboard** under `Environment`. The `PORT` variable is assigned automatically by Render and should not be specified manually.

---

## Administrative Utilities

| Task | Command |
|---|---|
| Create an administrator account | `node createAdmin.js` |
| Seed sample resource data | `node seed.js` |
| Clear all resources | `node -e "require('dotenv').config(); const mongoose=require('mongoose'); const Resource=require('./models/Resource'); mongoose.connect(process.env.MONGO_URI).then(async()=>{await Resource.deleteMany({}); console.log('All resources cleared.'); mongoose.disconnect();})"` |

---

## API Reference

### Root

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | API information | Public |
| GET | `/api` | API information | Public |
| GET | `/api/health` | Server health check | Public |

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register new student account | Public |
| POST | `/api/auth/login` | Authenticate and receive JWT | Public |
| GET | `/api/auth/me` | Retrieve authenticated user profile | Authenticated |

### Resources

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/resources` | List approved resources | Authenticated |
| POST | `/api/resources` | Submit a new resource | Authenticated |
| DELETE | `/api/resources/:id` | Delete a resource | Owner or Admin |
| PATCH | `/api/resources/:id/status` | Approve or reject a resource | Admin |

### Administration

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/admin/stats` | Retrieve dashboard statistics | Admin |
| GET | `/api/admin/users` | List all student accounts | Admin |
| PATCH | `/api/admin/users/:id/approve` | Approve a student registration | Admin |
| PATCH | `/api/admin/users/:id/suspend` | Suspend a student account | Admin |
| DELETE | `/api/admin/users/:id` | Delete a student account | Admin |
| GET | `/api/admin/resources` | List all resources by status | Admin |

---

## Authentication Mechanism

All protected routes require a valid JWT token in the request `Authorization` header using the Bearer scheme:

```
Authorization: Bearer <token>
```

Tokens are issued upon successful authentication and expire after the duration specified in the `JWT_EXPIRES_IN` environment variable.

---

## User Roles and Permissions

| Role | Permissions |
|---|---|
| student | Browse resources, upload submissions, search repository |
| admin | All student permissions, approve or reject student registrations, moderate resource submissions, grant admin role to existing students |

---

## CORS Policy

API requests are accepted only from the following origins:

- `https://baiust-academix-client.vercel.app`
- `http://localhost:5173`

---

## Implementation Notes

- Administrator accounts cannot be registered through the public registration endpoint. Use the `createAdmin.js` script to provision administrator accounts directly.
- Uploaded files are stored in the `uploads` directory on the server. For production deployments, a cloud storage service such as Cloudinary or AWS S3 is recommended.
- The server is hosted on Render's free tier. The service may experience a cold start delay of approximately 30 to 60 seconds after a period of inactivity.

---

<div align="center">
Developed with care by **Nosratee Jahan Naba**
Department of CSE · 18th Batch BAIUST
</div>
