"use client";

import { Collapsible, Sidebar } from "@/shared/components";
import { ChevronRight } from "lucide-react";
import type { AppAbility } from "./ability";
import type { NavItem, Permission } from "./sidebar-data";
import { NavBadge } from "./nav-badge";

interface NavMainProps {
  items: NavItem[];
  ability: AppAbility;
  activeItemId: string | null;
  activeSubItemId: string | null;
  onItemClick: (id: string) => void;
  onSubItemClick: (subId: string, parentId: string) => void;
}

function canView(ability: AppAbility, permission?: Permission): boolean {
  if (!permission) return true;
  return ability.can(permission.action, permission.subject);
}

export function NavMain({
  items,
  ability,
  activeItemId,
  activeSubItemId,
  onItemClick,
  onSubItemClick,
}: NavMainProps) {
  return (
    <Sidebar.Group>
      <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
      <Sidebar.Menu>
        {items
          .filter((item) => canView(ability, item.permission))
          .map((item) => {
            const isActive = activeItemId === item.id;

            return (
              <Collapsible
                key={item.id}
                asChild
                defaultOpen={isActive}
                className="group/collapsible"
              >
                <Sidebar.MenuItem>
                  <Collapsible.Trigger asChild>
                    <Sidebar.MenuButton
                      tooltip={item.title}
                      onClick={() => onItemClick(item.id)}
                      className={
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : undefined
                      }
                    >
                      {item.icon && <item.icon />}

                      <span className="flex-1">{item.title}</span>

                      {item.status && <NavBadge status={item.status} />}

                      <ChevronRight className="ml-1 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </Sidebar.MenuButton>
                  </Collapsible.Trigger>

                  {item.items && item.items.length > 0 && (
                    <Collapsible.Content>
                      <Sidebar.MenuSub>
                        {item.items
                          .filter((sub) => canView(ability, sub.permission))
                          .map((sub) => {
                            const isSubActive = activeSubItemId === sub.id;

                            return (
                              <Sidebar.MenuSubItem key={sub.id}>
                                <Sidebar.MenuSubButton asChild>
                                  <a
                                    href={sub.url}
                                    onClick={() =>
                                      onSubItemClick(sub.id, item.id)
                                    }
                                    className={
                                      isSubActive
                                        ? "text-sidebar-accent-foreground"
                                        : undefined
                                    }
                                  >
                                    <span className="flex-1">{sub.title}</span>
                                    {sub.status && (
                                      <NavBadge status={sub.status} />
                                    )}
                                  </a>
                                </Sidebar.MenuSubButton>
                              </Sidebar.MenuSubItem>
                            );
                          })}
                      </Sidebar.MenuSub>
                    </Collapsible.Content>
                  )}
                </Sidebar.MenuItem>
              </Collapsible>
            );
          })}
      </Sidebar.Menu>
    </Sidebar.Group>
  );
}
