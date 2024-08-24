import { createColumnHelper } from "@tanstack/react-table";

import { ITask } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const columnHelper = createColumnHelper<ITask>();

export const columns = [
  columnHelper.accessor("name", {
    header: ({ table, column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Name"
          renderFilter={() => (
            <div className="flex flex-col gap-2">
              <Input
                autoFocus
                defaultValue={
                  table.getColumn("name")?.getFilterValue() as string
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    table
                      .getColumn("name")
                      ?.setFilterValue(event.currentTarget.value.trim());
                  }
                }}
              />

              <Button
                onClick={() => column.setFilterValue("")}
                disabled={!column.getFilterValue()}
              >
                Clear filter
              </Button>
            </div>
          )}
        />
      );
    },
  }),

  columnHelper.accessor("status", {
    header: ({ table, column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Status"
          renderFilter={() => (
            <div className="flex flex-col gap-2">
              <Select
                defaultValue={
                  table.getColumn("status")?.getFilterValue() as string
                }
                onValueChange={(value) => {
                  table.getColumn("status")?.setFilterValue(value);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="doing">Doing</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => column.setFilterValue("")}
                disabled={!column.getFilterValue()}
              >
                Clear filter
              </Button>
            </div>
          )}
        />
      );
    },
  }),

  columnHelper.accessor("priority", {
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Priority" />;
    },
  }),

  columnHelper.accessor("completed", {
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Completed" />;
    },
    cell: ({ getValue }) => {
      return (
        <Checkbox
          checked={getValue()}
          onCheckedChange={() => alert("not implemented")}
        />
      );
    },
  }),

  columnHelper.accessor("dueDate", {
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Due Date" />;
    },
    cell: ({ getValue }) => formatDate(getValue()),
  }),

  columnHelper.accessor("tags", {
    header: "Tags",
    cell: (props) => (
      <div className="flex flex-wrap gap-2">
        {props.getValue().map(({ id, name }) => (
          <Badge key={id}>{name}</Badge>
        ))}
      </div>
    ),
  }),

  columnHelper.accessor("estimation", {
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Estimation" />;
    },
  }),

  columnHelper.accessor("description", {
    header: "Description",
  }),

  columnHelper.accessor("createdAt", {
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Created At" />;
    },
    cell: ({ getValue }) => formatDate(getValue()),
  }),
];
