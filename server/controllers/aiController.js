//controller for enhancing a resume's professional summary
//POST :/api/ai/enhance-pro-sum

import openai from "../config/ai.js";
import Resume from "../models/Resume.js";

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    // console.log(userContent);

    // ✅ Validate input
    if (!userContent || userContent.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Missing required field: userContent",
      });
    }

    // ✅ Generate enhanced professional summary
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1–2 sentences long and highlight key skills and achievements clearly and career objective.Make it compelling and ATS-friendly. and only return text no options or anything else.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    // console.log("ye response h:",response)

    const enhancedSummary = response.choices?.[0]?.message?.content?.trim();

    if (!enhancedSummary) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate enhanced summary.",
      });
    }

    // ✅ Send enhanced summary
    return res.status(200).json({
      success: true,
      message: "Professional summary enhanced successfully!",
      enhancedSummary,
    });
  } catch (error) {
    console.error("Error enhancing summary:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while enhancing summary.",
    });
  }
};

//controller for enhancing a resume's job description
//POST :/api/ai/enhance-job-description
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    // ✅ Validate input
    if (!userContent || userContent.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Missing required field: userContent",
      });
    }

    // ✅ Generate enhanced job description using OpenAI
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume and job description writing. Your task is to enhance a job description to make it more compelling, professional, and ATS-friendly. The output should clearly highlight key responsibilities, required skills, and impact — written in a natural and concise tone. Return only the improved job description text.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedJobDescription =
      response.choices?.[0]?.message?.content?.trim();

    if (!enhancedJobDescription) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate enhanced job description.",
      });
    }

    // ✅ Send enhanced job description
    return res.status(200).json({
      success: true,
      message: "Job description enhanced successfully!",
      enhancedJobDescription,
    });
  } catch (error) {
    console.error("Error enhancing job description:", error);
    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Something went wrong while enhancing job description.",
    });
  }
};

//controller for uploading resume in database
//POST :/api/ai/upload-resume


export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    // ✅ Validate input
    if (!resumeText || !title) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: resumeText or title.",
      });
    }

    // ✅ Create prompt
    const systemPrompt =
      "You are an expert AI agent that extracts structured data from resumes.";

    const userPrompt = `
Extract the candidate's details from the following resume text:
${resumeText}

Return the result strictly in this JSON structure (no text before or after it):
{
  "professional_summary": "",
  "skills": [],
  "personal_info": {
    "image": "",
    "full_name": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "",
      "end_date": "",
      "description": "",
      "is_current": false
    }
  ],
  "project": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduation_date": "",
      "gpa": ""
    }
  ]
}`;

    // ✅ Call OpenAI API
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const extractedData = response.choices?.[0]?.message?.content?.trim();

    if (!extractedData) {
      return res.status(500).json({
        success: false,
        message: "Failed to extract data from resume. Please try again.",
      });
    }

    // ✅ Parse JSON safely
    let parsedData;
    try {
      parsedData = JSON.parse(extractedData);
    } catch (err) {
      console.error("❌ Error parsing AI response:", err);
      return res.status(500).json({
        success: false,
        message:
          "Error parsing AI response. Ensure the model returns valid JSON.",
      });
    }

    // ✅ Save extracted data to database
    const newResume = await Resume.create({
      userId,
      title,
      ...parsedData,
    });

    // ✅ Send success response
    return res.status(200).json({
      success: true,
      message: "Resume uploaded and extracted successfully!",
      resumeId: newResume._id,
      data: newResume,
    });
  } catch (error) {
    console.error("❌ Error uploading resume:", error);
    return res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while uploading the resume.",
    });
  }
};
