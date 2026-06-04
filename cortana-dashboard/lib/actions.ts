"use server";

import { redirect } from "next/navigation";
import { clearAuthCookie, passwordsMatch, setAuthCookie } from "@/lib/auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(_state: LoginState, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/dashboard");

  if (!process.env.CORTANA_DASHBOARD_PASSWORD) {
    return { error: "Dashboard password is not configured on the server." };
  }

  if (!passwordsMatch(password)) {
    return { error: "Access denied." };
  }

  await setAuthCookie();
  redirect(nextPath.startsWith("/") ? nextPath : "/dashboard");
}

export async function logoutAction() {
  await clearAuthCookie();
  redirect("/login");
}
