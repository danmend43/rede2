import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  // Verify state to prevent CSRF attacks
  const storedState = typeof window !== "undefined" ? localStorage.getItem("spotify_auth_state") : null

  if (!code) {
    // Redirect back to the profile page with an error
    return NextResponse.redirect(`${new URL(request.url).origin}?spotify_error=no_code`)
  }

  try {
    // Exchange the code for an access token
    const clientId = "384115184ce848c1bf39bdd8d0209f83"
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
    const redirectUri = `${new URL(request.url).origin}/api/spotify/callback`

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
      console.error("Token exchange failed:", await tokenResponse.text())
      return NextResponse.redirect(`${new URL(request.url).origin}?spotify_error=token_exchange_failed`)
    }

    const tokenData = await tokenResponse.json()

    // Redirect back to the profile page with the tokens as query parameters
    return NextResponse.redirect(
      `${new URL(request.url).origin}?access_token=${tokenData.access_token}&refresh_token=${tokenData.refresh_token}`,
    )
  } catch (error) {
    console.error("Error in Spotify callback:", error)
    return NextResponse.redirect(`${new URL(request.url).origin}?spotify_error=server_error`)
  }
}
