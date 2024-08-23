interface NotionTableProps<TData extends any = unknown> {
  loading?: boolean;
  data?: TData[];
  error?: any;
}

const NotionTable = <TData = unknown,>(props: NotionTableProps<TData>) => {
  console.log(props);
  return <div>NotionTable</div>;
};

export default NotionTable;
