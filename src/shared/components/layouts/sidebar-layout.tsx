"use client";

import { AppSidebar } from "@/widgets/sidebar";
import { Breadcrumb, Separator, Sidebar } from "../ui";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar.Provider>
      <AppSidebar />
      <Sidebar.Inset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar.-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <Sidebar.Trigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <Breadcrumb.List>
                <Breadcrumb.Item className="hidden md:block">
                  <Breadcrumb.Link href="#">
                    Building Your Application
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator className="hidden md:block" />
                <Breadcrumb.Item>
                  <Breadcrumb.Page>Data Fetching</Breadcrumb.Page>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </Sidebar.Inset>
    </Sidebar.Provider>
  );
}
