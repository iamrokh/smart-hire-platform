import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Lazy initialization of GoogleGenAI
let aiInstance: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in AI Studio Secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Increase json limit for processing larger text blocks
app.use(express.json({ limit: "10mb" }));

// Live endpoint to check backend health and API key status
app.get("/api/config", (req, res) => {
  res.json({
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Candidate resume analysis API using real-time Gemini
app.post("/api/analyze-resume", async (req, res) => {
  try {
    const { resumeText, targetRole } = req.body;
    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length === 0) {
      return res.status(400).json({ error: "Missing or invalid resume text." });
    }

    const ai = getGemini();

    const prompt = `Analyze the following resume text and the specified target career goal / professional title.
Generate a comprehensive, tailored resume analysis containing:
1. Candidate's core details (parsed name, parsed professional title, 1-2 sentence professional summary, estimated years of experience).
2. Existing matching skills that align with this targeted space.
3. Skill Gap Analysis: List specific missing or developing skills that the candidate should acquire, categorized with an estimated duration in hours to learn, importance rating, and custom concrete course labels/titles.
4. Personal Career Learning Roadmap: Visualizable stages (with Duration, Stage Objective, Key Topics, Specific Action Items, and Learning Resources/Certifications).
5. Highlight 3 target companies or type of roles where they currently fit, with a matched percentage and reason.

CRITICAL: Please write all text fields in Persian (Farsi) language. The candidate's name, professionalTitle, summary, missingSkills (skill, category, description, recommendedCourses), roadmap (phase, duration, objective, topics, actionItems, learningResource), and targetCompanies (companyName, role, reason) should all be output in fluent, highly professional, and natural Persian (Farsi) since the client interface is localized for Persian speakers.

Target Career Goal / Title: ${targetRole || 'Highly matched engineering or professional title based on resume'}

Resume Content:
${resumeText}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            candidateName: { type: Type.STRING, description: "Parsed candidate name from the resume or 'Applicant' if not found." },
            professionalTitle: { type: Type.STRING, description: "The candidate's current or best-fit professional title." },
            summary: { type: Type.STRING, description: "A high-impact 1-2 sentence professional assessment of their profile." },
            experienceYears: { type: Type.INTEGER, description: "Calculated years of experience based on dates in the resume." },
            matchingSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Important skills/technologies the candidate possesses that align with their target goals."
            },
            missingSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING, description: "Name of the missing or developing skill" },
                  category: { type: Type.STRING, description: "e.g., Languages, Frameworks, Cloud, Soft Skills, Methodology" },
                  description: { type: Type.STRING, description: "Why this skill is relevant or why there's a gap" },
                  relevance: { type: Type.STRING, description: "Must be 'High', 'Medium', or 'Low'" },
                  estimatedHoursToLearn: { type: Type.INTEGER, description: "Rough timeline estimate in hours (e.g. 20, 60)" },
                  recommendedCourses: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Well-known courses, certifications, or books to learn this skill"
                  }
                },
                required: ["skill", "category", "description", "relevance", "estimatedHoursToLearn", "recommendedCourses"]
              }
            },
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING, description: "e.g., 'Phase 1: Foundations' or 'Stage 1'" },
                  duration: { type: Type.STRING, description: "e.g. 'Weeks 1-3' or 'Month 1'" },
                  objective: { type: Type.STRING, description: "Direct milestone target of this stage" },
                  topics: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Bullet points for specific libraries or protocols to learn"
                  },
                  actionItems: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Actionable hands-on things to do (e.g., 'Build webapp using S3', 'Optimize SQL queries')"
                  },
                  learningResource: { type: Type.STRING, description: "Main course, book, doc link, or recommendation" }
                },
                required: ["phase", "duration", "objective", "topics", "actionItems", "learningResource"]
              }
            },
            targetCompanies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  companyName: { type: Type.STRING, description: "Specific real-world company names or enterprise profiles matching their skill level" },
                  role: { type: Type.STRING, description: "Target matched job title" },
                  salary: { type: Type.STRING, description: "Estimated market salary range (e.g. '$110,000 - $140,000')" },
                  matchPercent: { type: Type.INTEGER, description: "Calculate matching coefficient strictly from 0 to 100" },
                  reason: { type: Type.STRING, description: "Bullet explanation of why this is a good fit." }
                },
                required: ["companyName", "role", "salary", "matchPercent", "reason"]
              }
            }
          },
          required: [
            "candidateName",
            "professionalTitle",
            "summary",
            "experienceYears",
            "matchingSkills",
            "missingSkills",
            "roadmap",
            "targetCompanies"
          ]
        }
      }
    });

    const textResult = response.text;
    if (!textResult) {
      throw new Error("No response content generated from Gemini.");
    }

    const data = JSON.parse(textResult.trim());
    return res.json(data);

  } catch (error: any) {
    console.error("Error in /api/analyze-resume:", error);
    res.status(500).json({
      error: error.message || "An unexpected error occurred during resume analysis.",
      isConfigError: error.message?.includes("GEMINI_API_KEY")
    });
  }
});

// Employer screening of single Resume against custom criteria/Job Description
app.post("/api/screen-candidate", async (req, res) => {
  try {
    const { resumeText, jobDescription, candidateName, candidateTitle } = req.body;
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: "Missing resume text or job description." });
    }

    const ai = getGemini();

    const prompt = `Screen the following candidate resume text against the provided Job Description.
Perform an advanced, modern risk evaluation of tenure/stability (e.g., frequent job hopping vs long tenures, gaps, progressive growth), calculate skill match coefficient, find primary strengths and gaps/weaknesses from resume vs job description, draft specific engineering or behavioral interview questions of high depth, and output an overall recommendation.

Candidate Name context: ${candidateName || "the Candidate"}
Professional Title context: ${candidateTitle || "Software Engineer Profile"}

Job Description:
${jobDescription}

Candidate Resume Text:
${resumeText}

CRITICAL: Please write all text fields in Persian (Farsi) language. The candidateName, professionalTitle, riskReasoning, stabilityAnalysis, strengths, weaknesses, interviewQuestions, and overallRecommendation fields must all be structured in elegant, high-impact Persian (Farsi) language, appropriate for a standard recruitments assessment report.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            candidateId: { type: Type.STRING, description: "A simple random string identifier." },
            candidateName: { type: Type.STRING, description: "Name of the candidate." },
            professionalTitle: { type: Type.STRING, description: "Parsed/actual professional title." },
            matchScore: { type: Type.INTEGER, description: "Match score percentage from 0 to 100 based on requirements met." },
            riskScore: { type: Type.STRING, description: "Must be either 'Low', 'Medium', or 'High'" },
            riskReasoning: { type: Type.STRING, description: "In-depth rationale of tenure risk, technological risk, or skill gap risk." },
            stabilityAnalysis: { type: Type.STRING, description: "Evaluation of employment dates, duration of jobs, and career progression." },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List 3-4 key assets this candidate possesses."
            },
            weaknesses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List 2-3 specific technical gaps or flags."
            },
            interviewQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List 3-4 highly tailored questions to drill into their specific profile during screening."
            },
            overallRecommendation: { type: Type.STRING, description: "A summarizing recommendation of whether to move forward, and why." }
          },
          required: [
            "candidateId",
            "candidateName",
            "professionalTitle",
            "matchScore",
            "riskScore",
            "riskReasoning",
            "stabilityAnalysis",
            "strengths",
            "weaknesses",
            "interviewQuestions",
            "overallRecommendation"
          ]
        }
      }
    });

    const textResult = response.text;
    if (!textResult) {
      throw new Error("No screening feedback generated from Gemini.");
    }

    const data = JSON.parse(textResult.trim());
    return res.json(data);

  } catch (error: any) {
    console.error("Error in /api/screen-candidate:", error);
    res.status(500).json({
      error: error.message || "An unexpected error occurred during candidate screening.",
      isConfigError: error.message?.includes("GEMINI_API_KEY")
    });
  }
});

// Configure Vite or Static Files
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Configuring server with Vite middleware in development...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production assets from /dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Recruiting & Roadmap Server successfully listening at http://localhost:${PORT}`);
  });
}

setupServer();
