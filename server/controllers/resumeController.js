import ResumeAnalysis from '../models/ResumeAnalysis.js';
import AIService from '../services/aiService.js';
import resumeParserService from '../services/resumeParserService.js';

// Lazy initialization - create instance only when needed
let aiServiceInstance = null;
const getAIService = () => {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService();
  }
  return aiServiceInstance;
};

// @desc    Analyze resume from file upload
// @route   POST /api/resumes/analyze/upload
// @access  Public
export const analyzeResumeFromFile = async (req, res) => {
  const startTime = Date.now();
  
  console.log('=== DEBUG REQUEST ===');
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);
  console.log('req.files:', req.files);
  console.log('All form fields:', Object.keys(req.body));
  console.log('===================');
  
  try {
    const { userName, userEmail } = req.body;
    
    console.log('Extracted values:');
    console.log('userName:', userName);
    console.log('userEmail:', userEmail);
    console.log('file:', req.file ? 'present' : 'not present');
    
    // Validation
    if (!userName || !userEmail) {
      console.log('Validation failed: missing userName or userEmail');
      return res.status(400).json({
        success: false,
        message: 'User name and email are required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Validate file type
    const allowedMimeTypes = [
      'application/pdf', 
      'text/plain',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
    ];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      await resumeParserService.deleteFile(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Please upload a PDF, TXT, DOC, or DOCX file only.'
      });
    }

    // Parse the uploaded file
    let fileType;
    if (req.file.mimetype === 'application/pdf') {
      fileType = 'pdf';
    } else if (req.file.mimetype === 'text/plain') {
      fileType = 'txt';
    } else if (req.file.mimetype === 'application/msword' || 
               req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      fileType = 'docx';
    }
    const resumeText = await resumeParserService.parseFile(req.file.path, fileType);
    
    if (!resumeText || resumeText.trim().length === 0) {
      await resumeParserService.deleteFile(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from file. Please ensure the file contains readable text.'
      });
    }

    // Analyze with AI
    const aiService = getAIService();
    const analysis = await aiService.analyzeResume(resumeText);
    const modelInfo = aiService.getModelInfo();
    
    // Calculate processing time
    const processingTime = Date.now() - startTime;

    // Save to database
    const resumeAnalysis = await ResumeAnalysis.create({
      userName,
      userEmail,
      originalText: resumeText,
      fileName: req.file.originalname,
      fileType,
      analysis: {
        skills: analysis.skills,
        summary: analysis.summary,
        suggestedRoles: analysis.suggestedRoles
      },
      aiProvider: modelInfo.provider,
      modelUsed: modelInfo.model,
      processingTime
    });

    // Delete the uploaded file after processing
    await resumeParserService.deleteFile(req.file.path);

    res.status(201).json({
      success: true,
      message: 'Resume analyzed successfully',
      data: {
        id: resumeAnalysis._id,
        userName: resumeAnalysis.userName,
        userEmail: resumeAnalysis.userEmail,
        fileName: resumeAnalysis.fileName,
        analysis: resumeAnalysis.analysis,
        processingTime: resumeAnalysis.processingTime,
        createdAt: resumeAnalysis.createdAt
      }
    });

  } catch (error) {
    console.error('Error in analyzeResumeFromFile:', error);
    
    // Clean up file if exists
    if (req.file) {
      await resumeParserService.deleteFile(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze resume',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Analyze resume from text input
// @route   POST /api/resumes/analyze/text
// @access  Public
export const analyzeResumeFromText = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { userName, userEmail, resumeText } = req.body;
    
    // Validation
    if (!userName || !userEmail || !resumeText) {
      return res.status(400).json({
        success: false,
        message: 'User name, email, and resume text are required'
      });
    }

    if (resumeText.trim().length < 100) {
      return res.status(400).json({
        success: false,
        message: 'Resume text is too short. Please provide at least 100 characters with professional details like experience, education, or skills.'
      });
    }

    if (resumeText.trim().length > 50000) {
      return res.status(400).json({
        success: false,
        message: 'Resume text is too long. Please keep it under 50,000 characters.'
      });
    }

    // Analyze with AI
    const aiService = getAIService();
    const analysis = await aiService.analyzeResume(resumeText);
    const modelInfo = aiService.getModelInfo();
    
    // Calculate processing time
    const processingTime = Date.now() - startTime;

    // Save to database
    const resumeAnalysis = await ResumeAnalysis.create({
      userName,
      userEmail,
      originalText: resumeText,
      fileName: null,
      fileType: 'text',
      analysis: {
        skills: analysis.skills,
        summary: analysis.summary,
        suggestedRoles: analysis.suggestedRoles
      },
      aiProvider: modelInfo.provider,
      modelUsed: modelInfo.model,
      processingTime
    });

    res.status(201).json({
      success: true,
      message: 'Resume analyzed successfully',
      data: {
        id: resumeAnalysis._id,
        userName: resumeAnalysis.userName,
        userEmail: resumeAnalysis.userEmail,
        analysis: resumeAnalysis.analysis,
        processingTime: resumeAnalysis.processingTime,
        createdAt: resumeAnalysis.createdAt
      }
    });

  } catch (error) {
    console.error('Error in analyzeResumeFromText:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze resume',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Get all resume analyses
// @route   GET /api/resumes
// @access  Public
export const getAllResumes = async (req, res) => {
  try {
    const { email, limit = 10, page = 1 } = req.query;
    
    const query = email ? { userEmail: email } : {};
    const skip = (page - 1) * limit;
    
    const resumes = await ResumeAnalysis.find(query)
      .select('-originalText')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await ResumeAnalysis.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: resumes.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: resumes
    });
  } catch (error) {
    console.error('Error in getAllResumes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resumes'
    });
  }
};

// @desc    Get single resume analysis by ID
// @route   GET /api/resumes/:id
// @access  Public
export const getResumeById = async (req, res) => {
  try {
    const resume = await ResumeAnalysis.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume analysis not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Error in getResumeById:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resume'
    });
  }
};

// @desc    Delete resume analysis
// @route   DELETE /api/resumes/:id
// @access  Public
export const deleteResume = async (req, res) => {
  try {
    const resume = await ResumeAnalysis.findByIdAndDelete(req.params.id);
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume analysis not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Resume analysis deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteResume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resume'
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/resumes/stats/:email
// @access  Public
export const getUserStats = async (req, res) => {
  try {
    const { email } = req.params;
    
    const totalAnalyses = await ResumeAnalysis.countDocuments({ userEmail: email });
    const recentAnalyses = await ResumeAnalysis.find({ userEmail: email })
      .select('-originalText')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.status(200).json({
      success: true,
      data: {
        email,
        totalAnalyses,
        recentAnalyses
      }
    });
  } catch (error) {
    console.error('Error in getUserStats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics'
    });
  }
};
