"use client"

import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  BoxesIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
  WalletCardsIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const metrics = [
  {
    title: "Sales today",
    value: "GH₵4,820.50",
    change: "+12.5%",
    note: "GH₵536.20 more than yesterday",
    icon: WalletCardsIcon,
    positive: true,
    bar: "w-[72%]",
  },
  {
    title: "Orders today",
    value: "128",
    change: "+8.2%",
    note: "11 orders still in progress",
    icon: ShoppingBagIcon,
    positive: true,
    bar: "w-[64%]",
  },
  {
    title: "Average order value",
    value: "GH₵37.66",
    change: "+5.4%",
    note: "Customers are adding more",
    icon: TrendingUpIcon,
    positive: true,
    bar: "w-[58%]",
  },
  {
    title: "Low-stock products",
    value: "7",
    change: "Needs attention",
    note: "Across 4 product categories",
    icon: BoxesIcon,
    positive: false,
    bar: "w-[36%]",
  },
]

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="h-full @container/card">
          <CardHeader className="flex min-h-[148px] flex-col gap-3">
            <div className="flex items-center justify-between">
              <CardDescription className="font-medium">
                {metric.title}
              </CardDescription>
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <metric.icon className="size-4" />
              </span>
            </div>
            <div className="flex min-w-0 items-center justify-between gap-2">
              <CardTitle className="min-w-0 text-2xl leading-none font-semibold tracking-tight tabular-nums @[250px]/card:text-3xl">
                {metric.value}
              </CardTitle>
              <Badge
                variant="outline"
                className={`shrink-0 gap-1 ${
                  metric.positive
                    ? "border-primary/20 bg-primary/5 text-primary"
                    : "border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-400"
                }`}
              >
                {metric.positive ? (
                  <ArrowUpRightIcon />
                ) : (
                  <ArrowDownRightIcon />
                )}
                {metric.change}
              </Badge>
            </div>
            <p className="mt-auto min-h-4 text-xs leading-4 text-muted-foreground">
              {metric.note}
            </p>
          </CardHeader>
          <CardFooter className="border-0 bg-transparent pt-0">
            <div
              className="h-1 w-full overflow-hidden rounded-full bg-muted"
              aria-hidden="true"
            >
              <div className={`h-full rounded-full bg-primary ${metric.bar}`} />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
