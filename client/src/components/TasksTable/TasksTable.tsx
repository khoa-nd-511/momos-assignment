import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { ITask } from "../../lib/types";
import { useFetch } from "../../lib/hooks";
import { getTasks } from "../../lib/services/task";
import Table from "../Table";
import { formatDate } from "../../lib/utils";
import Tag from "../Tag";
import { useEffect, useState } from "react";

const TaskLoadingIndicator = () =>
  Array.from({ length: 5 }).map((_, row) => (
    <tr key={row}>
      {Array.from({ length: 9 }).map((_, col) => (
        <td key={col} className="px-4 py-2">
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
    cell: (props) => <span className="line-clamp-1">{props.getValue()}</span>,
  }),
  columnHelper.accessor("status", {
    header: "Status",
  }),
  columnHelper.accessor("priority", {
    header: "Priority",
  }),
  columnHelper.accessor("completed", {
    header: "Completed",
    cell: (props) => (
      <input
        type="checkbox"
        checked={props.getValue()}
        onChange={() => console.log("not implemented")}
      />
    ),
  }),
  columnHelper.accessor("dueDate", {
    header: "Due Date",
    cell: (props) => formatDate(props.getValue()),
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
  }),
  columnHelper.accessor("estimation", {
    header: "Estimation",
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: (props) => <span className="line-clamp-1">{props.getValue()}</span>,
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (props) => formatDate(props.getValue()),
  }),
];

const TasksTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data = [], loading, error } = useFetch(getTasks);

  useEffect(() => {
    console.log(sorting);
  }, [sorting]);

  return (
    <Table
      data={data}
      loading={{
        value: loading,
        node: <TaskLoadingIndicator />,
      }}
      error={error}
      columns={columns}
      tableProps={{
        defaultColumn: {
          size: 150,
          minSize: 50,
          maxSize: 500,
        },
        onSortingChange: setSorting,
        state: {
          sorting,
        },
      }}
    />
  );
};

export default TasksTable;
