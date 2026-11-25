import { CheckCircle2Icon, Clock3Icon, PackageCheckIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const orders = [
  {
    id: "GS-2085",
    customer: "Ama Mensah",
    items: 5,
    total: 184.5,
    status: "Delivered",
    time: "10:42 AM",
  },
  {
    id: "GS-2084",
    customer: "Kojo Asante",
    items: 3,
    total: 96.25,
    status: "Preparing",
    time: "10:35 AM",
  },
  {
    id: "GS-2083",
    customer: "Akosua Boateng",
    items: 8,
    total: 327.8,
    status: "Out for delivery",
    time: "10:18 AM",
  },
  {
    id: "GS-2082",
    customer: "Yaw Owusu",
    items: 2,
    total: 58.0,
    status: "Delivered",
    time: "9:54 AM",
  },
  {
    id: "GS-2081",
    customer: "Esi Addo",
    items: 6,
    total: 212.4,
    status: "Preparing",
    time: "9:41 AM",
  },
]

function formatCurrency(amount: number) {
  return `GH₵${amount.toFixed(2)}`
}

function OrderStatus({ status }: { status: string }) {
  const Icon =
    status === "Delivered"
      ? CheckCircle2Icon
      : status === "Preparing"
        ? Clock3Icon
        : PackageCheckIcon

  return (
    <Badge variant="outline" className="gap-1.5 font-normal">
      <Icon className="size-3.5" />
      {status}
    </Badge>
  )
}

export function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent orders</CardTitle>
        <CardDescription>Latest customer orders from today</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell className="text-right">{order.items}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(order.total)}
                </TableCell>
                <TableCell>
                  <OrderStatus status={order.status} />
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {order.time}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
