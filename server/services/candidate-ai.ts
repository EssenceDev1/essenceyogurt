// Essence Yogurt - AI Candidate Ranking Service (Gemini-powered)
// Uses Replit AI Integrations for Gemini access

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

interface CandidateData {
  id: string;
  fullName: string;
  email: string;
  positionTitle: string;
  yearsExperience: string | null;
  coverLetter: string | null;
  location: string | null;
  whyChooseYou: string | null;
  customerServiceExample: string | null;
  teamworkExample: string | null;
  expectedSalary: string | null;
  availability: string | null;
}

interface CandidateRanking {
  candidateId: string;
  candidateName: string;
  overallScore: number;
  intelligenceScore: number;
  potentialScore: number;
  costEfficiencyScore: number;
  screeningQualityScore: number;
  recommendation: string;
  reasoning: string;
  redFlags: string;
  estimatedCostTier: "low" | "medium" | "high";
  trainabilityRating: "excellent" | "good" | "fair" | "poor";
  aiShortlisted: boolean;
}

interface RankingResult {
  rankings: CandidateRanking[];
  topRecommendation: string;
  summary: string;
}

export async function rankCandidates(candidates: CandidateData[]): Promise<RankingResult> {
  if (candidates.length === 0) {
    return {
      rankings: [],
      topRecommendation: "No candidates to evaluate",
      summary: "No applications received yet.",
    };
  }

  const candidateDescriptions = candidates.map((c, i) => `
Candidate ${i + 1} (ID: ${c.id}):
- ID: ${c.id}
- Name: ${c.fullName}
- Position: ${c.positionTitle}
- Experience: ${c.yearsExperience || "Not specified"}
- Expected Salary: ${c.expectedSalary || "Not specified"}
- Availability: ${c.availability || "Not specified"}

SCREENING ANSWERS:
Q: Why should we choose you over other applicants?
A: ${c.whyChooseYou || "Not answered"}

Q: Customer service example?
A: ${c.customerServiceExample || "Not answered"}

Q: Teamwork example?
A: ${c.teamworkExample || "Not answered"}

Additional Details: ${c.coverLetter || "No details provided"}
`).join("\n");

  const prompt = `You are an HR AI assistant for Essence Yogurt, a luxury frozen yogurt brand. 
Analyze these job candidates and rank them based on our hiring priorities:

PRIORITY ORDER:
1. COST EFFICIENCY (Most Important - 50%) - Cheaper candidates who will accept lower wages are preferred
2. QUALITY/INTELLIGENCE (30%) - Smart, logical thinking candidates who can learn quickly
3. TRAINABILITY (20%) - Even young/inexperienced candidates are great if they're eager to learn

KEY INSIGHT: Students, young people (17-18), and those with no experience are often the BEST hires because:
- They accept lower wages (great for budget)
- They're eager to learn and trainable
- They have flexible schedules
- Simple retail job doesn't require degrees

SCREENING ANSWER ANALYSIS (Smart Logic):
When evaluating screening answers, use these criteria:

1. "Why choose you" answer analysis:
   - Does the answer show genuine enthusiasm and unique value?
   - Is it specific and thoughtful (HIGH SCORE) or generic/copy-pasted (LOW SCORE)?
   - Does it show self-awareness about their strengths?
   - RED FLAGS: Generic answers, bragging without substance, entitlement

2. Customer Service Example analysis:
   - Does the story show empathy and problem-solving?
   - Is it specific with real details (GOOD) or vague (BAD)?
   - Does it demonstrate going above and beyond?
   - RED FLAGS: No example at all, blame others, negative attitude

3. Teamwork Example analysis:
   - Does the story show collaboration and communication?
   - Do they give credit to others (GOOD sign)?
   - Is there a clear positive outcome?
   - RED FLAGS: Taking all credit, poor conflict resolution

4. Expected Salary:
   - "Minimum wage is fine" = HIGH cost efficiency score
   - "$15-20/hr" = HIGH cost efficiency score
   - "$20-25/hr" = MEDIUM cost efficiency score
   - "$25-30/hr" = LOW cost efficiency score
   - "$30+/hr" = VERY LOW cost efficiency score
   - "Negotiable" = MEDIUM cost efficiency score

CANDIDATE PROFILES TO RANK:
${candidateDescriptions}

For each candidate, provide these fields (use the exact candidate ID provided):
1. candidateId: The exact ID string from the candidate data above (e.g., "abc123")
2. candidateName: The candidate's full name
3. overallScore: Integer 0-100, weighted: cost efficiency 50%, potential 30%, trainability 20%
4. intelligenceScore: Integer 0-100, based on how they communicate, logical thinking shown in their screening answers
5. potentialScore: Integer 0-100, growth potential, enthusiasm, willingness to learn
6. costEfficiencyScore: Integer 0-100, based on expected salary + indicators (students = higher score)
7. screeningQualityScore: Integer 0-100, quality of their screening question answers
8. trainabilityRating: One of: excellent, good, fair, poor
9. estimatedCostTier: One of: low, medium, high based on likely salary expectations
10. recommendation: One of: hire_immediately, strong_consider, consider, maybe_later, pass
11. reasoning: Brief 2-3 sentence explanation including assessment of their screening answers
12. redFlags: Any concerning issues found in their answers (or "None")

SHORTLISTING CRITERIA:
- overallScore >= 70 AND no major red flags = SHORTLIST (aiShortlisted = true)
- overallScore >= 60 AND good screening answers = STRONG CONSIDER
- overallScore < 50 OR major red flags = PASS

IMPORTANT: All scores must be integers between 0 and 100. Use the exact candidateId from the data provided.

Return your analysis as JSON with the structure specified.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rankings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  candidateId: { type: Type.STRING },
                  candidateName: { type: Type.STRING },
                  overallScore: { type: Type.INTEGER },
                  intelligenceScore: { type: Type.INTEGER },
                  potentialScore: { type: Type.INTEGER },
                  costEfficiencyScore: { type: Type.INTEGER },
                  screeningQualityScore: { type: Type.INTEGER },
                  recommendation: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                  redFlags: { type: Type.STRING },
                  estimatedCostTier: { type: Type.STRING },
                  trainabilityRating: { type: Type.STRING },
                  aiShortlisted: { type: Type.BOOLEAN },
                },
                required: ["candidateId", "candidateName", "overallScore", "recommendation", "reasoning", "screeningQualityScore"],
              },
            },
            topRecommendation: { type: Type.STRING },
            summary: { type: Type.STRING },
          },
          required: ["rankings", "topRecommendation", "summary"],
        },
      },
    });

    let responseText = response.text || "";
    
    if (!responseText && (response as any).candidates?.[0]?.content?.parts?.[0]?.text) {
      responseText = (response as any).candidates[0].content.parts[0].text;
    }
    
    if (!responseText) {
      throw new Error("No response text from Gemini");
    }
    
    const result = JSON.parse(responseText);
    
    const candidateMap = new Map(candidates.map(c => [c.id, c]));
    
    result.rankings = (result.rankings || []).map((r: any, i: number) => {
      const matchedCandidate = candidateMap.get(r.candidateId) || candidates[i];
      const safeScore = (val: any, def: number = 50): number => {
        const num = parseInt(String(val), 10);
        return isNaN(num) ? def : Math.min(100, Math.max(0, num));
      };
      
      const overallScore = safeScore(r.overallScore);
      const aiShortlisted = r.aiShortlisted ?? (overallScore >= 70 && (!r.redFlags || r.redFlags === "None"));
      
      return {
        candidateId: matchedCandidate?.id || r.candidateId || `candidate-${i + 1}`,
        candidateName: r.candidateName || matchedCandidate?.fullName || `Candidate ${i + 1}`,
        overallScore,
        intelligenceScore: safeScore(r.intelligenceScore),
        potentialScore: safeScore(r.potentialScore),
        costEfficiencyScore: safeScore(r.costEfficiencyScore),
        screeningQualityScore: safeScore(r.screeningQualityScore),
        estimatedCostTier: ["low", "medium", "high"].includes(r.estimatedCostTier) ? r.estimatedCostTier : "medium",
        trainabilityRating: ["excellent", "good", "fair", "poor"].includes(r.trainabilityRating) ? r.trainabilityRating : "good",
        recommendation: ["hire_immediately", "strong_consider", "consider", "maybe_later", "pass"].includes(r.recommendation) ? r.recommendation : "consider",
        reasoning: r.reasoning || "Analysis pending",
        redFlags: r.redFlags || "None",
        aiShortlisted,
      };
    });

    result.rankings.sort((a: CandidateRanking, b: CandidateRanking) => b.overallScore - a.overallScore);

    return result as RankingResult;
  } catch (error) {
    console.error("[CandidateAI] Error ranking candidates:", error);
    
    const fallbackRankings: CandidateRanking[] = candidates.map((c) => ({
      candidateId: c.id,
      candidateName: c.fullName,
      overallScore: 50,
      intelligenceScore: 50,
      potentialScore: 50,
      costEfficiencyScore: 50,
      screeningQualityScore: 50,
      recommendation: "consider",
      reasoning: "AI analysis temporarily unavailable - manual review recommended",
      redFlags: "None",
      estimatedCostTier: "medium" as const,
      trainabilityRating: "good" as const,
      aiShortlisted: false,
    }));

    return {
      rankings: fallbackRankings,
      topRecommendation: "Manual review recommended - AI analysis unavailable",
      summary: "Unable to perform AI analysis at this time. Please review candidates manually.",
    };
  }
}

export async function analyzeIndividualCandidate(candidate: CandidateData): Promise<CandidateRanking> {
  const prompt = `Analyze this job candidate for Essence Yogurt (luxury frozen yogurt):

Name: ${candidate.fullName}
Position: ${candidate.positionTitle}
Experience: ${candidate.yearsExperience || "Not specified"}
Application: ${candidate.coverLetter || "No details"}

PRIORITIES: Cost efficiency first (cheaper is better), then intelligence/potential, then trainability.
Young/inexperienced candidates are GOOD if they'll accept lower wages.

Rate them 0-100 on: overall, intelligence, potential, cost efficiency.
Give recommendation: hire_immediately / strong_consider / consider / maybe_later / pass`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER },
            intelligenceScore: { type: Type.INTEGER },
            potentialScore: { type: Type.INTEGER },
            costEfficiencyScore: { type: Type.INTEGER },
            recommendation: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            estimatedCostTier: { type: Type.STRING },
            trainabilityRating: { type: Type.STRING },
          },
          required: ["overallScore", "recommendation", "reasoning"],
        },
      },
    });

    let responseText = response.text || "";
    
    if (!responseText && (response as any).candidates?.[0]?.content?.parts?.[0]?.text) {
      responseText = (response as any).candidates[0].content.parts[0].text;
    }
    
    const result = JSON.parse(responseText || "{}");
    
    const safeScore = (val: any, def: number = 50): number => {
      const num = parseInt(String(val), 10);
      return isNaN(num) ? def : Math.min(100, Math.max(0, num));
    };
    
    const overallScore = safeScore(result.overallScore);
    return {
      candidateId: candidate.id,
      candidateName: candidate.fullName,
      overallScore,
      intelligenceScore: safeScore(result.intelligenceScore),
      potentialScore: safeScore(result.potentialScore),
      costEfficiencyScore: safeScore(result.costEfficiencyScore),
      screeningQualityScore: safeScore(result.screeningQualityScore),
      recommendation: ["hire_immediately", "strong_consider", "consider", "maybe_later", "pass"].includes(result.recommendation) ? result.recommendation : "consider",
      reasoning: result.reasoning || "Analysis pending",
      redFlags: result.redFlags || "None",
      estimatedCostTier: ["low", "medium", "high"].includes(result.estimatedCostTier) ? result.estimatedCostTier : "medium",
      trainabilityRating: ["excellent", "good", "fair", "poor"].includes(result.trainabilityRating) ? result.trainabilityRating : "good",
      aiShortlisted: overallScore >= 70,
    };
  } catch (error) {
    console.error("[CandidateAI] Error analyzing candidate:", error);
    return {
      candidateId: candidate.id,
      candidateName: candidate.fullName,
      overallScore: 50,
      intelligenceScore: 50,
      potentialScore: 50,
      costEfficiencyScore: 50,
      screeningQualityScore: 50,
      recommendation: "consider",
      reasoning: "AI analysis unavailable - manual review needed",
      redFlags: "None",
      estimatedCostTier: "medium" as const,
      trainabilityRating: "good" as const,
      aiShortlisted: false,
    };
  }
}

// ============================================================
// RESUME/CV ANALYSIS - Gemini AI Resume Scanner
// ============================================================

export interface ResumeAnalysisResult {
  summary: string;
  keySkills: string[];
  experienceYears: string;
  education: string;
  languages: string[];
  strengths: string[];
  concerns: string[];
  relevanceScore: number;
  hiringRecommendation: string;
}

export async function analyzeResume(resumeText: string, positionTitle: string): Promise<ResumeAnalysisResult> {
  console.log(`[CandidateAI] Analyzing resume for position: ${positionTitle}`);
  
  if (!resumeText || resumeText.trim().length < 50) {
    return {
      summary: "Resume content too short or empty for analysis",
      keySkills: [],
      experienceYears: "Unknown",
      education: "Not specified",
      languages: [],
      strengths: [],
      concerns: ["Insufficient resume content provided"],
      relevanceScore: 0,
      hiringRecommendation: "Unable to analyze - resume content required",
    };
  }

  const prompt = `You are an HR AI assistant for Essence Yogurt, a luxury frozen yogurt brand.
Analyze this resume/CV for the position of "${positionTitle}".

CONTEXT:
- We run luxury self-serve frozen yogurt stores (like Yochi in Australia)
- Most positions are entry-level retail (no experience required)
- We value: customer service attitude, reliability, flexibility, trainability
- Students and young people are IDEAL candidates - we train everyone

RESUME TEXT:
${resumeText}

Analyze and extract:
1. Brief summary (2-3 sentences)
2. Key skills relevant to retail/hospitality
3. Years of experience (estimate if unclear)
4. Education level
5. Languages spoken
6. Strengths for this role
7. Any concerns (gaps, red flags)
8. Relevance score (0-100) for our retail position
9. Hiring recommendation

Remember: NO experience is NOT a negative - students and fresh candidates are great!`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            experienceYears: { type: Type.STRING },
            education: { type: Type.STRING },
            languages: { type: Type.ARRAY, items: { type: Type.STRING } },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            concerns: { type: Type.ARRAY, items: { type: Type.STRING } },
            relevanceScore: { type: Type.NUMBER },
            hiringRecommendation: { type: Type.STRING },
          },
          required: ["summary", "relevanceScore", "hiringRecommendation"],
        },
      },
    });

    const text = response.text || "{}";
    const result = JSON.parse(text);
    
    console.log("[CandidateAI] Resume analysis complete");
    
    return {
      summary: result.summary || "Analysis complete",
      keySkills: result.keySkills || [],
      experienceYears: result.experienceYears || "Unknown",
      education: result.education || "Not specified",
      languages: result.languages || [],
      strengths: result.strengths || [],
      concerns: result.concerns || [],
      relevanceScore: Math.min(100, Math.max(0, result.relevanceScore || 50)),
      hiringRecommendation: result.hiringRecommendation || "Review manually",
    };
  } catch (error) {
    console.error("[CandidateAI] Resume analysis error:", error);
    return {
      summary: "AI analysis unavailable - please review manually",
      keySkills: [],
      experienceYears: "Unknown",
      education: "Not specified",
      languages: [],
      strengths: [],
      concerns: ["AI analysis failed - manual review required"],
      relevanceScore: 50,
      hiringRecommendation: "Manual review required",
    };
  }
}
