"use client";

import type { NavStatus } from "./sidebar-data";

const badgeStyles: Record<NavStatus, string> = {
  new: "bg-blue-500/15 text-blue-500",
  updated: "bg-green-500/15 text-green-500",
  warning: "bg-yellow-500/15 text-yellow-500",
  error: "bg-red-500/15 text-red-500",
  deprecated: "bg-red-500/10 text-red-400",
};

interface NavBadgeProps {
  status: NavStatus;
}

export function NavBadge({ status }: NavBadgeProps) {
  return (
    <span
      className={
        "ml-2 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium capitalize " +
        badgeStyles[status]
      }
    >
      {status}
    </span>
  );
}
