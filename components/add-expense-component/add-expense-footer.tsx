"use client";

import {
  RiCheckLine as AcceptIcon,
  RiCloseLine as CloseIcon,
} from "@remixicon/react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import {
  ResponsiveDialogClose,
  ResponsiveDialogFooter,
  useResponsiveDialog,
} from "@/components/ui/responsive-dialog";

interface AddExpenseFooterProps {
  submitting: boolean;
}

export default function AddExpenseFooter({
  submitting,
}: AddExpenseFooterProps) {
  const { isMobile } = useResponsiveDialog();

  return (
    <ResponsiveDialogFooter
      className={cn(isMobile && "px-0 flex-row justify-evenly")}
    >
      <Button
        disabled={submitting}
        type="submit"
        size={isMobile ? "touch" : "default"}
      >
        <AcceptIcon />
        {submitting ? "Saving..." : "Add"}
      </Button>
      <ResponsiveDialogClose asChild>
        <Button
          disabled={submitting}
          variant="outline"
          size={isMobile ? "touch" : "default"}
        >
          <CloseIcon />
          Cancel
        </Button>
      </ResponsiveDialogClose>
    </ResponsiveDialogFooter>
  );
}
