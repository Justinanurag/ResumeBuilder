import express from 'express'
import { enhanceJobDescription, enhanceProfessionalSummary } from '../controllers/aiController.js';

const aiRouter=express.Router();

aiRouter.post('/enhance-job-description',enhanceJobDescription);
aiRouter.post('/enhance-summary',enhanceProfessionalSummary);
export default aiRouter;