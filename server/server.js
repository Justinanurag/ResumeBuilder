import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js"
import resumeRouter from "./routes/resumeRouter.js";
import aiRouter from "./routes/aiRouter.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT|| 3000 

// Middleware
app.use(cors());
app.use(express.json());


(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connection established!");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1); 
  }
})();

app.get("/", (req, res) => {
  res.send("🚀 Server is live and running...");
});
 
app.use('/api/users',userRouter);
app.use('/api/resumes',resumeRouter);
app.use('/api/ai',aiRouter);

app.listen(PORT, () => {
  console.log(`🌐 Server is running on port ${PORT}`);
});
