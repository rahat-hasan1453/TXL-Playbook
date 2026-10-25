import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { blocksClient } from "@/lib/blocks"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      password,
      firstName,
      lastName,
      role = "LEARNER",
      discipline = "Product Engineer",
      viaBlocks = true,
    } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    let blocksResult: unknown = null
    if (viaBlocks) {
      try {
        blocksResult = await blocksClient.auth.signup({
          email,
          password,
          firstName: firstName || "Learner",
          lastName: lastName || "User",
        })
      } catch (err: unknown) {
        console.warn("Blocks IAM signup notice (handled):", err)
      }
    }

    // Set authenticated portal cookies
    const cookieStore = await cookies()
    const maxAge = 60 * 60 * 24 * 7 // 7 days
    const fullName = `${firstName || ""} ${lastName || ""}`.trim() || email.split("@")[0]
    const initials =
      fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "TX"

    const resolvedUserId = (blocksResult as { itemId?: string })?.itemId || `user-${Date.now()}`

    cookieStore.set("txl_user_role", role, { path: "/", maxAge })
    cookieStore.set("txl_user_id", resolvedUserId, { path: "/", maxAge })
    cookieStore.set("txl_user_email", email, { path: "/", maxAge })
    cookieStore.set("txl_user_name", fullName, { path: "/", maxAge })
    cookieStore.set("txl_user_discipline", discipline, { path: "/", maxAge })
    cookieStore.set("txl_user_avatar", initials, { path: "/", maxAge })

    return NextResponse.json({
      success: true,
      blocksResult,
      user: {
        id: resolvedUserId,
        email,
        name: fullName,
        role,
        discipline,
      },
    })
  } catch (error: unknown) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Signup failed" },
      { status: 500 }
    )
  }
}
