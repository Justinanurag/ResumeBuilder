import imagekit from "../config/Imagekit.js"
import Resume from "../models/Resume.js";
import fs from 'fs'
//Controller for creating a new Resume
//POST:/api/resume/create
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    console.log("ye backend se h ",userId,title)

    //create new resume
    const newResume = await Resume.create({ userId, title });
    //return success message
    return res.status(200).json({
      message: "Resume created successfully",
      status: true,
      resume: newResume,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};
// Controller for deleting a Resume
// DELETE: /api/resume/delete/:resumeId
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;
    const deleted = await Resume.findOneAndDelete({ userId, _id: resumeId });
    if (!deleted) {
      return res.status(404).json({ message: "Resume not found", success: false });
    }
    return res.status(200).json({
      message: "Resume deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};

// Get user resume by id
// GET: /api/resume/get/:resumeId
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ userId, _id: resumeId });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found", success: false });
    }
    return res.status(200).json({
      message: "Resume fetched successfully",
      success: true,
      resume,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};
//get user resume by id public
//GET:/api/resume/public
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ public: true, _id: resumeId });
    if (!resume) {
      return res.status(202).json({
        success: false,
        message: "Resume not found!!",
      });
    }
    //return success message
    return res.status(200).json({
      message: "Public resume fetched successfully",
      success: true,
      resume,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};
//controller for updating a resume 
//PUT:/api/resume/update 

export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground, title } = req.body;
    const image = req.file;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: resumeId",
      });
    }

    // Title-only update support (no file, no resumeData)
    if (title && !resumeData && !image) {
      const updated = await Resume.findOneAndUpdate(
        { _id: resumeId, userId },
        { title },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ success: false, message: "Resume not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Resume title updated successfully",
        data: updated,
      });
    }

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: resumeData",
      });
    }

    let resumeDataCopy = JSON.parse(resumeData);

    if (image) {
      const imageBufferData = fs.createReadStream(image.path);
      const transformation = [
        "w-300",
        "h-300",
        "fo-face",
        "z-0.75",
        ...(removeBackground ? ["e-bgremove"] : []),
      ].join(",");
      const response = await imagekit.upload({
        file: imageBufferData,
        fileName: "resume.png",
        folder: "user-resume",
        transformation: { pre: transformation },
      });
      resumeDataCopy.personal_info = {
        ...resumeDataCopy.personal_info,
        image: response.url,
      };
      fs.unlinkSync(image.path);
    }

    const resume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId },
      resumeDataCopy,
      { new: true }
    );
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found!" });
    }
    return res.status(200).json({
      success: true,
      message: "Resume updated successfully!",
      data: resume,
    });
  } catch (error) {
    console.error("Error updating resume:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

