import CompoundFilter from "@/components/CompoundFilter";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { noop } from "@tanstack/react-table";
import { useState } from "react";

interface AdvancedFilterButton extends ButtonProps {
  compoundFilter?: unknown;
  onFilterChange?: (filter: unknown) => void;
}

const AdvancedFilterButton = ({
  onFilterChange = noop,
  compoundFilter,
  ...buttonProps
}: AdvancedFilterButton) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button {...buttonProps} onClick={() => setOpen(true)}>
          Advanced Filter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-xl">
        <DialogHeader>
          <DialogTitle>Advanced Filter</DialogTitle>
          <DialogDescription>Create complex rules...</DialogDescription>
        </DialogHeader>
        <CompoundFilter
          compoundFilter={compoundFilter}
          onChange={(value) => {
            onFilterChange(value);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedFilterButton;
