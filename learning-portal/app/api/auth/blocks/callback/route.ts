import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { blocksClient } from "@/lib/blocks"
import {
  decodeJwtPayload,
  extractRoles,
  isLeadershipRole,
  resolveUserBlocksRole,
} from "@/lib/blocks-auth"
import { memoryStore } from "@/lib/prisma"
import { setSessionCookies } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, state, error, error_description } = body

    if (error) {
      return NextResponse.json(
        { error: error_description || error },
        { status: 400 }
      )
    }

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code missing from callback" },
        { status: 400 }
      )
    }

    // Call Blocks IAM callback on server (avoiding CORS issues)
    let callbackResponse: unknown = null
    try {
      callbackResponse = await blocksClient.auth.idp.callback({
        code,
        state,
      })
    } catch (cbErr) {
      console.warn("Blocks callback failed:", cbErr)
    }

    const cbData = callbackResponse as Record<string, unknown> | null
    const userObj = ((cbData?.user || {}) as Record<string, unknown>)

    // Decode tokens if returned in standard OIDC response
    const idToken = (cbData?.id_token || cbData?.idToken) as string | undefined
    const accessToken = (cbData?.access_token || cbData?.accessToken) as string | undefined
    const idClaims = decodeJwtPayload(idToken) || {}
    const accessClaims = decodeJwtPayload(accessToken) || {}

    const userEmail = (
      idClaims.email ||
      accessClaims.email ||
      userObj.email ||
      cbData?.email ||
      ""
    ) as string

    if (!userEmail) {
      return NextResponse.json(
        { error: "Blocks sign-in did not return an email address." },
        { status: 401 }
      )
    }

    const userName = (
      idClaims.name ||
      idClaims.preferred_username ||
      accessClaims.name ||
      userObj.name ||
      cbData?.name ||
      "SELISE Blocks User"
    ) as string

    const userId = (
      idClaims.sub ||
      accessClaims.sub ||
      userObj.id ||
      cbData?.id ||
      `blocks-user-${Date.now()}`
    ) as string

    // Extract all candidate roles
    const candidateRoles: unknown[] = [
      cbData?.roles,
      cbData?.role,
      userObj.roles,
      userObj.role,
      idClaims.roles,
      idClaims.role,
      (idClaims.realm_access as Record<string, unknown>)?.roles,
      accessClaims.roles,
      accessClaims.role,
      (accessClaims.realm_access as Record<string, unknown>)?.roles,
    ]

    const extractedRoles: string[] = []
    for (const cand of candidateRoles) {
      if (cand) extractedRoles.push(...extractRoles(cand))
    }

    // Check with live Blocks CLI synchronization as well
    const blocksSyncedRole = await resolveUserBlocksRole(userEmail)

    const isHead =
      blocksSyncedRole === "UNIT_HEAD" ||
      isLeadershipRole(extractedRoles, userEmail)

    const role = isHead ? "UNIT_HEAD" : "LEARNER"
    const discipline = isHead ? "Leadership & Strategy" : "Cloud Systems Engineer"
    const avatar = userName.split(" ").map((s) => s[0]).join("").toUpperCase().slice(0, 2) || (isHead ? "UH" : "SB")

    // Update memoryStore cache
    memoryStore.userRoles.set(userEmail.toLowerCase(), role)
    memoryStore.userRoles.set(userId, role)

    // Set authenticated portal cookies
    setSessionCookies(await cookies(), { id: userId, name: userName, email: userEmail.toLowerCase(), role, discipline, avatar })

    return NextResponse.json({
      ok: true,
      callbackResponse,
      user: {
        role,
        name: userName,
        email: userEmail,
        discipline,
        avatar,
      },
    })
  } catch (err: unknown) {
    console.error("Server-side Blocks callback handler error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Callback processing failed" },
      { status: 500 }
    )
  }
}
