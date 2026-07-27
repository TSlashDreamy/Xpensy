"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { sidebarMenuIcons } from "./constants";
import { SidebarMenuButton, useSidebar } from "../ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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
  const { open } = useSidebar();
  const pathname = usePathname();
  const isActive = pathname === route;
  const Icon = sidebarMenuIcons[iconName];

  const button = (
    <SidebarMenuButton asChild isActive={isActive}>
      <Link href={route}>
        <Icon />
        <span>{label}</span>
      </Link>
    </SidebarMenuButton>
  );

  if (open) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right">
        <span className="text-secondary">{label}</span>
      </TooltipContent>
    </Tooltip>
  );
}
