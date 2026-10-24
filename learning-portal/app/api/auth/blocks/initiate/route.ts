import { NextRequest, NextResponse } from "next/server"
import { blocksClient } from "@/lib/blocks"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientRedirectUri = searchParams.get("redirectUri")

    const forwardedHost = request.headers.get("x-forwarded-host")
    const forwardedProto = request.headers.get("x-forwarded-proto") || "https"
    const hostOrigin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : null

    const origin = hostOrigin || request.nextUrl.origin || "http://localhost:3000"
    const redirectUri = clientRedirectUri || `${origin}/login/callback`

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
