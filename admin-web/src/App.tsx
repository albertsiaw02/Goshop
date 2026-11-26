import * as React from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { OrdersSection } from "@/components/orders-section"
import { OverviewSection } from "@/components/overview-section"
import { PlaceholderSection } from "@/components/placeholder-section"
import { SalesSection } from "@/components/sales-section"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getSectionFromHash, type Section } from "@/lib/sections"

export function App() {
  const [activeSection, setActiveSection] = React.useState<Section>(() =>
    getSectionFromHash(window.location.hash)
  )

  React.useEffect(() => {
    const handleHashChange = () =>
      setActiveSection(getSectionFromHash(window.location.hash))

    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar activeSection={activeSection} />
      <SidebarInset>
        <SiteHeader />
        <main className="@container/main flex min-h-0 flex-1 flex-col gap-6 py-6">
          {activeSection === "overview" && <OverviewSection />}
          {activeSection === "orders" && <OrdersSection />}
          {activeSection === "sales" && <SalesSection />}
          {activeSection === "inventory" && (
            <PlaceholderSection
              title="Inventory"
              description="Monitor stock levels and low-stock alerts."
            />
          )}
          {activeSection === "products" && (
            <PlaceholderSection
              title="Products"
              description="Browse and maintain the GoShop catalog."
            />
          )}
          {activeSection === "users" && (
            <PlaceholderSection
              title="Users"
              description="Manage customers and store administrators."
            />
          )}
          {activeSection === "reports" && (
            <PlaceholderSection
              title="Reports"
              description="Review sales, order, and inventory reports."
            />
          )}
          {activeSection === "settings" && (
            <PlaceholderSection
              title="Settings"
              description="Configure GoShop store preferences."
            />
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
