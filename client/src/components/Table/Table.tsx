import {
  flexRender,
  getCoreRowModel,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import { DragEventHandler, ElementRef, ReactNode, useRef } from "react";

interface TableProps<TData extends any = unknown> {
  data: TData[];
  columns: TableOptions<TData>["columns"];
  loading: boolean | { value: boolean; node: ReactNode };
  tableProps?: Partial<TableOptions<TData>>;
  error?: any;
  sortIcons?: Record<string, ReactNode>;
  enableDragging?: boolean;
}

const Table = <TData = unknown,>(props: TableProps<TData>) => {
  const {
    loading,
    data,
    columns,
    tableProps = {},
    sortIcons = { asc: " 🔼", desc: " 🔽" },
    enableDragging,
  } = props;

  const dragFromRef = useRef<ElementRef<"th"> | null>(null);
  const dragToRef = useRef<ElementRef<"th"> | null>(null);

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

  const handleDragStart: DragEventHandler<HTMLTableCellElement> = (e) => {
    if (!enableDragging) return;

    dragFromRef.current = e.currentTarget;
    e.currentTarget.style.setProperty("border", "2px dashed #888");
  };

  const handleDragEnter: DragEventHandler<HTMLTableCellElement> = (e) => {
    if (!enableDragging) return;

    e.currentTarget.style.setProperty("border", "2px dashed #888");

    dragToRef.current = e.currentTarget;
  };

  const handleDragLeave: DragEventHandler<HTMLTableCellElement> = (e) => {
    if (!enableDragging) return;

    if (e.currentTarget === dragFromRef.current) return;

    e.currentTarget.style.setProperty("border", null);
  };

  const handleDragEnd: DragEventHandler<HTMLTableCellElement> = () => {
    if (!enableDragging || !dragFromRef.current || !dragToRef.current) return;

    const from = dragFromRef.current.getAttribute("data-index");
    const to = dragToRef.current.getAttribute("data-index");

    if (!from || !to || from === to) return;

    dragFromRef.current.style.setProperty("border", null);
    dragFromRef.current = null;

    const fromIndex = Number(from);
    const toIndex = Number(to);

    table.setColumnOrder((orderState) => {
      const newState = [];
      for (let i = 0; i < orderState.length; i++) {
        if (i === fromIndex) continue;

        if (i === toIndex && fromIndex > toIndex) {
          newState.push(orderState[fromIndex]);
        }

        newState.push(orderState[i]);

        if (i === toIndex && fromIndex < toIndex) {
          newState.push(orderState[fromIndex]);
        }
      }
      return newState;
    });
  };

  return (
    <div className="relative">
      <table style={{ width: table.getTotalSize() }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, headerIndex) => {
                const sort = header.column.getIsSorted();
                const sortIcon = sort ? sortIcons[sort] : null;
                let cursor = "";

                if (_loading) {
                  cursor = "cursor-not-allowed";
                } else if (header.column.getCanSort()) {
                  cursor = "cursor-pointer";
                }

                return (
                  <th
                    key={header.id}
                    data-id={header.id}
                    data-index={headerIndex}
                    className="text-left p-4 bg-slate-100"
                    style={{ width: header.getSize() }}
                    draggable={enableDragging}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                  >
                    <div
                      className={`${cursor}`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}

                      {sortIcon}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody className="min-h-full">
          {_loading
            ? loadingIndicator
            : table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-2"
                      style={{ width: cell.column.getSize() }}
                    >
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
