import "server-only";

import { cookies } from "next/headers";
import { AUTH_COOKIE, getSessionSignature } from "@/lib/auth";

export async function isDashboardAuthenticated() {
  const password = process.env.CORTANA_DASHBOARD_PASSWORD;

  if (!password) {
    return false;
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(AUTH_COOKIE)?.value;

  return session === getSessionSignature(password);
}
