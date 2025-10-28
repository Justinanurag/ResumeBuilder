//controller for enhancing a resume's professional summary
//POST :/api/ai/enhance-pro-sum

import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

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
//POST :/api/ai/enhance-pro-desc


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

    const enhancedJobDescription = response.choices?.[0]?.message?.content?.trim();

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
      message: error.message || "Something went wrong while enhancing job description.",
    });
  }
};


