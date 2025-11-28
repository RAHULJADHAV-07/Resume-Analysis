# AI Resume Analyzer - Setup Instructions

## Quick Start Guide

Follow these steps to get the application running on your local machine.

### Step 1: Install Prerequisites

1. **Install Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation:
   ```bash
   node --version
   npm --version
   ```

2. **Install MongoDB**
   - Option A: Local MongoDB
     - Download from: https://www.mongodb.com/try/download/community
     - Start MongoDB service
   
   - Option B: MongoDB Atlas (Cloud - Recommended)
     - Sign up at: https://www.mongodb.com/cloud/atlas
     - Create free cluster
     - Get connection string

3. **Get AI API Key**
   - Option A: Google Gemini
     - Get key from: https://makersuite.google.com/app/apikey
   
   - Option B: OpenAI
     - Get key from: https://platform.openai.com/api-keys

### Step 2: Backend Setup

1. Open PowerShell and navigate to server directory:
```powershell
cd "c:\Users\rahul\OneDrive\Desktop\Resume Analyser\server"
```

2. Install dependencies:
```powershell
npm install
```

3. Create `.env` file (copy from .env.example):
```powershell
Copy-Item .env.example .env
```

4. Edit `.env` file with your values:
```powershell
notepad .env
```

Add your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-analyzer
AI_PROVIDER=gemini
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-pro
CLIENT_URL=http://localhost:5173
```

5. Start the backend server:
```powershell
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

### Step 3: Frontend Setup

1. Open a NEW PowerShell window and navigate to client directory:
```powershell
cd "c:\Users\rahul\OneDrive\Desktop\Resume Analyser\client"
```

2. Install dependencies:
```powershell
npm install
```

3. Create `.env` file:
```powershell
Copy-Item .env.example .env
```

4. The default `.env` should work (no changes needed):
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the frontend development server:
```powershell
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### Step 4: Test the Application

1. Open your browser and go to: `http://localhost:5173`

2. You should see the AI Resume Analyzer homepage

3. Try analyzing a resume:
   - Enter your name and email
   - Upload a PDF resume or paste resume text
   - Click "Analyze Resume"
   - View the results!

4. Check the history page to see saved analyses

## Troubleshooting

### Backend won't start

**Error: "MongoDB connection error"**
- Make sure MongoDB is running
- Check your MONGODB_URI in `.env`
- For local MongoDB: `mongodb://localhost:27017/resume-analyzer`
- For Atlas: Use the connection string from Atlas dashboard

**Error: "AI API error"**
- Verify your API key is correct in `.env`
- Check if you have API quota remaining
- Make sure AI_PROVIDER matches your key (gemini or openai)

### Frontend won't start

**Error: "Cannot connect to backend"**
- Make sure backend is running on port 5000
- Check if VITE_API_URL in client/.env is correct
- Verify no firewall is blocking the connection

**Port 5173 already in use**
- Kill the process using port 5173
- Or modify vite.config.js to use a different port

### File upload not working

- Make sure uploads folder exists in server directory
- Check file size (max 5MB)
- Only PDF and TXT files are supported

## Next Steps

### For Development

1. Make changes to the code
2. Both servers have hot-reload enabled
3. Changes will reflect automatically

### For Production Deployment

See the main README.md file for deployment instructions.

## Project Structure

```
Resume Analyser/
├── server/              # Backend (run first)
│   ├── npm run dev     # Start backend
│   └── port 5000
│
└── client/             # Frontend (run second)
    ├── npm run dev     # Start frontend
    └── port 5173
```

## Common Commands

### Backend
```powershell
cd server
npm install          # Install dependencies
npm run dev         # Start development server
npm start           # Start production server
```

### Frontend
```powershell
cd client
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
```

## Need Help?

- Check the main README.md for detailed documentation
- Review API endpoints and data flow
- Check browser console for frontend errors
- Check PowerShell terminal for backend errors

---

**Happy Coding! 🚀**
