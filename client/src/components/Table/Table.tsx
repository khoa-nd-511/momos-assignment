import { flexRender, TableOptions, useReactTable } from "@tanstack/react-table";
import { DragEventHandler, ElementRef, ReactNode, useRef } from "react";
import HeaderCell from "./TableHeaderCell";

interface TableProps<TData = unknown> extends TableOptions<TData> {
  loading: boolean | { value: boolean; node: ReactNode };
  error?: unknown;
  sortIcons?: Record<string, ReactNode>;
  enableDragging?: boolean;
}

const Table = <TData = unknown,>(props: TableProps<TData>) => {
  const {
    loading,
    sortIcons = { asc: "🔼", desc: "🔽" },
    enableDragging,
    ...tableProps
  } = props;

  const dragFromRef = useRef<ElementRef<"th"> | null>(null);
  const dragToRef = useRef<ElementRef<"th"> | null>(null);
  const dragToOverlayRef = useRef<ElementRef<"div"> | null>(null);

  const table = useReactTable(tableProps);

  const _loading = typeof loading === "boolean" ? loading : loading.value;
  let loadingIndicator = null;
  if (typeof loading === "object" && loading.value) {
    loadingIndicator = loading.node;
  }

  const handleDragStart: DragEventHandler<HTMLTableCellElement> = (e) => {
    if (!enableDragging) return;

    dragFromRef.current = e.currentTarget;
  };

  const handleDragEnter: DragEventHandler<HTMLTableCellElement> = (e) => {
    if (!enableDragging) return;

    dragToRef.current = e.currentTarget;

    if (dragToOverlayRef.current) {
      const headerGroup = table.getHeaderGroups()[0];
      let left = 0;
      for (const header of headerGroup.headers) {
        if (header.id === e.currentTarget.getAttribute("data-id")) break;
        left += header.getSize();
      }

      dragToOverlayRef.current.style.setProperty("opacity", "100");
      dragToOverlayRef.current.style.setProperty("left", left + "px");
      dragToOverlayRef.current.style.setProperty(
        "width",
        e.currentTarget.clientWidth.toString() + "px"
      );
    }
  };

  const handleDragEnd: DragEventHandler<HTMLTableCellElement> = () => {
    if (!enableDragging || !dragFromRef.current || !dragToRef.current) return;

    if (dragToOverlayRef.current) {
      dragToOverlayRef.current.style.setProperty("opacity", "0");
      dragToOverlayRef.current.style.setProperty("width", "0px");
    }

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
      <div
        ref={dragToOverlayRef}
        className="absolute left-0 top-0 h-full border-dashed border-2 opacity-0 border-slate-500 bg-slate-600/10"
      />
      <table style={{ width: table.getTotalSize() }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sort = header.column.getIsSorted();
                const sortIcon = sort ? sortIcons[sort] : null;

                return (
                  <HeaderCell
                    key={header.id}
                    {...header}
                    loading={_loading}
                    sortIcon={sortIcon}
                    enableDragging={enableDragging}
                    onDragEnd={handleDragEnd}
                    onDragEnter={handleDragEnter}
                    onDragStart={handleDragStart}
                  />
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
                      className="px-4 py-2 align-top"
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
