import { Shell } from "@/components/Shell";

export default function NewsPage() {
  return (
    <Shell>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <h2 className="text-xl font-semibold">Global News</h2>
        <p className="mt-2 text-white/70 text-sm">
          This page will show automatically pulled news from an external API.
        </p>
      </div>
    </Shell>
  );
}