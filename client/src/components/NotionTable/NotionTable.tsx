interface NotionTableProps<TData = unknown> {
  data: TData[];
}

const NotionTable = <TData = unknown,>(props: NotionTableProps<TData>) => {
  const { data } = props;

  console.log("data", data);
  return <div>NotionTable</div>;
};

export default NotionTable;
