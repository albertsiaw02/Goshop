import {
  CheckCircle2Icon,
  Clock3Icon,
  PackageCheckIcon,
  ShoppingCartIcon,
} from "lucide-react"

import { RecentOrders } from "@/components/recent-orders"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const summary = [
  {
    title: "Total orders",
    value: "128",
    detail: "+8.2% vs yesterday",
    icon: ShoppingCartIcon,
    tone: "text-primary bg-primary/10",
  },
  {
    title: "Preparing",
    value: "7",
    detail: "Being packed now",
    icon: Clock3Icon,
    tone: "text-amber-700 bg-amber-500/10 dark:text-amber-400",
  },
  {
    title: "Out for delivery",
    value: "4",
    detail: "On the way to customers",
    icon: PackageCheckIcon,
    tone: "text-sky-700 bg-sky-500/10 dark:text-sky-400",
  },
  {
    title: "Delivered",
    value: "117",
    detail: "91% completion rate",
    icon: CheckCircle2Icon,
    tone: "text-primary bg-primary/10",
  },
]

export function OrdersSection() {
  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6" id="orders">
      <div className="flex flex-col gap-2">
        <Badge
          variant="secondary"
          className="w-fit rounded-full px-2.5 py-1 font-medium"
        >
          Order management
        </Badge>
        <h2 className="text-3xl font-semibold tracking-tight">Orders</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Keep fulfillment moving with a clear view of new, active, and
          completed orders.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {summary.map((item) => (
          <Card key={item.title} className="@container/card">
            <CardHeader className="flex min-h-[148px] flex-col gap-3">
              <div className="flex items-center justify-between">
                <CardDescription className="font-medium">
                  {item.title}
                </CardDescription>
                <span
                  className={`flex size-9 items-center justify-center rounded-xl ${item.tone}`}
                >
                  <item.icon className="size-4" />
                </span>
              </div>
              <CardTitle className="text-3xl leading-none font-semibold tabular-nums">
                {item.value}
              </CardTitle>
              <p className="mt-auto text-xs leading-4 text-muted-foreground">
                {item.detail}
              </p>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle>Fulfillment snapshot</CardTitle>
            <CardDescription>
              Today&apos;s order progress from placement to delivery
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-normal">
            128 orders today
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex h-3 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[91%] bg-primary" />
            <div className="h-full w-[6%] bg-amber-500" />
            <div className="h-full w-[3%] bg-sky-500" />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="size-2.5 rounded-full bg-primary" />
              <span className="text-muted-foreground">Delivered</span>
              <span className="ml-auto font-medium tabular-nums">117</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="size-2.5 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Preparing</span>
              <span className="ml-auto font-medium tabular-nums">7</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="size-2.5 rounded-full bg-sky-500" />
              <span className="text-muted-foreground">Out for delivery</span>
              <span className="ml-auto font-medium tabular-nums">4</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <RecentOrders />
      <p className="text-xs text-muted-foreground">
        Preview data only. Connect the GoShop API to display live order updates.
      </p>
    </div>
  )
}
