import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FilePlus, PlusIcon } from "lucide-react";

const CompoundFilterAddRuleButton = ({
  onSelect,
}: {
  onSelect: (type: "rule" | "group") => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="col-start-2 mr-auto">
          Add rule
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={() => onSelect("rule")}>
          <PlusIcon />
          Add Filter rule
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelect("group")}>
          <FilePlus />
          Add Filter group
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CompoundFilterAddRuleButton;
