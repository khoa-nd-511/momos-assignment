import { createColumnHelper } from "@tanstack/react-table";

import { ITask } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

const columnHelper = createColumnHelper<ITask>();

export const columns = [
  columnHelper.accessor("name", {
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
  }),

  columnHelper.accessor("status", {
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
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
