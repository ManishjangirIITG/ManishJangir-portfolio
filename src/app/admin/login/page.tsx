"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const isFilled = Boolean(email.trim() && password.trim());

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // if (!isFilled) return;
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const payload: unknown = await response.json().catch(() => null);
        const message =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof payload.error === "string"
            ? payload.error
            : "Unable to sign in.";
        setError(message);
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to reach the server.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-6 py-16">
      <section className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl">
        <p className="text-sm text-[var(--color-primary)]">Private administration</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          This area is restricted to authorized portfolio administrators.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm">
            <span className="mb-2 block text-[var(--color-muted)]">Email</span>
            <input
              autoComplete="username"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 outline-none focus:border-[var(--color-primary)]"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="block text-sm">
            <span className="mb-2 block text-[var(--color-muted)]">Password</span>
            <input
              autoComplete="current-password"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 outline-none focus:border-[var(--color-primary)]"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? (
            <p role="alert" className="text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <button
            className="w-full rounded-lg border border-white/10 bg-[color-mix(in_srgb,var(--color-primary),white_15%)] px-4 py-2.5 font-medium text-[var(--color-background)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary),white_25%)] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
