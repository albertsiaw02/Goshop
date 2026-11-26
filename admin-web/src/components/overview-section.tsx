import { CalendarDaysIcon, PackageCheckIcon, SparklesIcon } from "lucide-react"

import { SalesChart } from "@/components/sales-chart"
import { SectionCards } from "@/components/section-cards"
import { RecentOrders } from "@/components/recent-orders"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function OverviewSection() {
  return (
    <div className="flex flex-col gap-6">
      <div
        className="flex flex-col gap-4 px-4 sm:flex-row sm:items-end sm:justify-between lg:px-6"
        id="overview"
      >
        <div className="flex flex-col gap-2">
          <Badge
            variant="secondary"
            className="w-fit gap-1.5 rounded-full px-2.5 py-1 font-medium"
          >
            <SparklesIcon className="size-3.5 text-primary" />
            Store performance
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight">
            Store overview
          </h2>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
        <Badge variant="outline" className="w-fit gap-2 px-3 py-1.5 font-normal">
          <CalendarDaysIcon className="size-4" />
          Today&apos;s snapshot
        </Badge>
      </div>

      <SectionCards />

      <div className="grid gap-4 px-4 lg:px-6 @5xl/main:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
        <SalesChart />
        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle>Order fulfillment</CardTitle>
              <p className="text-sm text-muted-foreground">
                Progress across today&apos;s orders
              </p>
            </div>
            <Badge variant="outline" className="font-normal">
              128 total
            </Badge>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Delivered</span>
                <span className="font-medium tabular-nums">117</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[91%] rounded-full bg-primary" />
              </div>
              <p className="text-xs text-muted-foreground">
                91% of orders completed
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Preparing</p>
                <p className="mt-1 text-xl font-semibold tabular-nums">7</p>
              </div>
              <div className="rounded-xl border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">In transit</p>
                <p className="mt-1 text-xl font-semibold tabular-nums">4</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-primary/5 p-3 text-sm text-primary">
              <PackageCheckIcon className="size-4 shrink-0" />
              <span>117 of 128 orders delivered so far today</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-4 lg:px-6">
        <RecentOrders />
      </div>
      <p className="px-4 text-xs text-muted-foreground lg:px-6">
        Preview data only. Connect the GoShop API to display live store metrics.
      </p>
    </div>
  )
}
