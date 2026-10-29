import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { blocksClient } from "@/lib/blocks"
import { hashPassword, setSessionCookies, type UserRole } from "@/lib/auth"
import { resolveUserBlocksRole } from "@/lib/blocks-auth"
import { memoryStore } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      password,
      firstName,
      lastName,
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

    // An existing account can't be re-registered (that would overwrite its password)
    if (memoryStore.users.has(cleanEmail)) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in." },
        { status: 409 }
      )
    }

    // Skipping Blocks is a local-dev/test convenience only; in production every account must be
    // created in Blocks IAM, so a client-supplied viaBlocks=false is ignored.
    const skipBlocks = viaBlocks === false && process.env.NODE_ENV !== "production"

    let blocksResult: unknown = null
    if (!skipBlocks) {
      try {
        blocksResult = await blocksClient.auth.signup({
          email: cleanEmail,
          password,
          firstName: firstName || "Learner",
          lastName: lastName || "User",
        })
      } catch (err: unknown) {
        // Never fall back to a local-only account: that would let an email that Blocks rejected
        // (already registered, deactivated, invalid) log in anyway.
        console.error("Blocks IAM signup failed:", err)
        const message = err instanceof Error ? err.message : String(err)
        if (/exist|already|duplicate|taken/i.test(message)) {
          return NextResponse.json(
            { error: "An account with this email already exists. Please sign in." },
            { status: 409 }
          )
        }
        return NextResponse.json(
          { error: "We couldn't create your account. Please try again or contact your administrator." },
          { status: 502 }
        )
      }
    }

    // Set authenticated portal cookies
    // The requested role is never trusted: Blocks IAM decides who is a Unit Head
    const role: UserRole = await resolveUserBlocksRole(cleanEmail)
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
      role,
      discipline,
      avatar: initials,
    })
    memoryStore.userRoles.set(cleanEmail, role)

    setSessionCookies(await cookies(), {
      id: resolvedUserId,
      name: fullName,
      email: cleanEmail,
      role,
      discipline: role === "UNIT_HEAD" ? "Leadership & Strategy" : discipline,
      avatar: initials,
    })

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
