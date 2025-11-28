import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || "gemini";

    console.log("🔧 AIService initialized");
    console.log("   Provider:", this.provider);
    console.log(
      "   OpenAI Key:",
      process.env.OPENAI_API_KEY?.substring(0, 10) + "..."
    );
    console.log(
      "   Gemini Key:",
      process.env.GEMINI_API_KEY?.substring(0, 10) + "..."
    );

    // Gemini initialization
    if (this.provider === "gemini") {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      });
      console.log("   ✅ Gemini model initialized");
    }

    // OpenAI initialization
    if (this.provider === "openai") {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      console.log("   ✅ OpenAI model initialized");
    }
  }

  async analyzeResume(resumeText) {
    // Validate if content looks like a resume
    const validation = this.validateResumeContent(resumeText);
    if (!validation.isValid) {
      throw new Error(validation.message);
    }

    const prompt = this.createPrompt(resumeText);

    if (this.provider === "gemini") {
      return await this.analyzeWithGemini(prompt);
    } else if (this.provider === "openai") {
      return await this.analyzeWithOpenAI(prompt);
    } else {
      throw new Error("Invalid AI provider");
    }
  }

  validateResumeContent(text) {
    // Check minimum length
    if (!text || text.trim().length < 100) {
      return {
        isValid: false,
        message: "File content is too short. Please upload a proper resume with at least 100 characters."
      };
    }

    // Check maximum length (prevent abuse)
    if (text.length > 50000) {
      return {
        isValid: false,
        message: "File content is too long. Please upload a resume under 50,000 characters."
      };
    }

    // Common resume keywords (at least one should be present)
    const resumeKeywords = [
      'experience', 'education', 'skills', 'work', 'professional',
      'qualifications', 'achievements', 'responsibilities', 'projects',
      'university', 'college', 'degree', 'bachelor', 'master',
      'employed', 'developer', 'engineer', 'manager', 'analyst',
      'resume', 'cv', 'curriculum', 'profile', 'objective', 'summary'
    ];

    const lowerText = text.toLowerCase();
    const hasResumeKeyword = resumeKeywords.some(keyword => lowerText.includes(keyword));

    if (!hasResumeKeyword) {
      return {
        isValid: false,
        message: "This doesn't appear to be a resume. Please upload a valid resume document containing professional experience, education, or skills."
      };
    }

    // Check for common non-resume patterns
    const nonResumePatterns = [
      /^<!DOCTYPE html/i,
      /<html/i,
      /^{\s*".*":\s*{/,  // JSON files
      /^<\?xml/i,         // XML files
      /BEGIN CERTIFICATE/i,
      /^import\s+/m,      // Code files
      /^package\s+/m,
      /^def\s+\w+\(/m,
      /^function\s+\w+\(/m
    ];

    for (const pattern of nonResumePatterns) {
      if (pattern.test(text)) {
        return {
          isValid: false,
          message: "Invalid file type detected. Please upload a resume in PDF or TXT format, not code, HTML, or other document types."
        };
      }
    }

    return { isValid: true };
  }

  createPrompt(resumeText) {
    return `
Analyze the following resume and provide a structured JSON response with EXACTLY these fields:
1. "skills": (array of technical & professional skills) minimum 5 and max 15
2. "summary": (2–3 sentence professional summary)
3. "suggested_roles": (array of 3–5 ideal matching job roles)

Resume Text:
${resumeText}

IMPORTANT:
⚠ Respond ONLY with valid JSON.
⚠ No markdown, no code blocks, no comments, no explanation.
    `;
  }

  async analyzeWithGemini(prompt) {
    try {
      const result = await this.model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      const text = result.response.text().trim();

      // Remove optional JSON wrappers
      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      return {
        skills: parsed.skills || [],
        summary: parsed.summary || "",
        suggestedRoles:
          parsed.suggested_roles ||
          parsed.suggestedRoles ||
          [],
      };
    } catch (error) {
      console.error("❌ Gemini API Error:", error);
      throw new Error(`Failed to analyze resume with Gemini: ${error.message}`);
    }
  }

  async analyzeWithOpenAI(prompt) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a professional resume analyzer. Always respond ONLY with valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 1200,
        response_format: { type: "json_object" },
      });

      const parsed = JSON.parse(completion.choices[0].message.content);

      return {
        skills: parsed.skills || [],
        summary: parsed.summary || "",
        suggestedRoles:
          parsed.suggested_roles ||
          parsed.suggestedRoles ||
          [],
      };
    } catch (error) {
      console.error("❌ OpenAI API Error:", error);
      throw new Error(`Failed to analyze resume with OpenAI: ${error.message}`);
    }
  }

  getModelInfo() {
    if (this.provider === "gemini") {
      return {
        provider: "gemini",
        model: process.env.GEMINI_MODEL || "gemini-1.5-flash-latest",
      };
    } else if (this.provider === "openai") {
      return {
        provider: "openai",
        model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      };
    }
  }
}

export default AIService;
