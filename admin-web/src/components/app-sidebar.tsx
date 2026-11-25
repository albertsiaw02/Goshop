import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  ChartNoAxesCombinedIcon,
  CircleHelpIcon,
  LayoutDashboardIcon,
  Settings2Icon,
  ShoppingCartIcon,
  StoreIcon,
} from "lucide-react"

const data = {
  user: {
    name: "Store Admin",
    email: "admin@goshop.local",
    avatar: "",
  },
  navMain: [
    {
      title: "Overview",
      url: "#overview",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Orders",
      url: "#orders",
      icon: <ShoppingCartIcon />,
    },
    {
      title: "Sales",
      url: "#sales",
      icon: <ChartNoAxesCombinedIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#settings",
      icon: <Settings2Icon />,
    },
    {
      title: "Help",
      url: "mailto:support@goshop.local",
      icon: <CircleHelpIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#overview" />}
            >
              <StoreIcon className="size-5!" />
              <span className="text-base font-semibold">GoShop</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
