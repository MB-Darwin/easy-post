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
import type { AppUser, AppAction, AppSubject } from "./ability";

export type NavStatus = "new" | "deprecated" | "error" | "updated" | "warning";

export interface Permission {
  action: AppAction;
  subject: AppSubject;
}

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  status?: NavStatus;
  permission?: Permission;
}

export interface NavItem {
  id: string;
  title: string;
  url?: string;
  icon?: LucideIcon;
  status?: NavStatus;
  permission?: Permission;
  items?: NavSubItem[];
}

export interface ProjectItem {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon;
  status?: NavStatus;
  permission?: Permission;
}

export interface SidebarData {
  user: AppUser;
  teams: {
    name: string;
    logo: LucideIcon;
    plan: string;
  }[];
  navMain: NavItem[];
  projects: ProjectItem[];
}

// Sample data
export const sidebarData: SidebarData = {
  user: {
    id: "1",
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
      status: "new",
      permission: { action: "view", subject: "Playground" },
      items: [
        {
          id: "playground-history",
          title: "History",
          url: "#",
          status: "updated",
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
          status: "warning",
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
          status: "new",
        },
        {
          id: "models-quantum",
          title: "Quantum",
          url: "#",
          status: "deprecated",
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
          status: "updated",
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
          status: "error",
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
      status: "updated",
      permission: { action: "view", subject: "Projects" },
    },
    {
      id: "proj-sales",
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
      status: "new",
      permission: { action: "view", subject: "Projects" },
    },
    {
      id: "proj-travel",
      name: "Travel",
      url: "#",
      icon: Map,
      status: "warning",
      permission: { action: "view", subject: "Projects" },
    },
  ],
};
