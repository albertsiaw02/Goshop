"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const chartData = Array.from({ length: 90 }, (_, index) => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() - (89 - index))

  const trend = 1200 + ((index * 173) % 760)
  const variation = Math.round(Math.sin(index / 5) * 360)

  return {
    date: date.toISOString().slice(0, 10),
    sales: Math.max(450, trend + variation),
  }
})

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const currencyFormatter = new Intl.NumberFormat("en-GH", {
  maximumFractionDigits: 0,
})

export function SalesChart() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState(() =>
    isMobile ? "7d" : "30d"
  )

  const filteredData = chartData.slice(
    timeRange === "7d" ? -7 : timeRange === "30d" ? -30 : undefined
  )
  const totalSales = filteredData.reduce((total, day) => total + day.sales, 0)
  const averageSales = Math.round(totalSales / filteredData.length)
  const peakSales = Math.max(...filteredData.map((day) => day.sales))

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle>Revenue trend</CardTitle>
          <CardDescription>
            Daily gross sales across the selected period
          </CardDescription>
        </div>
        <CardAction>
          <ToggleGroup
            multiple={false}
            value={[timeRange]}
            onValueChange={(value) => setTimeRange(value[0] ?? "30d")}
            variant="outline"
            className="hidden @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">90 days</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={(value) => value && setTimeRange(value)}>
            <SelectTrigger
              className="w-32 @[767px]/card:hidden"
              size="sm"
              aria-label="Select sales time range"
            >
              <SelectValue placeholder="30 days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="90d">90 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="7d">7 days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <AreaChart data={filteredData} margin={{ top: 12, right: 12, left: 0 }}>
            <defs>
              <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-sales)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-sales)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={52}
              tickMargin={8}
              tickFormatter={(value: number) =>
                `GH₵${currencyFormatter.format(value)}`
              }
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={28}
              tickFormatter={(value: string) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Area
              dataKey="sales"
              type="monotone"
              fill="url(#salesFill)"
              stroke="var(--color-sales)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Period revenue</p>
            <p className="mt-1 text-sm font-semibold tabular-nums">
              GH₵{currencyFormatter.format(totalSales)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Daily average</p>
            <p className="mt-1 text-sm font-semibold tabular-nums">
              GH₵{currencyFormatter.format(averageSales)}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs text-muted-foreground">Best day</p>
            <p className="mt-1 text-sm font-semibold tabular-nums">
              GH₵{currencyFormatter.format(peakSales)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
