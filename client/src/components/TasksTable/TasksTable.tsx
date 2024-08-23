import { createColumnHelper } from "@tanstack/react-table";
import { ITask } from "../../lib/types";
import { useFetch } from "../../lib/hooks";
import { getTasks } from "../../lib/services/task";
import Table from "../Table";
import { formatDate } from "../../lib/utils";
import Tag from "../Tag";

const TaskLoadingIndicator = () =>
  Array.from({ length: 5 }).map((_, row) => (
    <tr key={row}>
      {Array.from({ length: 9 }).map((_, col) => (
        <td key={col}>
          <span
            className="inline-block h-[20px] bg-slate-300 rounded-md"
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
    size: 200,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    size: 80,
  }),
  columnHelper.accessor("priority", {
    header: "Priority",
    size: 80,
  }),
  columnHelper.accessor("completed", {
    header: "Completed",
    size: 120,
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
    size: 150,
    cell: (props) => formatDate(props.getValue()),
  }),
  columnHelper.accessor("tags", {
    header: "Tags",
    size: 200,
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
    size: 120,
  }),
  columnHelper.accessor("description", {
    header: "Description",
    size: 200,
    cell: (props) => <span className="line-clamp-1">{props.getValue()}</span>,
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    size: 150,
    cell: (props) => formatDate(props.getValue()),
  }),
];

const TasksTable = () => {
  const { data = [], loading, error } = useFetch(getTasks);

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
      }}
    />
  );
};

export default TasksTable;
