"use client";

import { cn } from "cn";
import * as React from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveDialogContextValue {
  isMobile: boolean;
}

const ResponsiveDialogContext =
  React.createContext<ResponsiveDialogContextValue | null>(null);

export function useResponsiveDialog() {
  const context = React.useContext(ResponsiveDialogContext);

  if (!context) {
    throw new Error(
      "useResponsiveDialog must be used within <ResponsiveDialog>",
    );
  }

  return context;
}

interface ResponsiveDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  children?: React.ReactNode;
  drawerProps?: Omit<
    React.ComponentProps<typeof Drawer>,
    | "open"
    | "defaultOpen"
    | "onOpenChange"
    | "modal"
    | "children"
    | "fadeFromIndex"
  >;
}

function ResponsiveDialog({
  drawerProps,
  children,
  ...props
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile();
  const contextValue = React.useMemo(() => ({ isMobile }), [isMobile]);

  return (
    <ResponsiveDialogContext.Provider value={contextValue}>
      {isMobile ? (
        <Drawer {...drawerProps} {...props}>
          {children}
        </Drawer>
      ) : (
        <Dialog {...props}>{children}</Dialog>
      )}
    </ResponsiveDialogContext.Provider>
  );
}

function ResponsiveDialogTrigger(
  props: React.ComponentProps<typeof DialogTrigger>,
) {
  const { isMobile } = useResponsiveDialog();

  if (isMobile) {
    return <DrawerTrigger {...props} />;
  }

  return <DialogTrigger {...props} />;
}

type ResponsiveDialogContentProps = React.ComponentProps<
  typeof DialogContent
> & {
  drawerProps?: Omit<React.ComponentProps<typeof DrawerContent>, "children">;
  drawerClassName?: string;
  drawerWrapperClassName?: string;
};

function ResponsiveDialogContent({
  drawerProps,
  drawerClassName,
  drawerWrapperClassName,
  className,
  children,
  ...props
}: ResponsiveDialogContentProps) {
  const { isMobile } = useResponsiveDialog();

  if (isMobile) {
    const { className: drawerContentClassName, ...restDrawerProps } =
      drawerProps ?? {};

    return (
      <DrawerContent
        className={cn(className, drawerContentClassName, drawerClassName)}
        {...restDrawerProps}
      >
        <div
          className={cn(
            "mx-auto w-full max-w-sm overflow-y-auto",
            drawerWrapperClassName,
          )}
        >
          {children}
        </div>
      </DrawerContent>
    );
  }

  return (
    <DialogContent className={className} {...props}>
      {children}
    </DialogContent>
  );
}

type ResponsiveDialogHeaderProps = React.ComponentProps<typeof DialogHeader> & {
  drawerClassName?: string;
};

function ResponsiveDialogHeader({
  drawerClassName,
  className,
  ...props
}: ResponsiveDialogHeaderProps) {
  const { isMobile } = useResponsiveDialog();

  if (isMobile) {
    return (
      <DrawerHeader className={cn(className, drawerClassName)} {...props} />
    );
  }

  return <DialogHeader className={className} {...props} />;
}

type ResponsiveDialogFooterProps = React.ComponentProps<typeof DialogFooter> & {
  drawerClassName?: string;
};

function ResponsiveDialogFooter({
  drawerClassName,
  className,
  ...props
}: ResponsiveDialogFooterProps) {
  const { isMobile } = useResponsiveDialog();

  if (isMobile) {
    return (
      <DrawerFooter className={cn(className, drawerClassName)} {...props} />
    );
  }

  return <DialogFooter className={className} {...props} />;
}

type ResponsiveDialogTitleProps = React.ComponentProps<typeof DialogTitle> & {
  drawerClassName?: string;
};

function ResponsiveDialogTitle({
  drawerClassName,
  className,
  ...props
}: ResponsiveDialogTitleProps) {
  const { isMobile } = useResponsiveDialog();

  if (isMobile) {
    return (
      <DrawerTitle className={cn(className, drawerClassName)} {...props} />
    );
  }

  return <DialogTitle className={className} {...props} />;
}

type ResponsiveDialogDescriptionProps = React.ComponentProps<
  typeof DialogDescription
> & {
  drawerClassName?: string;
};

function ResponsiveDialogDescription({
  drawerClassName,
  className,
  ...props
}: ResponsiveDialogDescriptionProps) {
  const { isMobile } = useResponsiveDialog();

  if (isMobile) {
    return (
      <DrawerDescription
        className={cn(className, drawerClassName)}
        {...props}
      />
    );
  }

  return <DialogDescription className={className} {...props} />;
}

type ResponsiveDialogCloseProps = React.ComponentProps<typeof DialogClose> & {
  drawerClassName?: string;
};

function ResponsiveDialogClose({
  drawerClassName,
  className,
  ...props
}: ResponsiveDialogCloseProps) {
  const { isMobile } = useResponsiveDialog();

  if (isMobile) {
    return (
      <DrawerClose className={cn(className, drawerClassName)} {...props} />
    );
  }

  return <DialogClose className={className} {...props} />;
}

export {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
};
