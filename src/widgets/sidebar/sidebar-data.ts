"use client";

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  LucideIcon,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import type { AppUser, Actions, Subjects } from "./ability";

export type NavBadge = "new" | "deprecated" | "error" | "updated" | "warning";

export interface NavPermission {
  action: Actions;
  subject: Subjects;
}

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  permission?: NavPermission;
  badge?: NavBadge;
}

export interface NavItem {
  id: string;
  title: string;
  url?: string;
  icon?: LucideIcon;
  permission?: NavPermission;
  badge?: NavBadge;
  items?: NavSubItem[];
}

export interface ProjectNavItem {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon;
  permission?: NavPermission;
  badge?: NavBadge;
}

export interface SidebarData {
  user: AppUser;
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
  navMain: NavItem[];
  projects: ProjectNavItem[];
}

export const sidebarData: SidebarData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
    role: "editor",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      id: "playground",
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      badge: "new",
      permission: { action: "view", subject: "Playground" },
      items: [
        {
          id: "playground-history",
          title: "History",
          url: "#",
          badge: "updated",
        },
        {
          id: "playground-starred",
          title: "Starred",
          url: "#",
        },
        {
          id: "playground-settings",
          title: "Settings",
          url: "#",
          badge: "warning",
        },
      ],
    },
    {
      id: "models",
      title: "Models",
      url: "#",
      icon: Bot,
      permission: { action: "view", subject: "Models" },
      items: [
        {
          id: "models-genesis",
          title: "Genesis",
          url: "#",
        },
        {
          id: "models-explorer",
          title: "Explorer",
          url: "#",
          badge: "new",
        },
        {
          id: "models-quantum",
          title: "Quantum",
          url: "#",
          badge: "deprecated",
        },
      ],
    },
    {
      id: "documentation",
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      permission: { action: "view", subject: "Documentation" },
      items: [
        { id: "docs-intro", title: "Introduction", url: "#" },
        { id: "docs-get-started", title: "Get Started", url: "#" },
        { id: "docs-tutorials", title: "Tutorials", url: "#" },
        {
          id: "docs-changelog",
          title: "Changelog",
          url: "#",
          badge: "updated",
        },
      ],
    },
    {
      id: "settings",
      title: "Settings",
      url: "#",
      icon: Settings2,
      permission: { action: "view", subject: "Settings" },
      items: [
        { id: "settings-general", title: "General", url: "#" },
        { id: "settings-team", title: "Team", url: "#" },
        {
          id: "settings-billing",
          title: "Billing",
          url: "#",
          badge: "error",
        },
        { id: "settings-limits", title: "Limits", url: "#" },
      ],
    },
  ],
  projects: [
    {
      id: "proj-design",
      name: "Design Engineering",
      url: "#",
      icon: Frame,
      permission: { action: "view", subject: "Project" },
      badge: "updated",
    },
    {
      id: "proj-sales",
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
      permission: { action: "view", subject: "Project" },
      badge: "new",
    },
    {
      id: "proj-travel",
      name: "Travel",
      url: "#",
      icon: Map,
      permission: { action: "view", subject: "Project" },
      badge: "warning",
    },
  ],
};
