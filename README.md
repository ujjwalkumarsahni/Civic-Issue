# Civic Issue Tracker 🚀

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A full-stack web application for **reporting, tracking, and resolving civic issues** in your community. Citizens can report local problems (potholes, garbage, broken streetlights), upload photos, track status, and view resolutions. Admins manage issues with advanced filtering, CSV exports, and geolocation.

## ✨ Features

### Frontend (React)
- **Issue Reporting**: Create issues with location, photos, category, and description
- **Real-time Maps**: Leaflet integration for issue locations
- **Dashboard**: Home page with stats, recent issues, and categories
- **Admin Panel**: Manage users/issues, resolve issues, export data
- **Authentication**: Login/Register with protected routes
- **Responsive UI**: Tailwind CSS, Framer Motion animations
- **Search & Filters**: Category, status, location, date filters with pagination

### Backend (Node.js/Express)
- **RESTful API**: CRUD for issues/users with advanced filtering
- **Image Uploads**: Cloudinary storage with multer
- **Authentication**: JWT tokens, role-based access (user/admin)
- **Geolocation**: Nearby issues using geolib
- **CSV Export**: Admin issue exports
- **Email Notifications**: Nodemailer integration
- **Security**: Rate limiting, helmet, mongo-sanitize, cors
- **MongoDB**: Schema-based models with population

## 🛠️ Tech Stack

| Frontend | Backend | Database/Storage | Others |
|----------|---------|------------------|--------|
| React 19 | Node.js | MongoDB | Cloudinary |
| Vite | Express | Mongoose | JWT |
| TailwindCSS | bcryptjs | - | Nodemailer |
| React Router | Winston | - | geolib |
| React Hook Form | multer | - | csv-writer |
| React Leaflet | helmet | - | Framer Motion |
| Axios | express-rate-limit | - | react-hot-toast |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (Atlas recommended)
- Cloudinary account
- Yarn/npm

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd Civic-Issue
```

**Backend:**
```bash
cd backend
npm install
cp .env.example .env  # Create from example
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### 2. Environment Variables

Create `.env` files (backend/.env and see backend/scripts/seedAdmin.js):

**Backend (.env):**
```
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here_min32chars
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
ADMIN_EMAIL=admin@cityissues.com
ADMIN_PASSWORD=Admin123!
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Seed Admin (optional):**
```bash
cd backend/scripts
node seedAdmin.js
```

### 3. Run Project

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev  # or npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173` | Backend API: `http://localhost:5000`

## 📁 Project Structure

```
Civic Issue/
├── backend/           # Node.js/Express API
│   ├── config/        # DB, Cloudinary config
│   ├── controllers/   # Business logic
│   ├── middleware/    # Auth, upload, error handling
│   ├── models/        # Issue, User schemas
│   ├── routes/        # API routes
│   ├── utils/         # Helpers (CSV, token, email)
│   └── server.js      # Entry point
├── frontend/          # React/Vite app
│   ├── src/
│   │   ├── components/ # Reusable UI (IssueCard, AdminDashboard...)
│   │   ├── context/   # Auth, Alert contexts
│   │   ├── hooks/     # Custom hooks
│   │   ├── pages/     # Page components
│   │   └── services/  # API calls
│   └── public/
├── README.md
└── .gitignore
```

## 🌐 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | - |
| POST | `/api/auth/login` | Login user | - |
| GET | `/api/issues` | Get issues (filters, pagination) | Optional |
| POST | `/api/issues` | Create issue | User |
| GET | `/api/issues/:id` | Issue details | - |
| PUT | `/api/issues/:id` | Update issue | User/Admin |
| DELETE | `/api/issues/:id` | Delete issue | Admin |
| GET | `/api/admin/issues` | Admin issues list/export | Admin |
| PUT | `/api/admin/issues/:id/resolve` | Resolve issue | Admin |
| GET | `/api/admin/users` | Admin users list | Admin |

**Base URL:** `http://localhost:5000/api`

## 📱 Pages/Routes (Frontend)

- `/` - Home (stats, recent issues)
- `/issues` - All issues with filters/map
- `/issues/create` - Report new issue
- `/issues/:id` - Issue details/comments
- `/login`, `/register` - Auth
- `/admin` - Admin dashboard
- `/profile` - User profile

## 🔍 Scripts & Utils

- **Admin Seed:** `backend/scripts/seedAdmin.js`
- **CSV Export:** Admin panel exports issues
- **Nearby Issues:** Geolocation-based search

## 🤝 Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/issue-tracker`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push (`git push origin feature/issue-tracker`)
5. Open Pull Request

## 🐛 Issues

Report bugs/feature requests via GitHub Issues.

## 📄 License

ISC License - see [LICENSE](LICENSE) (create if needed)

## 🙏 Acknowledgments

- Vite, React, TailwindCSS teams
- Cloudinary, MongoDB Atlas
- Open source contributors

---

⭐ **Star this repo if it helps your civic project!**
