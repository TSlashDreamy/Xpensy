"use client";

import {
  RiCheckLine as AcceptIcon,
  RiEdit2Line as UpdateIcon,
  RiDeleteBack2Line as ClearIcon,
} from "@remixicon/react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { clearExpenseLimit } from "@/lib/actions/clearExpenseLimit";
import type { SetExpenseLimitState } from "@/lib/actions/setExpenseLimit";

import type { LimitValues } from "../set-limit-form";

interface LimitFormActionsProps {
  formState: SetExpenseLimitState;
  initialValues?: LimitValues;
  isPending: boolean;
  onSuccess: () => void;
}

export default function LimitFormActions({
  formState,
  initialValues,
  isPending,
  onSuccess,
}: LimitFormActionsProps) {
  const [clearError, setClearError] = React.useState<string | null>(null);
  const [isClearing, startClearing] = React.useTransition();
  const isMobile = useIsMobile();

  const handleClear = React.useCallback(() => {
    setClearError(null);

    startClearing(async () => {
      const cleared = await clearExpenseLimit();

      if (cleared) {
        onSuccess();
      } else {
        setClearError("We couldn't remove your limit. Try again later.");
      }
    });
  }, [onSuccess]);

  return (
    <Field>
      <Button
        disabled={isPending || isClearing}
        type="submit"
        size={isMobile ? "touch" : "default"}
      >
        {isPending ? (
          <Spinner data-icon="inline-start" />
        ) : initialValues ? (
          <UpdateIcon />
        ) : (
          <AcceptIcon />
        )}
        {isPending
          ? initialValues
            ? "Updating..."
            : "Saving..."
          : initialValues
            ? "Update limits"
            : "Set limit"}
      </Button>
      {initialValues && (
        <Button
          disabled={isPending || isClearing}
          onClick={handleClear}
          type="button"
          size={isMobile ? "touch" : "default"}
          variant="destructive"
        >
          {isClearing ? <Spinner data-icon="inline-start" /> : <ClearIcon />}
          {isClearing ? "Removing..." : "Remove limit"}
        </Button>
      )}
      <FieldError>{clearError ?? formState.message}</FieldError>
    </Field>
  );
}
