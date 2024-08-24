import { useEffect, useState } from "react";
import {
  ColumnFiltersState,
  createColumnHelper,
  getCoreRowModel,
  OnChangeFn,
  SortingState,
} from "@tanstack/react-table";

import { ITask } from "../../lib/types";
import { useLoader } from "../../lib/hooks";
import { getTasks } from "../../lib/services/task";
import Table from "../Table";
import { formatDate } from "../../lib/utils";
import Tag from "../Tag";

const TaskLoadingIndicator = () =>
  Array.from({ length: 5 }).map((_, row) => (
    <tr key={row}>
      {Array.from({ length: 9 }).map((_, col) => (
        <td key={col} className="p-4">
          <span
            className="inline-block h-[26px] bg-slate-300 rounded-md"
            style={{ width: Math.random() * 50 + 50 }}
          />
        </td>
      ))}
    </tr>
  ));

const columnHelper = createColumnHelper<ITask>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (props) => <span className="line-clamp-2">{props.getValue()}</span>,
    size: 150,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    size: 120,
  }),
  columnHelper.accessor("priority", {
    header: "Priority",
    size: 120,
  }),
  columnHelper.accessor("completed", {
    header: "Completed",
    cell: (props) => (
      <input
        type="checkbox"
        checked={props.getValue()}
        onChange={() => alert("not implemented")}
      />
    ),
    size: 140,
  }),
  columnHelper.accessor("dueDate", {
    header: "Due Date",
    cell: (props) => formatDate(props.getValue()),
    size: 130,
  }),
  columnHelper.accessor("tags", {
    header: "Tags",
    cell: (props) => (
      <div className="flex flex-wrap gap-2 w-[200px]">
        {props.getValue().map(({ id, name }) => (
          <Tag key={id} label={name} />
        ))}
      </div>
    ),
    size: 250,
    enableSorting: false,
  }),
  columnHelper.accessor("estimation", {
    header: "Estimation",
    size: 140,
  }),
  columnHelper.accessor("description", {
    header: "Description",
    enableSorting: false,
    cell: (props) => <span className="line-clamp-1">{props.getValue()}</span>,
    size: 150,
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (props) => formatDate(props.getValue()),
    size: 130,
  }),
];

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
  }, [sorting, columnFilters]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center space-between">
        {loading ? <span>loading...</span> : <span>{data.length} items</span>}
        {columnFilters.length > 0 ? <button>clear filters</button> : null}
      </div>
      <Table
        // custom props
        enableDragging
        loading={{
          value: loading,
          node: <TaskLoadingIndicator />,
        }}
        error={error}
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
        enableFilters
        enableSorting
        enableMultiSort
        isMultiSortEvent={() => true}
        onSortingChange={handleSortingChange}
        onColumnOrderChange={setColumnOrder}
        onColumnFiltersChange={setColumnFilters}
      />
    </div>
  );
};

export default TasksTable;
