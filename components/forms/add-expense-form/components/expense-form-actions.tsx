"use client";

import {
  RiCheckLine as AcceptIcon,
  RiCloseLine as CloseIcon,
} from "@remixicon/react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import {
  ResponsiveDialogClose,
  ResponsiveDialogFooter,
  useResponsiveDialog,
} from "@/components/ui/responsive-dialog";
import { Spinner } from "@/components/ui/spinner";
import type { AddExpenseState } from "@/lib/actions/addExpense";

interface ExpenseFormActionsProps {
  formState: AddExpenseState;
  isPending: boolean;
}

export default function ExpenseFormActions({
  formState,
  isPending,
}: ExpenseFormActionsProps) {
  const { isMobile } = useResponsiveDialog();

  return (
    <Field>
      <ResponsiveDialogFooter
        className={cn(isMobile && "px-0 flex-row justify-evenly")}
      >
        <Button
          disabled={isPending}
          type="submit"
          size={isMobile ? "touch" : "default"}
        >
          {isPending ? <Spinner data-icon="inline-start" /> : <AcceptIcon />}
          {isPending ? "Saving..." : "Add"}
        </Button>
        <ResponsiveDialogClose asChild>
          <Button
            disabled={isPending}
            variant="outline"
            size={isMobile ? "touch" : "default"}
          >
            <CloseIcon />
            Cancel
          </Button>
        </ResponsiveDialogClose>
      </ResponsiveDialogFooter>
      <FieldError>{formState.message}</FieldError>
    </Field>
  );
}
