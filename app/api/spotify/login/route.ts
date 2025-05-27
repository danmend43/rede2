import { NextResponse } from "next/server"

export async function GET() {
  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-top-read",
    "user-read-recently-played",
    "user-read-currently-playing",
    "user-read-playback-state",
    "playlist-read-private",
  ].join(" ")

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    scope: scopes,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/spotify/callback`,
    state: Math.random().toString(36).substring(7),
  })

  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${params.toString()}`

  return NextResponse.redirect(spotifyAuthUrl)
}
