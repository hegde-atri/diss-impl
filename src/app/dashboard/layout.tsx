"use client"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";
export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
  const path = usePathname();
  var currentPage = "Dashboard";
  // use a if else, to match path and set currentPage to the correct page
  if (path === "/dashboard/pairing") {
    currentPage = "Pairing";
  } else if (path === "/dashboard/tele") {
    currentPage = "Teleoperation";
  } else if (path === "/dashboard/topic") {
    currentPage = "Topic Visualisation";
  } else if (path === "/dashboard/terminal") {
    currentPage = "Terminal";
  }

	return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentPage}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="container mx-auto px-4 mt-4">
        {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
	);
}
