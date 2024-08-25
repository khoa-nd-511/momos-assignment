import { createColumnHelper } from "@tanstack/react-table";

import { ITask } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import CheckboxFilter from "@/components/ui/data-table-checkbox-filter";
import RichTextFilter from "@/components/ui/data-table-rich-text-filter";
import SelectFilter from "@/components/ui/data-table-select-filter";
import NumberFilter from "@/components/ui/data-table-number-filter";
import DateFilter from "@/components/ui/data-table-date-filter";

const columnHelper = createColumnHelper<ITask>();

export const columns = [
  columnHelper.accessor("name", {
    header: ({ table, column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Name"
          renderFilter={() => (
            <RichTextFilter fieldName="name" column={column} table={table} />
          )}
        />
      );
    },
    size: 180,
  }),

  columnHelper.accessor("status", {
    header: ({ table, column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Status"
          renderFilter={() => (
            <SelectFilter
              fieldName="status"
              column={column}
              table={table}
              options={[
                {
                  label: "Ready",
                  value: "ready",
                },
                {
                  label: "Doing",
                  value: "doing",
                },
                {
                  label: "Done",
                  value: "done",
                },
              ]}
            />
          )}
        />
      );
    },
    size: 180,
  }),

  columnHelper.accessor("priority", {
    header: ({ table, column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Priority"
          renderFilter={() => (
            <SelectFilter
              fieldName="priority"
              column={column}
              table={table}
              options={[
                {
                  label: "High",
                  value: "high",
                },
                {
                  label: "Medium",
                  value: "medium",
                },
                {
                  label: "Low",
                  value: "low",
                },
              ]}
            />
          )}
        />
      );
    },
    size: 180,
  }),

  columnHelper.accessor("completed", {
    header: ({ table, column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Completed"
          renderFilter={() => {
            return (
              <CheckboxFilter
                fieldName="completed"
                column={column}
                table={table}
              />
            );
          }}
        />
      );
    },
    cell: ({ getValue }) => {
      return (
        <Checkbox
          checked={getValue()}
          onCheckedChange={() => alert("not implemented")}
        />
      );
    },
    size: 180,
  }),

  columnHelper.accessor("dueDate", {
    header: ({ table, column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Due Date"
          renderFilter={() => (
            <DateFilter table={table} column={column} fieldName="dueDate" />
          )}
        />
      );
    },
    cell: ({ getValue }) => formatDate(getValue()),
    size: 200,
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
    size: 250,
  }),

  columnHelper.accessor("estimation", {
    header: ({ table, column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Estimation"
          renderFilter={() => (
            <NumberFilter
              fieldName="estimation"
              column={column}
              table={table}
            />
          )}
        />
      );
    },
    size: 180,
  }),

  columnHelper.accessor("description", {
    header: "Description",
    size: 180,
  }),

  columnHelper.accessor("createdAt", {
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Created At" />;
    },
    cell: ({ getValue }) => formatDate(getValue()),
    size: 200,
  }),
];
