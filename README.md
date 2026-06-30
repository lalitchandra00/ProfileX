# ProfileX

ProfileX is a dynamic, full-stack MERN (MongoDB, Express, React, Node.js) application designed as a personalized user profile system. It allows users to securely sign up, log in, fill out a comprehensive profile form, upload a PDF resume, and view their details on a dedicated, beautifully designed profile page.

## ✨ Features

- **Secure User Authentication:** Complete Signup and Login flows with robust validation and duplicate checking.
- **Profile Data Management:** A comprehensive form on the Home page to input personal details and work experience.
- **Resume Upload Integration:** Upload PDF resumes which are securely processed using `multer` and stored in **Cloudinary**.
- **Isolated User Data:** Every profile and its associated data (including the resume) is strictly tied to individual user accounts using unique `userId`s.
- **Modern UI/UX**: Built with React and styled using Tailwind CSS, featuring a responsive, state-of-the-art design.
- **Session Management:** Utilizes `localStorage` on the frontend for persistent user sessions across page reloads.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (via Vite)
- **Styling:** Tailwind CSS (v4)
- **Routing:** React Router DOM 

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **File Uploads & Storage:** Multer & Cloudinary
- **Authentication/Security:** bcrypt, jsonwebtoken, cors, cookie-parser

## 📂 Project Structure

```
ProfileX/
├── frontend/             # React application (Vite)
│   ├── src/
│   │   ├── pages/        # React components (Home, Login, Profile, Signup)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css     # Global styles & Tailwind configuration
│   └── package.json
├── src/                  # Express backend application
│   ├── models/           # Mongoose schemas (User, Profile)
│   ├── middlewares/      # Express middlewares (Multer for file uploads)
│   ├── utils/            # Utilities (Cloudinary upload logic)
│   ├── app.js            # Express app configuration and API routes
│   └── index.js          # Backend entry point and DB connection
├── .env                  # Backend environment variables
└── package.json          # Backend dependencies and scripts
```




## 📡 API Endpoints

- `POST /api/signup`: Register a new user.
- `POST /api/login`: Authenticate an existing user.
- `POST /api/home`: Create or update (upsert) the authenticated user's profile data.
- `GET /api/profile`: Retrieve the authenticated user's profile data.
- `POST /api/upload-pdf`: Upload a resume PDF to Cloudinary and link the URL to the user's profile.



