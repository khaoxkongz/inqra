import { createFileRoute, Outlet } from "@tanstack/react-router";
import * as React from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@inqra/ui/components/sidebar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app")({
  component: RouteComponent,
});

function RouteComponent() {
  const [open, setOpen] = React.useState(true);

  return (
    <SidebarProvider
      open={open}
      onOpenChange={setOpen}
      className={cn(
        "**:data-[slot=sidebar-inner]:bg-transparent",
        "bg-radial-[96.4%_96.4%_at_8.25%_10.94%] from-[#FFFFFF] from-0% via-[#F0FFF7] via-[67.53%] to-[#DAF5EA] to-100%"
      )}
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-mobile": "18rem",
          "--sidebar-width-icon": "4rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="sidebar" collapsible="icon" />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
