import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "cortana_session";

async function createSignature(password: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode("cosmic-cortana-dashboard"),
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function isAuthenticated(request: NextRequest) {
  const password = process.env.CORTANA_DASHBOARD_PASSWORD;
  const session = request.cookies.get(AUTH_COOKIE)?.value;

  if (!password || !session) {
    return false;
  }

  return session === (await createSignature(password));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = await isAuthenticated(request);

  if (pathname.startsWith("/api/") && !authed) {
    return NextResponse.json({ reply: "Unauthorized." }, { status: 401 });
  }

  if (pathname === "/login" && authed) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!authed && pathname !== "/login") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|icons).*)"],
};
