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

interface AdvancedFilterButton extends ButtonProps {
  onFilterChange?: (filter: unknown) => void;
}

const AdvancedFilterButton = ({
  onFilterChange = noop,
  ...buttonProps
}: AdvancedFilterButton) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...buttonProps}>Advanced Filter</Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-xl">
        <DialogHeader>
          <DialogTitle>Advanced Filter</DialogTitle>
          <DialogDescription>Create complex rules...</DialogDescription>
        </DialogHeader>
        <CompoundFilter
          onChange={(value) => {
            onFilterChange(value);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedFilterButton;
