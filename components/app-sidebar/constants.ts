import {
  RiHome5Line as HomeIcon,
  RiLineChartLine as GraphIcon,
  RiFoldersLine as CollectionsIcon,
  RiGroupLine as ConnectionsIcon,
} from "@remixicon/react";

export enum SIDEBAR_ICON_NAMES {
  HomeIcon = "HomeIcon",
  GraphIcon = "GraphIcon",
  CollectionsIcon = "CollectionsIcon",
  ConnectionsIcon = "ConnectionsIcon",
}

export const sidebarMenuIcons = {
  [SIDEBAR_ICON_NAMES.HomeIcon]: HomeIcon,
  [SIDEBAR_ICON_NAMES.GraphIcon]: GraphIcon,
  [SIDEBAR_ICON_NAMES.CollectionsIcon]: CollectionsIcon,
  [SIDEBAR_ICON_NAMES.ConnectionsIcon]: ConnectionsIcon,
};

export const sidebarMenuItems = [
  {
    iconName: SIDEBAR_ICON_NAMES.HomeIcon,
    route: "/homepage",
    label: "Homepage",
  },
  {
    iconName: SIDEBAR_ICON_NAMES.GraphIcon,
    route: "/dashboard",
    label: "Dashboard",
  },
  {
    iconName: SIDEBAR_ICON_NAMES.CollectionsIcon,
    route: "/collections",
    label: "Expense collections",
  },
  {
    iconName: SIDEBAR_ICON_NAMES.ConnectionsIcon,
    route: "/connections",
    label: "Your connections",
  },
];
