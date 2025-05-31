import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { refresh_token } = await request.json()

    if (!refresh_token) {
      return NextResponse.json({ error: "Refresh token é obrigatório" }, { status: 400 })
    }

    const clientId = "384115184ce848c1bf39bdd8d0209f83"
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

    if (!clientSecret) {
      console.error("SPOTIFY_CLIENT_SECRET não configurado")
      return NextResponse.json({ error: "Configuração do servidor inválida" }, { status: 500 })
    }

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
      }),
    })

    if (!response.ok) {
      console.error("Erro ao renovar token:", response.status)
      return NextResponse.json({ error: "Falha ao renovar token" }, { status: response.status })
    }

    const data = await response.json()

    return NextResponse.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token || refresh_token,
      expires_in: data.expires_in,
    })
  } catch (error) {
    console.error("Erro ao renovar token do Spotify:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
