import { NextRequest, NextResponse } from "next/server";

// This route redirects to the opengraph-image for the user
// Usage: /og/username or /og?u=username
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const username =
    searchParams.get("u") ||
    searchParams.get("user") ||
    searchParams.get("username");

  if (!username) {
    return new NextResponse("Missing username parameter. Use ?u=username", {
      status: 400,
    });
  }

  // Redirect to the opengraph-image route
  return NextResponse.redirect(
    new URL(`/${username}/opengraph-image`, request.url)
  );
}
