import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/module/layout/sidebar/app-sidebar";

import Header from "@/module/layout/header/Header";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <Header />
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
