import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(new URL("/?error=access_denied", request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url))
  }

  try {
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/spotify/callback`,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token")
    }

    const tokens = await tokenResponse.json()

    // Get user profile
    const profileResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    if (!profileResponse.ok) {
      throw new Error("Failed to get user profile")
    }

    const profile = await profileResponse.json()

    // In a real app, you'd store these tokens securely (database, encrypted cookies, etc.)
    // For this demo, we'll redirect with the data as URL params (not recommended for production)
    const userData = {
      id: profile.id,
      name: profile.display_name,
      email: profile.email,
      image: profile.images?.[0]?.url,
      followers: profile.followers?.total || 0,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    }

    const redirectUrl = new URL("/", request.url)
    redirectUrl.searchParams.set("spotify_data", Buffer.from(JSON.stringify(userData)).toString("base64"))

    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error("Spotify callback error:", error)
    return NextResponse.redirect(new URL("/?error=callback_failed", request.url))
  }
}
