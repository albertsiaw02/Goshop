import {
  BanknoteIcon,
  CreditCardIcon,
  ShoppingBasketIcon,
  WalletCardsIcon,
} from "lucide-react"

import { SalesChart } from "@/components/sales-chart"
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
    title: "Gross revenue",
    value: "GH₵4,820.50",
    detail: "+12.5% vs yesterday",
    icon: BanknoteIcon,
    tone: "text-primary bg-primary/10",
  },
  {
    title: "Net revenue",
    value: "GH₵4,572.20",
    detail: "After GH₵248.30 in refunds",
    icon: WalletCardsIcon,
    tone: "text-primary bg-primary/10",
  },
  {
    title: "Orders",
    value: "128",
    detail: "+8.2% vs yesterday",
    icon: ShoppingBasketIcon,
    tone: "text-sky-700 bg-sky-500/10 dark:text-sky-400",
  },
  {
    title: "Average order value",
    value: "GH₵37.66",
    detail: "+5.4% this week",
    icon: CreditCardIcon,
    tone: "text-violet-700 bg-violet-500/10 dark:text-violet-400",
  },
]

const salesMix = [
  { name: "Fresh produce", amount: "GH₵1,735.38", share: "36%", width: "w-[36%]" },
  { name: "Pantry staples", amount: "GH₵1,253.33", share: "26%", width: "w-[26%]" },
  { name: "Dairy & chilled", amount: "GH₵1,012.31", share: "21%", width: "w-[21%]" },
  { name: "Other", amount: "GH₵819.48", share: "17%", width: "w-[17%]" },
]

export function SalesSection() {
  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6" id="sales">
      <div className="flex flex-col gap-2">
        <Badge
          variant="secondary"
          className="w-fit rounded-full px-2.5 py-1 font-medium"
        >
          Revenue analytics
        </Badge>
        <h2 className="text-3xl font-semibold tracking-tight">Sales</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Understand your revenue, order value, and the products contributing
          most to today&apos;s performance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {summary.map((item) => (
          <Card key={item.title} className="h-full @container/card">
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
              <CardTitle className="text-2xl leading-none font-semibold tracking-tight tabular-nums @[250px]/card:text-3xl">
                {item.value}
              </CardTitle>
              <p className="mt-auto text-xs leading-4 text-muted-foreground">
                {item.detail}
              </p>
            </CardHeader>
          </Card>
        ))}
      </div>

      <SalesChart />

      <div className="grid gap-4 @5xl/main:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by category</CardTitle>
            <CardDescription>
              Category contribution to today&apos;s gross sales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {salesMix.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {item.amount}
                    <span className="ml-2 text-xs">({item.share})</span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full bg-primary ${item.width}`}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment overview</CardTitle>
            <CardDescription>
              How customers paid for today&apos;s orders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border p-4">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <WalletCardsIcon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Mobile money</p>
                <p className="text-xs text-muted-foreground">
                  82 transactions
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums">
                  GH₵3,278.00
                </p>
                <p className="text-xs text-muted-foreground">68% of sales</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border p-4">
              <span className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-700 dark:text-sky-400">
                <CreditCardIcon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Card & cash</p>
                <p className="text-xs text-muted-foreground">
                  46 transactions
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums">
                  GH₵1,542.50
                </p>
                <p className="text-xs text-muted-foreground">32% of sales</p>
              </div>
            </div>
            <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              Payment details are illustrative until live transaction data is
              connected.
            </p>
          </CardContent>
        </Card>
      </div>
      <p className="text-xs text-muted-foreground">
        Preview data only. Connect the GoShop API to display live sales
        performance.
      </p>
    </div>
  )
}
