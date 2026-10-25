import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { blocksClient } from "@/lib/blocks"
import { hashPassword } from "@/lib/auth"
import { memoryStore } from "@/lib/prisma"

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

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    const cleanEmail = email.trim().toLowerCase()

    let blocksResult: unknown = null
    if (viaBlocks) {
      try {
        blocksResult = await blocksClient.auth.signup({
          email: cleanEmail,
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
    const fullName = `${firstName || ""} ${lastName || ""}`.trim() || cleanEmail.split("@")[0]
    const initials =
      fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "TX"

    const resolvedUserId = (blocksResult as { itemId?: string })?.itemId || `user-${Date.now()}`

    // Store user securely in local store for credential verification
    memoryStore.users.set(cleanEmail, {
      id: resolvedUserId,
      email: cleanEmail,
      passwordHash: hashPassword(password),
      name: fullName,
      role: role as "LEARNER" | "UNIT_HEAD",
      discipline,
      avatar: initials,
    })
    memoryStore.userRoles.set(cleanEmail, role as "LEARNER" | "UNIT_HEAD")

    cookieStore.set("txl_user_role", role, { path: "/", maxAge })
    cookieStore.set("txl_user_id", resolvedUserId, { path: "/", maxAge })
    cookieStore.set("txl_user_email", cleanEmail, { path: "/", maxAge })
    cookieStore.set("txl_user_name", fullName, { path: "/", maxAge })
    cookieStore.set("txl_user_discipline", discipline, { path: "/", maxAge })
    cookieStore.set("txl_user_avatar", initials, { path: "/", maxAge })

    return NextResponse.json({
      success: true,
      blocksResult,
      user: {
        id: resolvedUserId,
        email: cleanEmail,
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
