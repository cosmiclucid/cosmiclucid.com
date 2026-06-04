import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <section className="glass luxury-ring w-full max-w-md rounded-[28px] p-6 sm:p-8">
        <div className="mb-8">
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-glow">
            <span className="text-lg font-semibold text-white">CC</span>
          </div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.34em] text-aurora">
            Private access
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            COSMIC CORTANA
          </h1>
          <p className="mt-3 text-sm leading-6 text-mist">
            Enter the dashboard password to open your cinematic AI operating system.
          </p>
        </div>
        <Suspense>
          <LoginForm nextPath={params.next ?? "/dashboard"} />
        </Suspense>
      </section>
    </main>
  );
}
