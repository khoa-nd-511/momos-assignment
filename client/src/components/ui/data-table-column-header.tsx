import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
} from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode } from "react";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  enableSort?: boolean;
  renderFilter?: () => ReactNode;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  enableSort = true,
  renderFilter,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center justify-between gap-2", className)}>
      <span>{title}</span>

      <div>
        {enableSort && (
          <Button
            variant="ghost"
            className="p-2"
            onClick={() => {
              column.toggleSorting(undefined, column.getCanMultiSort());
            }}
          >
            {column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="h-4 w-4" />
            ) : (
              <CaretSortIcon className="h-4 w-4" />
            )}
          </Button>
        )}

        {!!renderFilter && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-2">
                <FilterIcon
                  size={16}
                  className={cn("stroke-slate-600", {
                    "fill-slate-600": !!column.getFilterValue(),
                  })}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="px-8 py-4">
              {renderFilter()}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
