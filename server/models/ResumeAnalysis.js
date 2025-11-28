import mongoose from 'mongoose';

const resumeAnalysisSchema = new mongoose.Schema({
  // User Information
  userName: {
    type: String,
    required: [true, 'User name is required'],
    trim: true
  },
  userEmail: {
    type: String,
    required: [true, 'User email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  
  // Resume Data
  originalText: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    default: null
  },
  fileType: {
    type: String,
    enum: ['pdf', 'txt', 'text'],
    default: 'text'
  },
  
  // AI Analysis Results
  analysis: {
    skills: {
      type: [String],
      default: []
    },
    summary: {
      type: String,
      default: ''
    },
    suggestedRoles: {
      type: [String],
      default: []
    }
  },
  
  // Metadata
  aiProvider: {
    type: String,
    enum: ['gemini', 'openai'],
    default: 'gemini'
  },
  modelUsed: {
    type: String,
    default: ''
  },
  processingTime: {
    type: Number,
    default: 0 // in milliseconds
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
resumeAnalysisSchema.index({ userEmail: 1, createdAt: -1 });
resumeAnalysisSchema.index({ createdAt: -1 });

// Virtual for user's full analysis count
resumeAnalysisSchema.virtual('analysisCount', {
  ref: 'ResumeAnalysis',
  localField: 'userEmail',
  foreignField: 'userEmail',
  count: true
});

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);

export default ResumeAnalysis;
