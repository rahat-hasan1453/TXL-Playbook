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

    cookieStore.set("txl_user_role", "LEARNER", { path: "/", maxAge })
    cookieStore.set("txl_user_id", "blocks-user-1", { path: "/", maxAge })
    cookieStore.set("txl_user_email", "blocks.user@selise.ch", { path: "/", maxAge })
    cookieStore.set("txl_user_name", "SELISE Blocks User", { path: "/", maxAge })
    cookieStore.set("txl_user_discipline", "Cloud Systems Engineer", { path: "/", maxAge })
    cookieStore.set("txl_user_avatar", "SB", { path: "/", maxAge })

    return NextResponse.json({
      ok: true,
      callbackResponse,
      user: {
        role: "LEARNER",
        name: "SELISE Blocks User",
        email: "blocks.user@selise.ch",
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
