import { createBlocksClient } from "@seliseblocks/client"
import { blocksConfig } from "@/lib/blocks"
import { decodeJwtPayload } from "@/lib/blocks-auth"

// Server-side Blocks identity: a dedicated service user whose credentials live in env vars.
// It backs portal storage (Data Gateway) and system emails, neither of which has a browser user.

export function serviceConfigured(): boolean {
  return Boolean(process.env.BLOCKS_SERVICE_EMAIL && process.env.BLOCKS_SERVICE_PASSWORD)
}

let token: { value: string; expiresAt: number } | null = null
let loginInFlight: Promise<string> | null = null

async function login(): Promise<string> {
  const authClient = createBlocksClient({
    apiUrl: blocksConfig.apiUrl,
    appDomain: blocksConfig.appDomain,
    xBlocksKey: blocksConfig.xBlocksKey,
  })
  const res = (await authClient.auth.login({
    username: process.env.BLOCKS_SERVICE_EMAIL!,
    password: process.env.BLOCKS_SERVICE_PASSWORD!,
  })) as Record<string, unknown>
  const access = (res.access_token || res.accessToken) as string | undefined
  if (!access) throw new Error("Blocks service login returned no access token")
  const exp = Number(decodeJwtPayload(access)?.exp) || 0
  token = { value: access, expiresAt: exp ? exp * 1000 - 60_000 : Date.now() + 10 * 60_000 }
  return access
}

async function getToken(): Promise<string> {
  if (token && Date.now() < token.expiresAt) return token.value
  loginInFlight ||= login().finally(() => {
    loginInFlight = null
  })
  return loginInFlight
}

export const serviceClient = createBlocksClient({
  apiUrl: blocksConfig.apiUrl,
  appDomain: blocksConfig.appDomain,
  xBlocksKey: blocksConfig.xBlocksKey,
  accessToken: getToken,
})
