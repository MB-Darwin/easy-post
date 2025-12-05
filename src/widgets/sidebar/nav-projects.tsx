"use client";

import { Folder, Forward, MoreHorizontal, Trash2 } from "lucide-react";
import type { AppAbility } from "./ability";
import type { ProjectItem, Permission } from "./sidebar-data";
import { NavBadge } from "./nav-badge";
import { DropdownMenu, Sidebar, useSidebar } from "@/shared/components";

interface NavProjectsProps {
  projects: ProjectItem[];
  ability: AppAbility;
  activeProjectId: string | null;
  onProjectClick: (id: string) => void;
}

function canView(ability: AppAbility, permission?: Permission): boolean {
  if (!permission) return true;
  return ability.can(permission.action, permission.subject);
}

export function NavProjects({
  projects,
  ability,
  activeProjectId,
  onProjectClick,
}: NavProjectsProps) {
  const { isMobile } = useSidebar();

  return (
    <Sidebar.Group className="group-data-[collapsible=icon]:hidden">
      <Sidebar.GroupLabel>Projects</Sidebar.GroupLabel>
      <Sidebar.Menu>
        {projects
          .filter((item) => canView(ability, item.permission))
          .map((item) => {
            const isActive = activeProjectId === item.id;

            return (
              <Sidebar.MenuItem key={item.id}>
                <Sidebar.MenuButton asChild>
                  <a
                    href={item.url}
                    onClick={() => onProjectClick(item.id)}
                    className={
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : undefined
                    }
                  >
                    <item.icon />
                    <span className="flex-1 truncate">{item.name}</span>
                    {item.status && <NavBadge status={item.status} />}
                  </a>
                </Sidebar.MenuButton>

                <DropdownMenu>
                  <DropdownMenu.Trigger asChild>
                    <Sidebar.MenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </Sidebar.MenuAction>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content
                    className="w-48 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenu.Item>
                      <Folder className="text-muted-foreground" />
                      <span>View Project</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item>
                      <Forward className="text-muted-foreground" />
                      <span>Share Project</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item>
                      <Trash2 className="text-muted-foreground" />
                      <span>Delete Project</span>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu>
              </Sidebar.MenuItem>
            );
          })}

        <Sidebar.MenuItem>
          <Sidebar.MenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Group>
  );
}
