import express from 'express';
import upload from '../config/multerConfig.js';
import {
  analyzeResumeFromFile,
  analyzeResumeFromText,
  getAllResumes,
  getResumeById,
  deleteResume,
  getUserStats
} from '../controllers/resumeController.js';

const router = express.Router();

// POST routes for analysis
router.post('/analyze/upload', upload.single('resume'), analyzeResumeFromFile);
router.post('/analyze/text', analyzeResumeFromText);

// GET routes
router.get('/', getAllResumes);
router.get('/stats/:email', getUserStats);
router.get('/:id', getResumeById);

// DELETE route
router.delete('/:id', deleteResume);

export default router;
