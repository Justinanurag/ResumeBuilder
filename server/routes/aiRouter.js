import express from 'express'
import {
  calculateAtsScore,
  enhanceJobDescription,
  enhanceProfessionalSummary,
  uploadResume,
} from "../controllers/aiController.js";
import protect from "../middleware/authMiddleware.js"

const aiRouter=express.Router();

aiRouter.post('/enhance-job-description',protect,enhanceJobDescription);
aiRouter.post('/enhance-summary',protect,enhanceProfessionalSummary);
aiRouter.post('/upload-resume',protect,uploadResume)
aiRouter.post('/ats-score',protect,calculateAtsScore)
export default aiRouter;