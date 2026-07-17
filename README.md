# BAIUST Academix — Server

This repository contains the backend REST API for the BAIUST Academix academic resource sharing platform.

## Live Deployment

| Endpoint | URL |
|----------|-----|
| Base | https://baiust-academix-server.onrender.com |
| API Info | https://baiust-academix-server.onrender.com/api |
| Health Check | https://baiust-academix-server.onrender.com/api/health |

## Technology Stack

- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB Atlas with Mongoose ODM
- Authentication: JSON Web Tokens (JWT)
- Password Hashing: bcryptjs
- File Uploads: Multer
- Deployment Platform: Render

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

## Environment Configuration

Configure the following environment variables in your deployment platform (Render) or create a `.env` file for local development:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=https://baiust-academix-client.vercel.app
```

For production deployment on Render, these variables are set directly in the Render service dashboard under Environment.

## Installation and Setup

```bash
# Install project dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## Administrative Utilities

### Create Administrator Account

```bash
node createAdmin.js
```

### Seed Sample Resource Data

```bash
node seed.js
```

### Clear All Resources

```bash
node -e "require('dotenv').config(); const mongoose=require('mongoose'); const Resource=require('./models/Resource'); mongoose.connect(process.env.MONGO_URI).then(async()=>{await Resource.deleteMany({}); console.log('All resources cleared.'); mongoose.disconnect();})"
```

## API Reference

### Root

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | / | API information | Public |
| GET | /api | API information | Public |
| GET | /api/health | Server health check | Public |

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register new student account | Public |
| POST | /api/auth/login | Authenticate and receive JWT | Public |
| GET | /api/auth/me | Retrieve authenticated user profile | Authenticated |

### Resources

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/resources | List approved resources | Authenticated |
| POST | /api/resources | Submit a new resource | Authenticated |
| DELETE | /api/resources/:id | Delete a resource | Owner or Admin |
| PATCH | /api/resources/:id/status | Approve or reject a resource | Admin |

### Administration

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/admin/stats | Retrieve dashboard statistics | Admin |
| GET | /api/admin/users | List all student accounts | Admin |
| PATCH | /api/admin/users/:id/approve | Approve a student registration | Admin |
| PATCH | /api/admin/users/:id/suspend | Suspend a student account | Admin |
| DELETE | /api/admin/users/:id | Delete a student account | Admin |
| GET | /api/admin/resources | List all resources by status | Admin |

## Authentication Mechanism

All protected routes require a valid JWT token in the request Authorization header using the Bearer scheme:

```
Authorization: Bearer <token>
```

Tokens are issued upon successful authentication and expire after the duration specified in the JWT_EXPIRES_IN environment variable.

## User Roles and Permissions

| Role | Permissions |
|------|-------------|
| student | Browse resources, upload submissions, search repository |
| admin | All student permissions, approve or reject student registrations, moderate resource submissions, grant admin role to existing students |

## CORS Policy

API requests are accepted only from the following origins:

- https://baiust-academix-client.vercel.app
- http://localhost:5173

## Notes

- Administrator accounts cannot be registered through the public registration endpoint. Use the createAdmin.js script to provision administrator accounts directly.
- Uploaded files are stored in the uploads directory on the server. For production deployments, a cloud storage service such as Cloudinary or AWS S3 is recommended.
- The server is hosted on Render free tier. The service may experience a cold start delay of approximately 30 to 60 seconds after a period of inactivity.

---

Developed by Nosratee Jahan Naba
Department of Computer Science and Engineering, 18th Batch
Bangladesh Army International University of Science and Technology