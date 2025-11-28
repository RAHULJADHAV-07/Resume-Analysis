# AI Resume Analyzer

A full-stack web application that uses AI (Google Gemini Pro / OpenAI GPT) to analyze resumes and provide insights including skills extraction, professional summary, and suggested job roles.

## 🚀 Features

- **Multiple Input Methods**: Upload PDF/TXT files or paste resume text directly
- **AI-Powered Analysis**: Leverages Google Gemini Pro or OpenAI GPT models
- **Comprehensive Insights**:
  - Extracted skills
  - Professional summary (2-3 sentences)
  - Suggested job roles
- **History Management**: View and manage previous resume analyses
- **Search Functionality**: Search analyses by email
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Toastify** - Notifications
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **Google Generative AI** - Gemini Pro integration
- **OpenAI** - GPT model integration

## 📁 Project Structure

```
ai-resume-analyzer/
├── client/                      # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.css
│   │   │   ├── Footer.jsx
│   │   │   ├── Footer.css
│   │   │   ├── FileUpload.jsx
│   │   │   ├── FileUpload.css
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── LoadingSpinner.css
│   │   │   ├── AnalysisResult.jsx
│   │   │   └── AnalysisResult.css
│   │   ├── pages/              # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Home.css
│   │   │   ├── History.jsx
│   │   │   └── History.css
│   │   ├── services/           # API service layer
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── server/                      # Backend Node.js application
│   ├── config/                 # Configuration files
│   │   ├── database.js
│   │   └── multerConfig.js
│   ├── controllers/            # Request handlers
│   │   └── resumeController.js
│   ├── models/                 # Database models
│   │   └── ResumeAnalysis.js
│   ├── routes/                 # API routes
│   │   └── resumeRoutes.js
│   ├── services/               # Business logic
│   │   ├── aiService.js
│   │   └── resumeParserService.js
│   ├── index.js                # Entry point
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Google Gemini API Key OR OpenAI API Key

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-analyzer
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-analyzer

# Choose AI Provider
AI_PROVIDER=gemini  # or 'openai'

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-pro

# OpenAI (alternative)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

CLIENT_URL=http://localhost:5173
```

5. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

6. Open browser at `http://localhost:5173`

## 📊 Database Schema

### ResumeAnalysis Collection

```javascript
{
  userName: String (required),
  userEmail: String (required, email format),
  originalText: String (required),
  fileName: String (optional),
  fileType: String (enum: ['pdf', 'txt', 'text']),
  analysis: {
    skills: [String],
    summary: String,
    suggestedRoles: [String]
  },
  aiProvider: String (enum: ['gemini', 'openai']),
  modelUsed: String,
  processingTime: Number (milliseconds),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Resume Analysis

#### POST `/api/resumes/analyze/upload`
Upload and analyze resume file (PDF/TXT)

**Request**: `multipart/form-data`
- `resume` (file): Resume file
- `userName` (string): User's full name
- `userEmail` (string): User's email

**Response**:
```json
{
  "success": true,
  "message": "Resume analyzed successfully",
  "data": {
    "id": "...",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "fileName": "resume.pdf",
    "analysis": {
      "skills": ["JavaScript", "React", "Node.js"],
      "summary": "Experienced developer...",
      "suggestedRoles": ["Full Stack Developer", "Frontend Engineer"]
    },
    "processingTime": 1250,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/resumes/analyze/text`
Analyze resume from text input

**Request**: `application/json`
```json
{
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "resumeText": "Your resume text here..."
}
```

**Response**: Same as above

#### GET `/api/resumes`
Get all resume analyses (with optional email filter)

**Query Parameters**:
- `email` (optional): Filter by email
- `limit` (optional, default: 10): Results per page
- `page` (optional, default: 1): Page number

#### GET `/api/resumes/:id`
Get specific resume analysis by ID

#### DELETE `/api/resumes/:id`
Delete resume analysis by ID

#### GET `/api/resumes/stats/:email`
Get user statistics by email

## 🎨 UI Flow

1. **Home Page** (`/`)
   - Select input method (File Upload or Text Input)
   - Enter user details (name, email)
   - Upload file or paste resume text
   - Submit for analysis
   - View results with skills, summary, and suggested roles

2. **History Page** (`/history`)
   - View all previous analyses
   - Search by email
   - View detailed results
   - Delete analyses

## 🔄 Data Flow

```
User Input (File/Text) 
    ↓
Frontend (React)
    ↓
[Axios Request]
    ↓
Backend API (Express)
    ↓
File Upload (Multer) → Text Extraction (pdf-parse)
    ↓
AI Service (Gemini/OpenAI)
    ↓
JSON Response Parsing
    ↓
MongoDB Storage (Mongoose)
    ↓
[HTTP Response]
    ↓
Frontend Display (React Components)
```

## 🚀 Deployment

### Backend Deployment (Render/Railway)

1. **Render**:
   - Create new Web Service
   - Connect GitHub repository
   - Set root directory to `server`
   - Build command: `npm install`
   - Start command: `npm start`
   - Add environment variables

2. **Railway**:
   - Create new project
   - Deploy from GitHub
   - Set root directory to `server`
   - Add environment variables

### Frontend Deployment (Vercel/Netlify)

1. **Vercel**:
```bash
cd client
npm run build
vercel --prod
```

2. **Netlify**:
```bash
cd client
npm run build
# Deploy dist folder
```

### Database (MongoDB Atlas)

1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IP addresses (0.0.0.0/0 for all)
4. Get connection string
5. Update `MONGODB_URI` in backend `.env`

## 🎯 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-pro
OPENAI_API_KEY=your_openai_key (optional)
OPENAI_MODEL=gpt-3.5-turbo (optional)
CLIENT_URL=your_frontend_url
MAX_FILE_SIZE=5242880
```

### Frontend (.env)
```env
VITE_API_URL=your_backend_api_url
```

## ✨ Bonus Features & Improvements

### Implemented
- ✅ Drag-and-drop file upload
- ✅ Real-time processing time display
- ✅ Email-based search
- ✅ Responsive design
- ✅ Error handling with toast notifications
- ✅ Loading states

### Potential Enhancements
- 🔐 User authentication (JWT)
- 📧 Email notifications
- 📊 Analytics dashboard
- 🔍 Advanced search filters
- 📥 Export results to PDF
- 🌐 Multi-language support
- 💾 Resume comparison feature
- 🎨 Custom branding/themes
- 📱 Progressive Web App (PWA)
- 🔄 Batch resume processing
- 🤖 Resume improvement suggestions
- 📈 Skill gap analysis
- 🎓 Learning resource recommendations

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# Or check connection string in .env
```

### AI API Errors
```bash
# Verify API keys are correct
# Check API quotas/limits
# Ensure internet connectivity
```

### Port Already in Use
```bash
# Change PORT in server/.env
# Or kill process using the port
```

## 📝 License

MIT License - feel free to use this project for learning and development.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Built with ❤️ using React, Node.js, and AI**
#   R e s u m e - A n a l y s i s  
 