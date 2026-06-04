"use client";

import { useActionState } from "react";
import { LockKeyhole } from "lucide-react";
import { loginAction, type LoginState } from "@/lib/actions";

const initialState: LoginState = {};

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={nextPath} />
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-200">
          Dashboard password
        </span>
        <input
          autoFocus
          name="password"
          type="password"
          autoComplete="current-password"
          className="h-12 w-full rounded-2xl border border-white/15 bg-black/25 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-aurora/70 focus:ring-4 focus:ring-aurora/10"
          placeholder="Enter password"
          required
        />
      </label>
      {state.error ? (
        <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-semibold text-void shadow-cyan transition hover:bg-aurora disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LockKeyhole className="h-4 w-4" />
        {pending ? "Opening..." : "Enter Dashboard"}
      </button>
    </form>
  );
}
