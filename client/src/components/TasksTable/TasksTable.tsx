import { useEffect, useState } from "react";
import {
  ColumnFiltersState,
  getCoreRowModel,
  OnChangeFn,
  SortingState,
} from "@tanstack/react-table";

import { useLoader } from "@/lib/hooks";
import { getTasks } from "@/lib/services/task";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/TasksTable/columns";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

const initialColumnsOrder = [
  "name",
  "status",
  "priority",
  "completed",
  "dueDate",
  "tags",
  "estimation",
  "description",
  "createdAt",
];

const TasksTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>(initialColumnsOrder);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data = [], loading, error, load } = useLoader(getTasks);

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    if (loading) return;
    setSorting(updater);
  };

  useEffect(() => {
    load({ sorts: sorting, filters: columnFilters });
  }, [sorting, columnFilters, load]);

  return (
    <>
      <div className="flex items-center justify-between w-full">
        {loading ? <div>Loading Tasks...</div> : <div>{data.length} items</div>}
      </div>

      <div className="overflow-x-auto mt-5">
        <DataTable
          // custom props
          enableDragging
          loading={loading}
          error={error}
          // table props
          getCoreRowModel={getCoreRowModel()}
          data={data}
          columns={columns}
          // defaultColumn={{
          //   size: 200,
          //   minSize: 50,
          //   maxSize: 500,
          // }}
          state={{
            sorting,
            columnOrder,
            columnFilters,
          }}
          enableSorting
          enableMultiSort
          enableFilters
          enableColumnFilters
          isMultiSortEvent={() => true}
          onSortingChange={handleSortingChange}
          onColumnOrderChange={setColumnOrder}
          onColumnFiltersChange={setColumnFilters}
          meta={{
            sortIcons: {
              asc: <ArrowUpIcon />,
              desc: <ArrowDownIcon />,
            },
          }}
        />
      </div>
    </>
  );
};

export default TasksTable;
