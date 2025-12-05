"use client";

import * as React from "react";
import { Sidebar } from "@/shared/components";
import { TeamSwitcher } from "./team-switcher";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { sidebarData } from "./sidebar-data";
import { defineAbilityFor } from "./ability";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const ability = React.useMemo(() => defineAbilityFor(sidebarData.user), []);

  const [activeItemId, setActiveItemId] = React.useState<string | null>(null);
  const [activeSubItemId, setActiveSubItemId] = React.useState<string | null>(
    null
  );
  const [activeProjectId, setActiveProjectId] = React.useState<string | null>(
    null
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <Sidebar.Header>
        <TeamSwitcher teams={sidebarData.teams} />
      </Sidebar.Header>

      <Sidebar.Content>
        <NavMain
          items={sidebarData.navMain}
          ability={ability}
          activeItemId={activeItemId}
          activeSubItemId={activeSubItemId}
          onItemClick={setActiveItemId}
          onSubItemClick={(subId, parentId) => {
            setActiveItemId(parentId);
            setActiveSubItemId(subId);
          }}
        />

        <NavProjects
          projects={sidebarData.projects}
          ability={ability}
          activeProjectId={activeProjectId}
          onProjectClick={setActiveProjectId}
        />
      </Sidebar.Content>

      <Sidebar.Footer>
        <NavUser user={sidebarData.user} />
      </Sidebar.Footer>

      <Sidebar.Rail />
    </Sidebar>
  );
}
