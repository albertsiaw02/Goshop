import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function PlaceholderSection({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{title} management</CardTitle>
          <CardDescription>
            This section is ready to display live GoShop data.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Connect the GoShop API to view and manage {title.toLowerCase()} here.
        </CardContent>
      </Card>
    </div>
  )
}
