# 🤖 AI Resume Analyzer

<div align="center">

![AI Resume Analyzer](https://img.shields.io/badge/AI-Resume%20Analyzer-blueviolet?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)

**Intelligent Resume Analysis powered by Google Gemini AI**

[Live Demo](https://resumeanalyzerjob.netlify.app) • [Report Bug](https://github.com/RAHULJADHAV-07/Resume-Analysis/issues) • [Request Feature](https://github.com/RAHULJADHAV-07/Resume-Analysis/issues)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

**AI Resume Analyzer** is a modern web application that leverages Google Gemini AI to provide intelligent resume analysis. Upload your resume in multiple formats (PDF, TXT, DOC, DOCX), and get instant insights including extracted skills, professional summary, and suggested job roles tailored to your profile.

### 🌟 Why AI Resume Analyzer?

- **Smart Analysis**: Advanced AI-powered resume parsing and content validation
- **Multiple Formats**: Support for PDF, TXT, DOC, and DOCX files
- **Instant Results**: Get comprehensive analysis in seconds
- **History Tracking**: Save and review past analyses with search functionality
- **Mobile Responsive**: Beautiful UI that works seamlessly on all devices
- **Real-time Status**: Backend health monitoring with automatic status updates

---

## ✨ Features

### 🔍 Core Features

- **📄 Multi-Format Support**: Upload resumes in PDF, TXT, DOC, or DOCX format
- **🧠 AI-Powered Analysis**: 
  - Skill extraction and categorization
  - Professional summary generation
  - Job role recommendations based on profile
- **✅ Smart Validation**: 
  - Content validation to ensure uploaded files are actual resumes
  - File type and size restrictions (max 5MB)
  - Resume-specific keyword detection
- **📊 Analysis History**: 
  - Save all analyses with timestamps
  - Search functionality by name or email
  - Delete unwanted records
- **🎨 Modern UI/UX**: 
  - Beautiful gradient backgrounds
  - Smooth animations and transitions
  - Drag-and-drop file upload
  - Real-time backend status indicator with wait time tooltip

### 🛡️ Security & Validation

- File type validation (MIME type checking)
- Content validation (resume keyword detection)
- Non-resume content rejection (HTML, code, JSON, XML)
- File size limits
- MongoDB injection protection
- CORS configuration for secure cross-origin requests

---

## 🛠️ Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.3.6-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React%20Router-6.20.1-CA4245?style=flat&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.6.2-5A29E4?style=flat&logo=axios&logoColor=white)

- **React 18.2.0** - UI library
- **Vite 5.0.8** - Build tool & dev server
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **React Router DOM 6.20.1** - Client-side routing
- **Axios 1.6.2** - HTTP client
- **React Icons 4.12.0** - Icon library
- **React Toastify 9.1.3** - Toast notifications

### Backend

![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0.3-47A248?style=flat&logo=mongodb&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=flat&logo=google&logoColor=white)

- **Node.js** - Runtime environment
- **Express 4.18.2** - Web framework
- **MongoDB (Mongoose 8.0.3)** - Database
- **Google Generative AI 0.1.3** - AI model (Gemini 2.5 Flash)
- **Multer 1.4.5** - File upload handling
- **pdf-parse 1.1.1** - PDF text extraction
- **mammoth 1.11.0** - Word document parsing
- **CORS 2.8.5** - Cross-origin resource sharing
- **dotenv 16.3.1** - Environment variables

### Deployment

![Netlify](https://img.shields.io/badge/Netlify-Frontend-00C7B7?style=flat&logo=netlify&logoColor=white)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=flat&logo=render&logoColor=white)
![MongoDB Atlas](https://img.shields.io/badge/MongoDB%20Atlas-Database-47A248?style=flat&logo=mongodb&logoColor=white)

- **Frontend**: Netlify (Auto-deploy from GitHub)
- **Backend**: Render (Free tier with auto-deploy)
- **Database**: MongoDB Atlas (Cloud database)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Home Page  │  │ History Page │  │    Navbar    │     │
│  │  FileUpload  │  │    Search    │  │BackendStatus │     │
│  │AnalysisResult│  │    Delete    │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────────┬────────────────────────────────────┘
                         │ Axios API Calls
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API (Express)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Resume Controller                        │  │
│  │  • File Upload Handling   • Validation               │  │
│  │  • AI Analysis Trigger    • Database Operations      │  │
│  └──────────────────┬──────────────────┬────────────────┘  │
│                     │                  │                     │
│         ┌───────────▼────────┐  ┌──────▼───────────┐       │
│         │  Resume Parser      │  │   AI Service     │       │
│         │  • PDF Parse        │  │  • Gemini API    │       │
│         │  • TXT Parse        │  │  • Content Val.  │       │
│         │  • Word Parse       │  │  • Analysis Gen. │       │
│         └─────────────────────┘  └──────────────────┘       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              ResumeAnalysis Collection                │  │
│  │  • User Info      • Original Text   • AI Analysis    │  │
│  │  • File Metadata  • Processing Time • Timestamps     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB Atlas Account** (or local MongoDB)
- **Google Gemini API Key** ([Get it here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RAHULJADHAV-07/Resume-Analysis.git
   cd Resume-Analysis
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up Environment Variables** (see [Environment Variables](#-environment-variables) section)

5. **Run the Backend**
   ```bash
   cd server
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

6. **Run the Frontend**
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend (`server/.env`)

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database>

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration (for production)
CLIENT_URL=https://your-frontend-domain.netlify.app
```

### Frontend (`client/.env`)

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# For Production
# VITE_API_URL=https://your-backend-domain.onrender.com/api
```

---

## 🌐 Deployment

### Backend Deployment (Render)

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment Variables**: Add all variables from `server/.env`
4. Deploy! Render will auto-deploy on every push to main branch

### Frontend Deployment (Netlify)

1. Create a new site on [Netlify](https://netlify.com)
2. Connect your GitHub repository
3. Configure:
   - **Base Directory**: `client`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `client/dist`
   - **Environment Variables**: Add `VITE_API_URL` with your Render backend URL
4. Deploy! Netlify will auto-deploy on every push to main branch

### Important Notes

- Update CORS settings in `server/index.js` to include your Netlify domain
- Update `CLIENT_URL` in Render environment variables
- Render free tier may have cold starts (~30 seconds wait time on first request)

---

## 📡 API Documentation

### Base URL
```
Production: https://ai-resume-analyzer-api.onrender.com/api
Development: http://localhost:5000/api
```

### Endpoints

#### **1. Analyze Resume from File Upload**
```http
POST /resumes/analyze/upload
Content-Type: multipart/form-data
```

**Request Body:**
- `userName` (string, required): User's full name
- `userEmail` (string, required): User's email address
- `resume` (file, required): Resume file (PDF, TXT, DOC, DOCX, max 5MB)

**Response:**
```json
{
  "success": true,
  "message": "Resume analyzed successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "fileName": "resume.pdf",
    "analysis": {
      "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
      "summary": "Experienced full-stack developer...",
      "suggestedRoles": ["Full Stack Developer", "Frontend Engineer"]
    },
    "processingTime": 2345,
    "createdAt": "2025-11-29T10:30:00.000Z"
  }
}
```

#### **2. Analyze Resume from Text**
```http
POST /resumes/analyze/text
Content-Type: application/json
```

**Request Body:**
```json
{
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "resumeText": "Full resume text content..."
}
```

#### **3. Get All Analyses**
```http
GET /resumes
```

**Query Parameters:**
- `search` (optional): Search by name or email

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "userName": "John Doe",
      "userEmail": "john@example.com",
      "fileName": "resume.pdf",
      "fileType": "pdf",
      "analysis": {...},
      "createdAt": "2025-11-29T10:30:00.000Z"
    }
  ]
}
```

#### **4. Get Single Analysis**
```http
GET /resumes/:id
```

#### **5. Delete Analysis**
```http
DELETE /resumes/:id
```

### Error Responses

```json
{
  "success": false,
  "message": "Error message description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

---


## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📝 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Rahul Jadhav**

- GitHub: [@RAHULJADHAV-07](https://github.com/RAHULJADHAV-07)
- Email: rahuljadhav0417@gmail.com

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) - For providing the AI model
- [React](https://react.dev/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Render](https://render.com/) - Backend hosting
- [Netlify](https://netlify.com/) - Frontend hosting
- [MongoDB Atlas](https://www.mongodb.com/atlas) - Database hosting

---

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/RAHULJADHAV-07/Resume-Analysis)
![GitHub last commit](https://img.shields.io/github/last-commit/RAHULJADHAV-07/Resume-Analysis)
![GitHub issues](https://img.shields.io/github/issues/RAHULJADHAV-07/Resume-Analysis)
![GitHub pull requests](https://img.shields.io/github/issues-pr/RAHULJADHAV-07/Resume-Analysis)

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Made with ❤️ by Rahul Jadhav**

</div>
