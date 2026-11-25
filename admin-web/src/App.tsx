import { AppSidebar } from "@/components/app-sidebar"
import { RecentOrders } from "@/components/recent-orders"
import { SalesChart } from "@/components/sales-chart"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="@container/main flex min-h-0 flex-1 flex-col gap-6 py-6">
          <div className="flex flex-col gap-1 px-4 lg:px-6" id="overview">
            <p className="text-sm font-medium text-muted-foreground">
              GoShop operations
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Dashboard overview
            </h1>
            <p className="text-sm text-muted-foreground">
              A snapshot of store performance and recent orders.
            </p>
          </div>
          <SectionCards />
          <div className="px-4 lg:px-6" id="sales">
            <SalesChart />
          </div>
          <div className="px-4 lg:px-6" id="orders">
            <RecentOrders />
          </div>
          <p className="px-4 text-xs text-muted-foreground lg:px-6">
            Preview data only. Connect the GoShop API to display live store
            metrics.
          </p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
