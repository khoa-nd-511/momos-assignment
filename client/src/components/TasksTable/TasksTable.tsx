import { useEffect, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import {
  ColumnFiltersState,
  getCoreRowModel,
  OnChangeFn,
  SortingState,
} from "@tanstack/react-table";

import { useLoader } from "@/lib/hooks";
import { loadTasks } from "@/lib/services/task";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/TasksTable/columns";
import { Button } from "@/components/ui/button";
import AdvancedFilterButton from "@/components/TasksTable/AdvancedFilterButton";

const TasksTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>(() => {
    return columns.map((c) => c.accessorKey);
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [compoundFilter, setCompoundFilter] = useState<unknown>(undefined);

  const { data = [], loading, error, load } = useLoader(loadTasks);

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    if (loading) return;
    setSorting(updater);
    setCompoundFilter(undefined);
  };
  const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (
    updater
  ) => {
    if (loading) return;
    setColumnFilters(updater);
    setCompoundFilter(undefined);
  };

  useEffect(() => {
    load({ sorts: sorting, filters: columnFilters, compoundFilter });
  }, [sorting, columnFilters, load, compoundFilter]);

  return (
    <div className="overflow-x-auto mt-5">
      <DataTable
        // custom props
        enableDragging
        loading={loading}
        error={error}
        renderInfo={({ getState, resetColumnFilters }) => {
          const { columnFilters } = getState();
          return (
            <div className="flex items-center justify-between w-full mb-5">
              {loading ? (
                <div>Loading tasks...</div>
              ) : (
                <div>{data.length} items</div>
              )}

              <div className="flex gap-2">
                <AdvancedFilterButton
                  disabled={loading}
                  compoundFilter={compoundFilter}
                  onFilterChange={(filter) => {
                    resetColumnFilters();
                    setCompoundFilter(filter);
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    resetColumnFilters();
                    setCompoundFilter(undefined);
                  }}
                  disabled={
                    loading || (!columnFilters.length && !compoundFilter)
                  }
                >
                  Clear filters
                </Button>
              </div>
            </div>
          );
        }}
        // table props
        getCoreRowModel={getCoreRowModel()}
        data={data}
        columns={columns}
        defaultColumn={{
          size: 150,
          minSize: 50,
          maxSize: 500,
        }}
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
        onColumnFiltersChange={handleColumnFiltersChange}
        meta={{
          sortIcons: {
            asc: <ArrowUpIcon />,
            desc: <ArrowDownIcon />,
          },
        }}
      />
    </div>
  );
};

export default TasksTable;
