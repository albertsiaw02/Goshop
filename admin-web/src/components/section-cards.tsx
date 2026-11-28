"use client"

import { MousePointer2Icon, ShoppingCartIcon, StoreIcon, TrendingUpIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const metrics = [
  {
    title: "Total Revenue",
    value: "GH₵84,320",
    change: "+8.5% from last month",
    icon: TrendingUpIcon,
    featured: true,
  },
  {
    title: "Total Orders",
    value: "2,568",
    change: "+6.4% from last month",
    icon: ShoppingCartIcon,
  },
  {
    title: "New Customers",
    value: "1,245",
    change: "+3.1% from last month",
    icon: StoreIcon,
  },
  {
    title: "Conversion Rate",
    value: "3.6%",
    change: "+0.5% from last month",
    icon: MousePointer2Icon,
  },
]

function Sparkline({ featured = false }: { featured?: boolean }) {
  const stroke = featured ? "#b9c3ff" : "#f59a56"

  return (
    <svg className="absolute right-3 bottom-3 h-14 w-[44%]" viewBox="0 0 160 56" fill="none" aria-hidden="true">
      <path
        d="M2 43 C18 45 26 35 40 38 C54 41 59 24 73 29 C88 34 93 15 107 19 C123 23 131 9 158 2"
        stroke={stroke}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M2 43 C18 45 26 35 40 38 C54 41 59 24 73 29 C88 34 93 15 107 19 C123 23 131 9 158 2 L158 56 L2 56 Z" fill={featured ? "rgba(185,195,255,.10)" : "rgba(245,154,86,.10)"} />
    </svg>
  )
}

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-3 px-4 lg:px-6 sm:grid-cols-2 @5xl/main:grid-cols-4">
      {metrics.map((metric) => (
        <Card
          key={metric.title}
          className={
            metric.featured
              ? "relative min-h-[132px] overflow-hidden rounded-xl border-0 bg-[#181e2b] text-white shadow-sm"
              : "relative min-h-[132px] overflow-hidden rounded-xl border-[#eceff3] bg-[#f8f9fb] shadow-sm"
          }
        >
          <CardContent className="flex h-full flex-col p-4">
            <div className={`flex items-center gap-2 text-[13px] font-semibold ${metric.featured ? "text-white" : "text-[#5d6675]"}`}>
              <metric.icon className={`size-4 ${metric.featured ? "text-white" : "text-[#e88945]"}`} />
              <span>{metric.title}</span>
            </div>
            <div className="mt-4">
              <p className={`text-[24px] leading-none font-bold tracking-tight tabular-nums ${metric.featured ? "text-white" : "text-[#202532]"}`}>
                {metric.value}
              </p>
              <p className={`mt-2 text-[11px] font-medium ${metric.featured ? "text-[#dce2ff]" : "text-[#667085]"}`}>
                <span className={metric.featured ? "mr-1 text-[#7ee0a1]" : "mr-1 text-[#168a3a]"}>+</span>
                {metric.change.replace(/^\+/, "")}
              </p>
            </div>
            <Sparkline featured={metric.featured} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
