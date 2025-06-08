import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")

  // Se o usuário negou o acesso
  if (error === "access_denied") {
    return NextResponse.redirect(new URL("/?spotify_error=access_denied", request.url))
  }

  // Se não há código de autorização
  if (!code) {
    return NextResponse.redirect(new URL("/?spotify_error=no_code", request.url))
  }

  try {
    // Trocar código por token
    const clientId = "384115184ce848c1bf39bdd8d0209f83"
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
    const redirectUri = `${request.nextUrl.origin}/api/spotify/callback`

    if (!clientSecret) {
      console.error("SPOTIFY_CLIENT_SECRET não configurado")
      return NextResponse.redirect(new URL("/?spotify_error=server_error", request.url))
    }

    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    })

    if (!tokenResponse.ok) {
      console.error("Erro ao trocar código por token:", tokenResponse.status)
      return NextResponse.redirect(new URL("/?spotify_error=token_exchange_failed", request.url))
    }

    const tokenData = await tokenResponse.json()

    // Redirecionar de volta para a página principal com o token
    const redirectUrl = new URL("/", request.url)
    redirectUrl.searchParams.set("access_token", tokenData.access_token)
    if (tokenData.refresh_token) {
      redirectUrl.searchParams.set("refresh_token", tokenData.refresh_token)
    }

    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error("Erro no callback do Spotify:", error)
    return NextResponse.redirect(new URL("/?spotify_error=server_error", request.url))
  }
}
