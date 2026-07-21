"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { sidebarMenuIcons } from "./constants";
import { SidebarMenuButton } from "../ui/sidebar";

import type { SIDEBAR_ICON_NAMES } from "./constants";

interface NavigationLinkProps {
  route: string;
  iconName: SIDEBAR_ICON_NAMES;
  label: string;
}

export function NavigationLink({
  route,
  iconName,
  label,
}: NavigationLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === route;
  const Icon = sidebarMenuIcons[iconName];

  return (
    <SidebarMenuButton asChild isActive={isActive}>
      <Link href={route}>
        <Icon />
        <span>{label}</span>
      </Link>
    </SidebarMenuButton>
  );
}
