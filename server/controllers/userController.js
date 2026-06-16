import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Resume from "../models/Resume.js";
import { sendPasswordResetEmail } from "../config/email.js";

// Generate token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields!" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // No manual hashing needed here
    const newUser = new User({
      name,
      email: email.toLowerCase().trim(),
      password,
    });
    await newUser.save();

    const token = generateToken(newUser._id);
    newUser.password = undefined;

    return res.status(201).json({
      message: "User created successfully!",
      token,
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required!" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password!" });
    }

    const token = generateToken(user._id);
    user.password = undefined;

    return res.status(200).json({
      message: "Login successful!",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const userId = req.userId; // set by auth middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    user.password = undefined;
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Controller for getting user resume
//get: /api/user/resumes

export const getUserResumes= async (req,res)=>{
  try {
    const userId=req.userId;

    //return user resume
    const resume=await Resume.find({userId});
    return res.status(200).json({
      success:true,
      resume
    })
    
  } catch (error) {
    return res.status(400).json({
      message:error.message  
    })
    
  }
}

const hashResetToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const getFrontendUrl = () =>
  process.env.FRONTEND_URL || "https://resume-builder-six-azure-62.vercel.app"||"http://localhost:5173";

// POST: /api/users/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required!" });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = hashResetToken(resetToken);
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
      await user.save({ validateBeforeSave: false });

      const resetUrl = `${getFrontendUrl()}/reset-password?token=${resetToken}`;
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl,
      });
    }

    return res.status(200).json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST: /api/users/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and new password are required!" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long!" });
    }

    const user = await User.findOne({
      resetPasswordToken: hashResetToken(token),
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired password reset link!" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully! You can now log in.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};