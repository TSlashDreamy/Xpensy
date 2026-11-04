import {
  RiCheckLine as AcceptIcon,
  RiCloseLine as CloseIcon,
} from "@remixicon/react";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";

interface AddExpenseFooterProps {
  isAdding: boolean;
  isMobileView: boolean;
}

export default function AddExpenseFooter({
  isAdding,
  isMobileView,
}: AddExpenseFooterProps) {
  if (isMobileView) {
    return (
      <DrawerFooter className="px-0 flex-row justify-evenly">
        <Button
          type="submit"
          className="rounded-2xl h-auto py-2.5 px-6 text-sm"
          disabled={isAdding}
        >
          <AcceptIcon />
          {isAdding ? "Saving..." : "Add"}
        </Button>
        <DrawerClose asChild>
          <Button
            className="rounded-2xl h-auto py-2.5 px-6 text-sm"
            variant="outline"
          >
            <CloseIcon />
            Cancel
          </Button>
        </DrawerClose>
      </DrawerFooter>
    );
  }

  return (
    <DialogFooter>
      <Button className="py-1 sm:py-0" type="submit" disabled={isAdding}>
        {isAdding ? "Saving..." : "Add"}
      </Button>
      <DialogClose asChild>
        <Button className="py-1 sm:py-0" variant="outline">
          Cancel
        </Button>
      </DialogClose>
    </DialogFooter>
  );
}
