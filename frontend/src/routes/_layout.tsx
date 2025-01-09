import { AppSideBar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSideBar />
      <main className="w-full">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
