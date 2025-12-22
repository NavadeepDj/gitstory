import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("gitstory_token")?.value;

  if (!token) {
    return NextResponse.json({ user: null, authenticated: false });
  }

  try {
    // Fetch user info from GitHub
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      // Token is invalid or expired
      return NextResponse.json({ user: null, authenticated: false });
    }

    const user = await response.json();

    return NextResponse.json({
      user: {
        login: user.login,
        avatar_url: user.avatar_url,
        name: user.name,
        id: user.id,
      },
      authenticated: true,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ user: null, authenticated: false });
  }
}
