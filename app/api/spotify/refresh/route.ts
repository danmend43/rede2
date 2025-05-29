import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refresh_token } = body

    if (!refresh_token) {
      return NextResponse.json({ error: "Refresh token is required" }, { status: 400 })
    }

    const clientId = "384115184ce848c1bf39bdd8d0209f83"
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

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
      console.error("Token refresh failed:", await response.text())
      return NextResponse.json({ error: "Failed to refresh token" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error refreshing token:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
