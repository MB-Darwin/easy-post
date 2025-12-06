"use client";

import type { NavBadge } from "./sidebar-data";

const badgeStyles: Record<NavBadge, string> = {
  // mapping can be adjusted to taste
  new: "bg-blue-500/15 text-blue-500",
  updated: "bg-green-500/15 text-green-500",
  warning: "bg-yellow-500/15 text-yellow-500",
  error: "bg-red-500/15 text-red-500",
  deprecated: "bg-slate-500/15 text-slate-400",
};

interface NavItemBadgeProps {
  status: NavBadge;
}

export function NavItemBadge({ status }: NavItemBadgeProps) {
  return (
    <span
      className={[
        "ml-2 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium capitalize",
        badgeStyles[status],
      ].join(" ")}
    >
      {status}
    </span>
  );
}
