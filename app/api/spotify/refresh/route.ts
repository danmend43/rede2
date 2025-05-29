import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { refresh_token } = await request.json()

    if (!refresh_token) {
      return NextResponse.json({ error: "Refresh token is required" }, { status: 400 })
    }

    // Configurações do Spotify
    const clientId = "384115184ce848c1bf39bdd8d0209f83"
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

    if (!clientSecret) {
      return NextResponse.json({ error: "Spotify client secret not configured" }, { status: 500 })
    }

    // Renovar o token de acesso
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error("Token refresh failed:", errorData)
      return NextResponse.json({ error: "Failed to refresh token" }, { status: 400 })
    }

    const tokenData = await tokenResponse.json()

    return NextResponse.json({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token || refresh_token, // Spotify pode ou não retornar um novo refresh token
      expires_in: tokenData.expires_in,
    })
  } catch (error) {
    console.error("Spotify refresh error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
