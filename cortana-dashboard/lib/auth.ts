import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import "server-only";

export const AUTH_COOKIE = "cortana_session";

export function getSessionSignature(password: string) {
  return createHmac("sha256", password)
    .update("cosmic-cortana-dashboard")
    .digest("hex");
}

export async function setAuthCookie() {
  const password = process.env.CORTANA_DASHBOARD_PASSWORD;

  if (!password) {
    throw new Error("CORTANA_DASHBOARD_PASSWORD is not configured.");
  }

  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE, getSessionSignature(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}

export function passwordsMatch(candidate: string) {
  const password = process.env.CORTANA_DASHBOARD_PASSWORD;

  if (!password || !candidate) {
    return false;
  }

  const expected = Buffer.from(password);
  const received = Buffer.from(candidate);

  if (expected.length !== received.length) {
    return false;
  }

  return timingSafeEqual(expected, received);
}
