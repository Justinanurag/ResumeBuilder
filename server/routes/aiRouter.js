import express from 'express'
import { enhanceJobDescription, enhanceProfessionalSummary, uploadResume } from '../controllers/aiController.js';
import protect from "../middleware/authMiddleware.js"

const aiRouter=express.Router();

aiRouter.post('/enhance-job-description',protect,enhanceJobDescription);
aiRouter.post('/enhance-summary',protect,enhanceProfessionalSummary);
aiRouter.post('/upload-resume',protect,uploadResume)
export default aiRouter;