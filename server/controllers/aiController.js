//controller for enhancing a resume's professional summary
//POST :/api/ai/enhance-pro-sum

import openai from "../config/ai.js";
import Resume from "../models/Resume.js";

const ATS_SCORE_PROMPT = `
You are an Applicant Tracking System (ATS) scoring engine. Compare the candidate's resume against the supplied job description.

Return ONLY valid JSON following this exact shape:
{
  "score": 0,
  "verdict": "",
  "strengths": [],
  "gaps": [],
  "recommendations": [],
  "keyword_alignment": [
    { "keyword": "", "match": 0 }
  ]
}

Rules:
- "score" must be an integer between 0 and 100.
- Populate at least 2 items for strengths, gaps, and recommendations when possible.
- "keyword_alignment" should list up to 5 critical keywords with match percentages (0-100).
- Keep the tone concise, professional, and action-oriented.
`;

const formatResumeForPrompt = (resume) => {
  const summary = [
    `Title: ${resume.title}`,
    resume.professional_summary
      ? `Summary: ${resume.professional_summary}`
      : null,
    resume.skills?.length ? `Skills: ${resume.skills.join(", ")}` : null,
    resume.experience?.length
      ? `Experience:\n${resume.experience
          .filter(Boolean)
          .map(
            (exp, idx) =>
              `${idx + 1}. ${exp.position || "Role"} at ${
                exp.company || "Company"
              } (${exp.start_date || "Start"} - ${exp.is_current ? "Present" : exp.end_date || "End"})\nImpact: ${
                exp.description || "N/A"
              }`
          )
          .join("\n")}`
      : null,
    resume.project?.length
      ? `Projects:\n${resume.project
          .filter(Boolean)
          .map(
            (proj, idx) =>
              `${idx + 1}. ${proj.name || "Project"} - ${proj.type || ""}\nImpact: ${
                proj.description || "N/A"
              }`
          )
          .join("\n")}`
      : null,
    resume.education?.length
      ? `Education:\n${resume.education
          .filter(Boolean)
          .map(
            (edu, idx) =>
              `${idx + 1}. ${edu.degree || "Degree"} in ${
                edu.field || "Field"
              } @ ${edu.institution || "Institution"} (${edu.graduation_date || "Year"})`
          )
          .join("\n")}`
      : null,
  ];

  return summary.filter(Boolean).join("\n\n");
};

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
          content: `
            You are an expert resume writer. Enhance job description for resume experience.
            Output 4-6 bullet points only. ATS focused. Result driven. 
            No job posting style, no headings, no company intro, no qualification requirements.
            Return ONLY bullet points.
          `,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });
    // console.log("ye response h:",response)
    

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

export const calculateAtsScore = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;
    const userId = req.userId;

    if (!resumeId || !jobDescription?.trim()) {
      return res.status(400).json({
        success: false,
        message: "resumeId and jobDescription are required.",
      });
    }

    const resume = await Resume.findOne({ _id: resumeId, userId });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    const formattedResume = formatResumeForPrompt(resume);
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: ATS_SCORE_PROMPT,
        },
        {
          role: "user",
          content: `JOB DESCRIPTION:\n${jobDescription.trim()}\n\nRESUME:\n${formattedResume}`,
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate ATS score. Please try again.",
      });
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(content);
    } catch (error) {
      console.error("ATS score parsing error:", error);
      return res.status(500).json({
        success: false,
        message: "Received invalid response from AI.",
      });
    }

    return res.status(200).json({
      success: true,
      result: parsedResult,
    });
  } catch (error) {
    console.error("ATS score error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to calculate ATS score.",
    });
  }
};
