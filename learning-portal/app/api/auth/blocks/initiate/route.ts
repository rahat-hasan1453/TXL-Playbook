import { NextRequest, NextResponse } from "next/server"
import { blocksClient } from "@/lib/blocks"

export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.origin || "http://localhost:3000"
    // Prefer localhost:3000 or real origin if valid
    const redirectUri = `${origin}/login/callback`

    const response = (await blocksClient.auth.idp.initiate({
      redirectUri,
    })) as {
      redirect_uri?: string
      redirectUri?: string
      error?: string
      error_description?: string
    }

    if (response?.error) {
      return NextResponse.json(
        { error: response.error_description || response.error },
        { status: 400 }
      )
    }

    const targetUrl = response?.redirect_uri || response?.redirectUri

    if (!targetUrl) {
      // Fallback with localhost:3000 if origin differed
      const fallbackResponse = (await blocksClient.auth.idp.initiate({
        redirectUri: "http://localhost:3000/login/callback",
      })) as { redirect_uri?: string; redirectUri?: string }

      const fallbackUrl = fallbackResponse?.redirect_uri || fallbackResponse?.redirectUri
      if (fallbackUrl) {
        return NextResponse.json({ redirectUrl: fallbackUrl })
      }

      return NextResponse.json(
        { error: "Blocks IdP initiate did not return redirect_uri" },
        { status: 500 }
      )
    }

    return NextResponse.json({ redirectUrl: targetUrl })
  } catch (error: unknown) {
    console.error("Blocks initiate error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to initiate Blocks login" },
      { status: 500 }
    )
  }
}
