import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url));

  // Clear the auth token cookie
  response.cookies.delete("gitstory_token");

  return response;
}

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });

  // Clear the auth token cookie
  response.cookies.delete("gitstory_token");

  return response;
}
