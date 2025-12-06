"use client";

import {
  AudioWaveform,
  BookOpen,
  Command,
  FileText,
  GalleryVerticalEnd,
  LayoutDashboard,
  LucideIcon,
  Settings,
  BookMarked,
  Code,
  Newspaper,
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
      id: "console",
      title: "Console",
      url: "/console",
      icon: LayoutDashboard,
      permission: { action: "view", subject: "Console" },
      items: [
        {
          id: "console-overview",
          title: "Overview",
          url: "/console",
        },
        {
          id: "console-analytics",
          title: "Analytics",
          url: "/console/analytics",
          status: "new",
        },
        {
          id: "console-reports",
          title: "Reports",
          url: "/console/reports",
        },
        {
          id: "console-notifications",
          title: "Notifications",
          url: "/console/notifications",
          status: "updated",
        },
      ],
    },
    {
      id: "posts",
      title: "Posts",
      url: "/posts",
      icon: FileText,
      permission: { action: "view", subject: "Posts" },
      items: [
        {
          id: "posts-all",
          title: "All Posts",
          url: "/posts",
        },
        {
          id: "posts-create",
          title: "Create New",
          url: "/posts/create",
        },
        {
          id: "posts-drafts",
          title: "Drafts",
          url: "/posts/drafts",
          status: "warning",
        },
        {
          id: "posts-categories",
          title: "Categories",
          url: "/posts/categories",
        },
        {
          id: "posts-tags",
          title: "Tags",
          url: "/posts/tags",
        },
        {
          id: "posts-comments",
          title: "Comments",
          url: "/posts/comments",
          status: "new",
        },
      ],
    },
    {
      id: "settings",
      title: "Settings",
      url: "/settings",
      icon: Settings,
      permission: { action: "view", subject: "Settings" },
      items: [
        {
          id: "settings-general",
          title: "General",
          url: "/settings",
        },
        {
          id: "settings-profile",
          title: "Profile",
          url: "/settings/profile",
        },
        {
          id: "settings-team",
          title: "Team",
          url: "/settings/team",
        },
        {
          id: "settings-billing",
          title: "Billing",
          url: "/settings/billing",
          status: "error",
        },
        {
          id: "settings-security",
          title: "Security",
          url: "/settings/security",
        },
        {
          id: "settings-appearance",
          title: "Appearance",
          url: "/settings/appearance",
        },
        {
          id: "settings-integrations",
          title: "Integrations",
          url: "/settings/integrations",
          status: "new",
        },
      ],
    },
    {
      id: "documentation",
      title: "Documentation",
      url: "/docs",
      icon: BookOpen,
      permission: { action: "view", subject: "Documentation" },
      items: [
        {
          id: "docs-intro",
          title: "Introduction",
          url: "/docs",
        },
        {
          id: "docs-getting-started",
          title: "Getting Started",
          url: "/docs/getting-started",
        },
        {
          id: "docs-guides",
          title: "Guides",
          url: "/docs/guides",
        },
        {
          id: "docs-api",
          title: "API Reference",
          url: "/docs/api",
          status: "updated",
        },
        {
          id: "docs-examples",
          title: "Examples",
          url: "/docs/examples",
        },
        {
          id: "docs-changelog",
          title: "Changelog",
          url: "/docs/changelog",
          status: "new",
        },
        {
          id: "docs-faq",
          title: "FAQ",
          url: "/docs/faq",
        },
      ],
    },
  ],
  projects: [
    {
      id: "proj-blog",
      name: "Company Blog",
      url: "/projects/blog",
      icon: Newspaper,
      status: "updated",
      permission: { action: "view", subject: "Projects" },
    },
    {
      id: "proj-docs",
      name: "Documentation Site",
      url: "/projects/docs",
      icon: BookMarked,
      status: "new",
      permission: { action: "view", subject: "Projects" },
    },
    {
      id: "proj-api",
      name: "API Portal",
      url: "/projects/api",
      icon: Code,
      permission: { action: "view", subject: "Projects" },
    },
  ],
};
