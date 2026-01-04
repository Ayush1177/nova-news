"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButton() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <button className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/80">
        Loading…
      </button>
    );
  }

  if (status === "authenticated") {
    return (
      <button
        onClick={() => signOut()}
        className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/85 hover:bg-white/10"
      >
        Sign out
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn("github")}
      className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-black hover:opacity-90"
    >
      Sign in
    </button>
  );
}