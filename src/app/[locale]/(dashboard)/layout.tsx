import { SidebarLayout } from "@/shared/components/layouts";
import React from "react";

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
