import { Shell } from "@/components/Shell";

export default function Home() {
  return (
    <Shell>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl glow">
        <div className="text-sm text-white/70">Welcome</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          NovaNews — Futuristic News + Blog Social
        </h1>
        <p className="mt-3 text-white/70">
          Next we will build the animated feed UI, post composer, and gestures.
          After that: authentication, database, and automatic global news.
        </p>
      </div>
    </Shell>
  );
}