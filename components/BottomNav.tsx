"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Trophy, BookOpen } from "lucide-react";

const tabs = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/gruppen", label: "Gruppen", icon: Users },
  { href: "/baum", label: "KO-Baum", icon: Trophy },
  { href: "/regeln", label: "Regeln", icon: BookOpen },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-doom-border bg-doom-card/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md justify-around px-1 py-1.5">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="focus-doom flex flex-col items-center gap-1 rounded-lg py-2 transition-colors"
              >
                <span
                  className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${
                    active ? "bg-doom-green/15" : ""
                  }`}
                >
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.5 : 2}
                    className={active ? "text-doom-green glow-green-text" : "text-doom-silver/55"}
                  />
                </span>
                <span
                  className={`font-display text-[11px] font-semibold uppercase tracking-wide ${
                    active ? "text-doom-green" : "text-doom-silver/55"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
