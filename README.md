# BAIUST Academix
**A Centralised Academic Resource Sharing Platform for BAIUSTians**

Designed & developed by **Nosratee Jahan Naba**

---

## Project Structure

```
baiust-academix/
├── frontend/    React + Vite
└── backend/     Node.js + Express + MongoDB
```

---

## Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev            # http://localhost:5000

node createAdmin.js    # creates admin@baiust.ac.bd / admin123456
```

### Frontend
```bash
cd frontend
npm install
npm run dev             # http://localhost:5173
```

---

## Features

- JWT authentication (register / login / protected routes)
- Dark / Light mode toggle (persisted)
- All 8 semesters, 60+ BAIUST CSE courses hard-coded (Level 1.1 → 4.2)
- Upload Books, Notes/PDFs, Videos, Others per course
- **Admin approval workflow** — every upload starts as `pending`
- Admin Panel: approve/reject resources, ban/unban users, promote to admin
- Full-text search with type and semester filters
- Custom SVG logo, Ghibli-style animated illustrations
- Mobile-first responsive design
- Material Symbols icons throughout (no emoji)

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | Protected | Current user |
| GET | /api/resources | Protected | List (students see approved only) |
| POST | /api/resources | Protected | Upload (status=pending) |
| DELETE | /api/resources/:id | Protected | Delete own / admin |
| PATCH | /api/resources/:id/status | Admin | Approve / reject |
| GET | /api/admin/stats | Admin | Dashboard stats |
| GET | /api/admin/users | Admin | List all users |
| PATCH | /api/admin/users/:id/role | Admin | Promote/demote |
| PATCH | /api/admin/users/:id/status | Admin | Ban/unban |
| GET | /api/admin/resources | Admin | All resources, any status |

---

## Deployment

**Backend → Render**: root `backend`, start `npm start`, env: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`
**Frontend → Vercel**: root `frontend`, env: `VITE_API_URL=https://your-backend.onrender.com/api`
**Database → MongoDB Atlas (Free M0)**

---

## BAIUST Logo

The Navbar/Footer use a custom SVG logo (book + spark icon). If you'd like to swap in the official BAIUST crest image instead, place it at `frontend/public/baiust-logo.png` and update `src/components/Logo.jsx` to use an `<img>` tag.
# baiust-academix-server
