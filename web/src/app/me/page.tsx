import { Shell } from "@/components/Shell";

export default function MePage() {
  return (
    <Shell>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <h2 className="text-xl font-semibold">Profile</h2>
        <p className="mt-2 text-white/70 text-sm">
          This will become your user profile page after we add authentication.
        </p>
      </div>
    </Shell>
  );
}