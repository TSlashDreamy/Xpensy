"use client";

import { RiAddLine as AddIcon } from "@remixicon/react";

import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { DrawerTrigger } from "@/components/ui/drawer";

interface AddExpenseTriggerProps {
  isMobileView?: boolean;
}

export default function AddExpenseTrigger({
  isMobileView,
}: AddExpenseTriggerProps) {
  if (isMobileView) {
    return (
      <DrawerTrigger asChild>
        <Button className="rounded-full size-14 sm:size-10" variant="outline">
          <AddIcon className="size-5 sm:size-4" />
        </Button>
      </DrawerTrigger>
    );
  }

  return (
    <DialogTrigger asChild>
      <Button className="rounded-full size-14 sm:size-10" variant="outline">
        <AddIcon className="size-5 sm:size-4" />
      </Button>
    </DialogTrigger>
  );
}
