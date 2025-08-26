import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

/**
 * CV Analysis API Route
 *
 * Analyzes a CV against job requirements using AI
 *
 * @param request - Next.js request object containing:
 *   - jobRole: string - The target job role
 *   - jobDescription: string (optional) - Detailed job description
 *   - cvText: string - The CV content to analyze
 *
 * @returns JSON response with analysis results including:
 *   - overallScore: Overall match percentage
 *   - matchPercentage: Job relevance percentage
 *   - strengths: Array of CV strengths
 *   - weaknesses: Array of areas for improvement
 *   - missingSkills: Array of important missing skills
 *   - recommendations: Array of actionable recommendations
 *   - keywordMatch: Object with matched and missing keywords
 *   - summary: Executive summary of the analysis
 */
export async function POST(request: NextRequest) {
  try {
    // Extract request data
    const { jobRole, jobDescription, cvText } = await request.json()

    // Validate required fields
    if (!jobRole || !cvText) {
      return NextResponse.json({ error: "Job role and CV text are required" }, { status: 400 })
    }

    // Construct analysis prompt
    const prompt = `
You are an expert CV analyst and recruiter. Analyze the provided CV against the job role${jobDescription ? " and job description" : ""}.

Job Role: ${jobRole}
${jobDescription ? `Job Description: ${jobDescription}` : ""}

CV Content:
${cvText}

Provide a comprehensive analysis in the following JSON format:
{
  "overallScore": <number 0-100>,
  "matchPercentage": <number 0-100>,
  "strengths": [<array of 3-5 key strengths>],
  "weaknesses": [<array of 3-5 areas for improvement>],
  "missingSkills": [<array of 4-6 important missing skills>],
  "recommendations": [<array of 4-6 specific actionable recommendations>],
  "keywordMatch": {
    "matched": [<array of job-relevant keywords found in CV>],
    "missing": [<array of important keywords missing from CV>]
  },
  "summary": "<2-3 sentence executive summary of the analysis>"
}

Focus on:
1. Relevance to the specific job role
2. Skills alignment
3. Experience match
4. Keyword optimization
5. Areas for improvement
6. Specific, actionable recommendations

Be thorough, constructive, and provide valuable insights that will help improve the CV's effectiveness for this role.
`

    // Generate analysis using AI
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system:
        "You are a professional CV analyst. Always respond with valid JSON only, no additional text or formatting whatsoever, not even '```'.",
    })

    // console.log("CV Text: ", cvText)
    // console.log("AI Generated Text: ", text)

    // Parse the JSON response
    const analysis = JSON.parse(text)
    // console.log("Parsed JSON Text: ", analysis)

    // Check if user is authenticated to save analysis
    // const session = getSessionFromRequest(request)
    // if (session) {
    //   try {
    //     // Save analysis to database for authenticated users
    //     await saveCVAnalysis({
    //       user_id: session.userId,
    //       job_role: jobRole,
    //       job_description: jobDescription || null,
    //       original_cv: cvText,
    //       analysis_results: analysis,
    //       overall_score: analysis.overallScore,
    //       match_percentage: analysis.matchPercentage,
    //     })
    //   } catch (dbError) {
    //     console.error("Failed to save analysis to database:", dbError)
    //     // Continue without failing the request
    //   }
    // }

    return NextResponse.json(analysis)
  } catch (error) {
    // console.error("CV analysis error:", error)

    // Return appropriate error response
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid response format from AI service" }, { status: 500 })
    }

    return NextResponse.json({ error: "Failed to analyze CV. Please try again." }, { status: 500 })
  }
}
