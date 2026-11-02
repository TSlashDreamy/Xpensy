"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Currency } from "@/lib/currencies";

import AddExpenseTrigger from "./add-expense-trigger";
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
  const isMobile = useIsMobile();

  const handleSuccess = React.useCallback(() => setIsOpened(false), []);

  if (isMobile) {
    return (
      <Drawer open={isOpened} onOpenChange={setIsOpened}>
        <AddExpenseTrigger isMobileView />
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Add expense</DrawerTitle>
              <DrawerDescription>
                Enter the amount and pick a currency
              </DrawerDescription>
            </DrawerHeader>

            <div className="px-4 flex flex-col items-center justify-center text-center">
              <div className="w-full">
                <AddExpenseForm
                  isMobileView
                  onSuccess={handleSuccess}
                  currencies={currencies}
                  defaultCurrency={defaultCurrency}
                />
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <AddExpenseTrigger />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add expense</DialogTitle>
          <DialogDescription>
            Enter the amount and pick a currency
          </DialogDescription>
        </DialogHeader>
        <div className="text-center">
          <AddExpenseForm
            onSuccess={handleSuccess}
            currencies={currencies}
            defaultCurrency={defaultCurrency}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
