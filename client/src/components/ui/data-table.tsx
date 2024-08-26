import { useRef, ElementRef, DragEventHandler, ReactNode } from "react";
import {
  Table as TanstackTable,
  flexRender,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import { Loader } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData> extends TableOptions<TData> {
  enableDragging?: boolean;
  loading?: boolean;
  error?: unknown;
  renderInfo?: (table: TanstackTable<TData>) => ReactNode;
}

export function DataTable<TData>({
  enableDragging,
  loading,
  error,
  renderInfo,
  ...tableProps
}: DataTableProps<TData>) {
  const dragFromRef = useRef<ElementRef<"th"> | null>(null);
  const dragToRef = useRef<ElementRef<"th"> | null>(null);
  const dragToOverlayRef = useRef<ElementRef<"div"> | null>(null);

  const table = useReactTable(tableProps);

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
      // TODO: either disable scroll while dragging
      // or get current scroll left and add to left

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

  if (error) {
    console.log("DataTable - error", error);
  }

  return (
    <>
      {renderInfo && renderInfo(table)}

      <div className="relative rounded-md border">
        <div
          ref={dragToOverlayRef}
          className="absolute left-0 top-0 h-full border-dashed border-2 opacity-0 border-slate-500 bg-slate-600/10"
        />
        <Table style={{ width: table.getTotalSize() }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      data-id={header.id}
                      data-index={header.index}
                      style={{ width: header.column.getSize() }}
                      draggable={enableDragging}
                      onDragEnd={handleDragEnd}
                      onDragEnter={handleDragEnter}
                      onDragStart={handleDragStart}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={tableProps.columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex p-20">
                    <Loader className="m-auto animate-spin size-16" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableProps.columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
