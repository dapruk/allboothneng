import { Link } from "@tanstack/react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  ChevronsUpDown,
  FileCheck,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  User2,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const sidebarMainMenu = [
  {
    title: "Dashboard",
    url: "#",
    items: [
      { title: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
      { title: "Tasks", url: "/dashboard/admin/tasks", icon: FileCheck },
    ],
  },
  {
    title: "User and Role Management",
    url: "#",
    items: [
      {
        title: "User Management",
        url: "/dashboard/admin/user-management",
        icon: User,
      },
      {
        title: "Role Management",
        url: "/dashboard/admin/role-management",
        icon: Users,
      },
    ],
  },
];

const sidebarFooterMenu = [
  { title: "Settings", url: "/dashboard/admin", icon: Settings },
  { title: "Logout", url: "/", icon: LogOut },
];

export default function AppSidebar() {
  const { isMobile } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="mx-auto my-4">
            <Link to="/" className="text-xl font-semibold">
              BTEKLabs Basecode
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {sidebarMainMenu.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton asChild>
                      <Link to={subItem.url}>
                        <subItem.icon />
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage alt="User" />
                    <AvatarFallback className="rounded-lg">
                      <User2 />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">hallwack</span>
                    <span className="truncate text-xs">
                      hallwack.id@gmail.com
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isMobile ? "bottom" : "right"}
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="end"
                sideOffset={4}
              >
                {sidebarFooterMenu.map((item) => (
                  <DropdownMenuItem asChild key={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span className="ms-2">{item.title}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
