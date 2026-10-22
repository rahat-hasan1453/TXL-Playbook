import { NextRequest, NextResponse } from "next/server"
import { blocksClient } from "@/lib/blocks"

export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.origin
    const redirectUri = `${origin}/login/callback`

    const response = await blocksClient.auth.idp.initiate({
      redirectUri,
    })

    const targetUrl = response?.redirect_uri || (response as unknown as { redirectUri?: string })?.redirectUri

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
