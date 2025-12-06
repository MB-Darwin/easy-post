// src/app/page.tsx
import { redirect } from "next/navigation";

export default function RootPage() {
  // Hard redirect to your dashboard
  redirect("/en/dashboard");
}