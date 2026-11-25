"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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

export function SalesChart() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState(() =>
    isMobile ? "7d" : "30d"
  )

  const filteredData = chartData.slice(
    timeRange === "7d" ? -7 : timeRange === "30d" ? -30 : undefined
  )

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Sales over time</CardTitle>
        <CardDescription>Daily store revenue</CardDescription>
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
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <AreaChart data={filteredData} margin={{ left: 8, right: 8 }}>
            <defs>
              <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-sales)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-sales)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
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
      </CardContent>
    </Card>
  )
}
