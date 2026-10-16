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
      <DrawerFooter className="px-0">
        <Button type="submit" className="w-full" disabled={isAdding}>
          {isAdding ? "Saving..." : "Add"}
        </Button>
        <DrawerClose asChild>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    );
  }

  return (
    <DialogFooter>
      <Button type="submit" disabled={isAdding}>
        {isAdding ? "Saving..." : "Add"}
      </Button>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
    </DialogFooter>
  );
}
