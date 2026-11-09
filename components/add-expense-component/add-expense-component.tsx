"use client";

import { RiAddLine as AddIcon } from "@remixicon/react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog";
import type { Currency } from "@/lib/currencies";

import AddExpenseForm from "../forms/add-expense-form";

interface AddExpenseProps {
  currencies: Currency[];
  defaultCurrency?: string;
}

export default function AddExpense({
  currencies,
  defaultCurrency,
}: AddExpenseProps) {
  const [isOpened, setIsOpened] = React.useState(false);

  const handleSuccess = React.useCallback(() => setIsOpened(false), []);

  return (
    <ResponsiveDialog
      open={isOpened}
      onOpenChange={setIsOpened}
      drawerProps={{ repositionInputs: false }}
    >
      <ResponsiveDialogTrigger asChild>
        <Button className="rounded-full size-14 sm:size-10" variant="outline">
          <AddIcon className="size-5 sm:size-4" />
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Add expense</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Enter the amount and pick a currency
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className="px-4 text-center md:px-0">
          <AddExpenseForm
            onSuccess={handleSuccess}
            currencies={currencies}
            defaultCurrency={defaultCurrency}
          />
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
