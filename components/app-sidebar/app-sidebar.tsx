import { RiUser2Fill, RiSettings3Line as SettingsIcon } from "@remixicon/react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { sidebarMenuItems } from "./constants";
import { ThemeSwitcher } from "../theme-switcher";
import { NavigationLink } from "./navigation-link";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <SidebarTrigger />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {sidebarMenuItems.map((menuItem) => (
              <SidebarMenuItem key={menuItem.label}>
                <NavigationLink {...menuItem} />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={"/settings"}>
                <SettingsIcon />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <RiUser2Fill /> Username
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* TODO: Remove theme switcher */}
          <ThemeSwitcher />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
