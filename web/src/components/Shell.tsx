"use client";

import { AuthButton } from "@/components/AuthButton";
import Link from "next/link";
import { motion } from "framer-motion";
import { Newspaper, Sparkles, User } from "lucide-react";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <motion.aside
        className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl glow"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-400/80 to-cyan-400/80" />
          <div className="font-semibold tracking-wide">NovaNews</div>
        </div>

        <nav className="space-y-1 text-sm">
          <NavItem href="/" icon={<Sparkles size={16} />} label="Feed" />
          <NavItem href="/news" icon={<Newspaper size={16} />} label="Global News" />
          <NavItem href="/me" icon={<User size={16} />} label="Profile" />
        </nav>

        <div className="mt-6 text-xs text-white/60">
          Futuristic UI foundation is live. Next: gesture interactions + feed cards.
        </div>
      </motion.aside>

      {/* Main */}
<div className="space-y-6">
  <div className="flex items-center justify-between">
    <div className="text-xs text-white/60">
      Signal-first news + creator posts. Auth now enabled.
    </div>

    <AuthButton />
  </div>

  {children}
</div>
    </div>
  );
}

function NavItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-xl px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white transition"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}