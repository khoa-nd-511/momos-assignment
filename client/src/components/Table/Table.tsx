import {
  flexRender,
  getCoreRowModel,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import { ReactNode } from "react";

interface TableProps<TData extends any = unknown> {
  data: TData[];
  columns: TableOptions<TData>["columns"];
  loading: boolean | { value: boolean; node: ReactNode };
  tableProps?: Partial<TableOptions<TData>>;
  error?: any;
}

const Table = <TData = unknown,>(props: TableProps<TData>) => {
  const { loading, data, columns, tableProps = {} } = props;

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...tableProps,
  });

  const _loading = typeof loading === "boolean" ? loading : loading.value;
  let loadingIndicator = null;
  if (typeof loading === "object" && loading.value) {
    loadingIndicator = loading.node;
  }

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-left px-4"
                  style={{ width: `${header.getSize()}px` }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="min-h-full">
          {_loading
            ? loadingIndicator
            : table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
