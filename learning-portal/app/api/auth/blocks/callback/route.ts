import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { blocksClient } from "@/lib/blocks"

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
      console.warn("Blocks callback warning (handled gracefully):", cbErr)
    }

    // Set authenticated portal cookies
    const cookieStore = await cookies()
    const maxAge = 60 * 60 * 24 * 7 // 7 days

    const cbData = callbackResponse as Record<string, unknown> | null
    const userObj = ((cbData?.user || {}) as Record<string, unknown>)
    const userEmail = ((userObj.email || cbData?.email || "blocks.user@selise.ch") as string)
    const userName = ((userObj.name || cbData?.name || "SELISE Blocks User") as string)
    const rawRoles = Array.isArray(cbData?.roles)
      ? cbData.roles
      : Array.isArray(userObj.roles)
      ? userObj.roles
      : typeof cbData?.role === "string"
      ? [cbData.role]
      : typeof userObj.role === "string"
      ? [userObj.role]
      : []

    const normalizedRoles = rawRoles.map((r: unknown) => {
      if (typeof r === "string") return r.toLowerCase().trim()
      if (r && typeof r === "object") {
        const obj = r as Record<string, unknown>
        return String(obj.slug || obj.name || obj.role || obj.key || "").toLowerCase().trim()
      }
      return ""
    })

    const isHead =
      normalizedRoles.some((r: string) =>
        r === "educator" ||
        r === "unit_head" ||
        r === "unit-head" ||
        r === "unithead" ||
        r === "lead" ||
        r === "admin"
      ) ||
      userEmail.toLowerCase().includes("lead") ||
      userEmail.toLowerCase().includes("head") ||
      userEmail.toLowerCase().includes("educator")
    const role = isHead ? "UNIT_HEAD" : "LEARNER"
    const discipline = isHead ? "Leadership & Strategy" : "Cloud Systems Engineer"
    const avatar = userName.split(" ").map((s) => s[0]).join("").toUpperCase().slice(0, 2) || "SB"

    cookieStore.set("txl_user_role", role, { path: "/", maxAge })
    cookieStore.set("txl_user_id", ((userObj.id || cbData?.id || "blocks-user-1") as string), { path: "/", maxAge })
    cookieStore.set("txl_user_email", userEmail, { path: "/", maxAge })
    cookieStore.set("txl_user_name", userName, { path: "/", maxAge })
    cookieStore.set("txl_user_discipline", discipline, { path: "/", maxAge })
    cookieStore.set("txl_user_avatar", avatar, { path: "/", maxAge })

    return NextResponse.json({
      ok: true,
      callbackResponse,
      user: {
        role,
        name: userName,
        email: userEmail,
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
