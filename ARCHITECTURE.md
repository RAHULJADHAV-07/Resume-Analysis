# AI Resume Analyzer - Architecture Documentation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                    (React + Vite - Port 5173)                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Navbar     │  │    Footer    │  │  Loading     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ FileUpload   │  │    Result    │  │   Services   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────────────────────────────────────────┐          │
│  │           Pages: Home | History                   │          │
│  └──────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTP/HTTPS (Axios)
┌─────────────────────────────────────────────────────────────────┐
│                         SERVER LAYER                             │
│                   (Express.js - Port 5000)                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────┐            │
│  │              API Routes Layer                   │            │
│  │  POST /api/resumes/analyze/upload               │            │
│  │  POST /api/resumes/analyze/text                 │            │
│  │  GET  /api/resumes                              │            │
│  │  GET  /api/resumes/:id                          │            │
│  │  DELETE /api/resumes/:id                        │            │
│  └────────────────────────────────────────────────┘            │
│                          ↓                                       │
│  ┌────────────────────────────────────────────────┐            │
│  │           Controller Layer                      │            │
│  │  • analyzeResumeFromFile()                      │            │
│  │  • analyzeResumeFromText()                      │            │
│  │  • getAllResumes()                              │            │
│  │  • getResumeById()                              │            │
│  │  • deleteResume()                               │            │
│  └────────────────────────────────────────────────┘            │
│                          ↓                                       │
│  ┌────────────────────────────────────────────────┐            │
│  │            Service Layer                        │            │
│  │  ┌──────────────┐  ┌──────────────┐           │            │
│  │  │  AI Service  │  │ Parser Svc   │           │            │
│  │  │  • Gemini    │  │ • PDF Parse  │           │            │
│  │  │  • OpenAI    │  │ • TXT Parse  │           │            │
│  │  └──────────────┘  └──────────────┘           │            │
│  └────────────────────────────────────────────────┘            │
│                          ↓                                       │
│  ┌────────────────────────────────────────────────┐            │
│  │            Middleware Layer                     │            │
│  │  • CORS                                         │            │
│  │  • Multer (File Upload)                         │            │
│  │  • Error Handler                                │            │
│  │  • Body Parser                                  │            │
│  └────────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                              │
│                    (MongoDB/Atlas)                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────┐            │
│  │       ResumeAnalysis Collection                 │            │
│  │  {                                              │            │
│  │    userName, userEmail,                         │            │
│  │    originalText, fileName,                      │            │
│  │    analysis: {                                  │            │
│  │      skills[], summary,                         │            │
│  │      suggestedRoles[]                           │            │
│  │    },                                           │            │
│  │    aiProvider, modelUsed,                       │            │
│  │    processingTime, timestamps                   │            │
│  │  }                                              │            │
│  └────────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL AI SERVICES                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐     ┌──────────────────┐                │
│  │  Google Gemini   │     │     OpenAI       │                │
│  │    gemini-pro    │     │   gpt-3.5-turbo  │                │
│  │                  │     │   gpt-4          │                │
│  └──────────────────┘     └──────────────────┘                │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### File Upload Flow
```
User → FileUpload Component → FormData
  ↓
Axios POST /api/resumes/analyze/upload
  ↓
Multer Middleware (validates & saves file)
  ↓
resumeController.analyzeResumeFromFile()
  ↓
resumeParserService.parseFile()
  ↓ (PDF/TXT extraction)
Plain Text
  ↓
aiService.analyzeResume()
  ↓ (API call to Gemini/OpenAI)
JSON Response { skills, summary, suggestedRoles }
  ↓
Save to MongoDB (ResumeAnalysis model)
  ↓
Delete uploaded file
  ↓
Return JSON response to client
  ↓
AnalysisResult Component displays data
```

### Text Input Flow
```
User → Textarea Input → React State
  ↓
Axios POST /api/resumes/analyze/text
  ↓
resumeController.analyzeResumeFromText()
  ↓
aiService.analyzeResume()
  ↓ (API call to Gemini/OpenAI)
JSON Response { skills, summary, suggestedRoles }
  ↓
Save to MongoDB (ResumeAnalysis model)
  ↓
Return JSON response to client
  ↓
AnalysisResult Component displays data
```

## Component Hierarchy

```
App
├── Navbar
├── Routes
│   ├── Home
│   │   ├── FileUpload
│   │   ├── LoadingSpinner (conditional)
│   │   └── AnalysisResult (conditional)
│   └── History
│       ├── LoadingSpinner (conditional)
│       └── Modal (conditional)
└── Footer
```

## State Management Strategy

### Home Component State
```javascript
{
  inputMethod: 'file' | 'text',
  userName: string,
  userEmail: string,
  selectedFile: File | null,
  resumeText: string,
  loading: boolean,
  result: object | null
}
```

### History Component State
```javascript
{
  resumes: array,
  loading: boolean,
  searchEmail: string,
  selectedResume: object | null
}
```

## API Service Layer

```javascript
// services/api.js
resumeService = {
  analyzeFromFile(formData),
  analyzeFromText(data),
  getAll(params),
  getById(id),
  delete(id),
  getUserStats(email)
}
```

## Error Handling Strategy

### Frontend
- Form validation before submission
- Axios interceptors for global error handling
- Toast notifications for user feedback
- Loading states during async operations
- Try-catch blocks around API calls

### Backend
- Express error handling middleware
- Input validation (required fields, email format)
- File type and size validation
- Database error handling
- AI API error handling with fallbacks
- Consistent error response format

## Security Considerations

1. **File Upload Security**
   - File type validation (PDF, TXT only)
   - File size limits (5MB max)
   - Files deleted after processing
   - Stored in temporary directory

2. **API Security**
   - CORS configuration
   - Environment variables for sensitive data
   - Input sanitization
   - Rate limiting (recommended)

3. **Database Security**
   - Mongoose schema validation
   - Email format validation
   - No raw text stored in listings

## Performance Optimizations

1. **Frontend**
   - Code splitting with React Router
   - Lazy loading of components
   - Optimized re-renders
   - Vite build optimization

2. **Backend**
   - Database indexing on email and createdAt
   - Pagination for list endpoints
   - File cleanup after processing
   - Connection pooling for MongoDB

3. **AI Integration**
   - Processing time tracking
   - Error retry logic
   - Response caching (future enhancement)

## Scalability Considerations

1. **Horizontal Scaling**
   - Stateless API design
   - Database connection pooling
   - Cloud-ready architecture

2. **Vertical Scaling**
   - Efficient algorithms
   - Minimal memory footprint
   - Optimized database queries

3. **Future Enhancements**
   - Redis caching layer
   - Queue system for batch processing
   - CDN for static assets
   - Load balancing

## Testing Strategy

### Frontend Testing
- Unit tests for components (Jest + React Testing Library)
- Integration tests for API calls
- E2E tests (Playwright/Cypress)

### Backend Testing
- Unit tests for services
- Integration tests for API endpoints
- Database mocking
- AI service mocking

## Deployment Architecture

```
┌─────────────────────────────────────────────┐
│          Frontend (Vercel/Netlify)          │
│              Static Hosting                  │
└─────────────────┬───────────────────────────┘
                  │ HTTPS
┌─────────────────▼───────────────────────────┐
│         Backend (Render/Railway)            │
│           Node.js + Express                  │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Database (MongoDB Atlas)             │
│            Managed MongoDB                   │
└──────────────────────────────────────────────┘
```

---

This architecture ensures:
- ✅ Separation of concerns
- ✅ Scalability
- ✅ Maintainability
- ✅ Security
- ✅ Performance
- ✅ Testability
