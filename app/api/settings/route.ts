import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getUserProfileById, resetPassword } from "@/utils/db"

/**
 * Account Settings Data API Route
 *
 * Retrieves user profile for display
 *
 * @param request - Next.js request object with auth cookie
 *
 * @returns User profile data or error message
 */
export async function GET(request: NextRequest) {
  try {
    // Verify user authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get user profile data
    const user = await getUserProfileById(session?.user.id as string)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user's CV analysis history
    // const analyses = await getUserAnalyses(session.userId, 10) // Get last 10 analyses

    // Return dashboard data
    return NextResponse.json(user)
    // analyses: analyses.map((analysis) => ({
    //   id: analysis.id,
    //   job_role: analysis.job_role,
    //   overall_score: analysis.overall_score,
    //   match_percentage: analysis.match_percentage,
    //   created_at: analysis.created_at,
    //   analysis_results: analysis.analysis_results,
    // })),
  } catch (error) {
    // console.error("Dashboard data error:", error)
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 })
  }
}

/**
 * Update user password API route
 *
 *
 * @param request - Next.js request object
 *
 * @returns Updated user profile or error message
 */
export async function PUT(request: NextRequest) {
  try {
    // Verify user authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Parse request body
    const { currentPassword, newPassword } = await request.json()

    // Validate input (basic example, expand as needed)
    if (currentPassword && typeof currentPassword !== "string" || newPassword && typeof newPassword !== "string") {
      return NextResponse.json({ error: "Invalid password format" }, { status: 400 })
    }

    // Update user password in database
    const updatedUser = await resetPassword(
      session.user.id as string,
      currentPassword,
      newPassword,
    )

    // Return updated profile
    return NextResponse.json(updatedUser)
  } catch (error) {
    // console.error("Update profile error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}