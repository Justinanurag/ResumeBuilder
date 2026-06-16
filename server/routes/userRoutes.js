import express from "express";
import { forgotPassword, getUserById, getUserResumes, loginUser, registerUser, resetPassword } from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const userRouter=express.Router();

userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);
userRouter.get('/data',protect,getUserById);
userRouter.get('/resumes',protect,getUserResumes); 

export default userRouter;  