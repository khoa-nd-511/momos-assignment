import { createColumnHelper } from "@tanstack/react-table";
import { ITask } from "../../lib/types";
import { useFetch } from "../../lib/hooks";
import { getTasks } from "../../lib/services/task";
import Table from "../Table";
import { formatDate } from "../../lib/utils";
import Tag from "../Tag";

const columnHelper = createColumnHelper<ITask>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
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
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (props) => formatDate(props.getValue()),
  }),
];

const TasksTable = () => {
  const { data = [], loading, error } = useFetch(getTasks);

  return (
    <Table
      data={data}
      loading={loading}
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
