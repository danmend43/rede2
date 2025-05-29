import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")

  // Se houve erro na autorização
  if (error) {
    console.error("Spotify authorization error:", error)
    return NextResponse.redirect(new URL("/?spotify_error=access_denied", request.url))
  }

  // Se não há código, redireciona com erro
  if (!code) {
    console.error("No authorization code received")
    return NextResponse.redirect(new URL("/?spotify_error=no_code", request.url))
  }

  try {
    // Configurações do Spotify
    const clientId = "384115184ce848c1bf39bdd8d0209f83"
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || "your_client_secret_here"
    const redirectUri = `${request.nextUrl.origin}/api/spotify/callback`

    // Troca o código por um token de acesso
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error("Token exchange failed:", errorData)
      return NextResponse.redirect(new URL("/?spotify_error=token_exchange_failed", request.url))
    }

    const tokenData = await tokenResponse.json()

    // Redireciona de volta para a página principal com o token
    const redirectUrl = new URL("/profile", request.url)
    redirectUrl.searchParams.set("access_token", tokenData.access_token)

    if (tokenData.refresh_token) {
      redirectUrl.searchParams.set("refresh_token", tokenData.refresh_token)
    }

    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error("Spotify callback error:", error)
    return NextResponse.redirect(new URL("/?spotify_error=server_error", request.url))
  }
}
