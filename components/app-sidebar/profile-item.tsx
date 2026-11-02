import { RiUser2Fill as UserIcon } from "@remixicon/react";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { getUserProfile } from "@/lib/actions/getUserProfile";

export default async function ProfileItem() {
  const profile = await getUserProfile();

  if (!profile) return;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton>
        <UserIcon /> {profile.display_name}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
