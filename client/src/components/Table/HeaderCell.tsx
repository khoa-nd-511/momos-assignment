import { flexRender, Header } from "@tanstack/react-table";
import { DragEventHandler, ReactNode } from "react";

interface HeaderCellProps<TData = unknown> extends Header<TData, unknown> {
  sortIcon: ReactNode | null;
  loading: boolean;
  enableDragging?: boolean;
  onDragStart?: DragEventHandler<HTMLTableCellElement>;
  onDragEnd?: DragEventHandler<HTMLTableCellElement>;
  onDragEnter?: DragEventHandler<HTMLTableCellElement>;
}

const HeaderCell = <TData,>(props: HeaderCellProps<TData>) => {
  const {
    loading,
    id,
    index,
    column,
    isPlaceholder,
    sortIcon,
    enableDragging,
    getContext,
    getSize,
    onDragEnd,
    onDragEnter,
    onDragStart,
  } = props;

  let cursor = "";

  if (loading) {
    cursor = "cursor-not-allowed";
  } else if (column.getCanSort()) {
    cursor = "cursor-pointer";
  }

  return (
    <th
      data-id={id}
      data-index={index}
      className="text-left bg-slate-100"
      style={{ width: getSize() }}
      draggable={enableDragging}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragEnter={onDragEnter}
    >
      <div
        className={`p-4 ${cursor}`}
        onClick={column.getToggleSortingHandler()}
      >
        {isPlaceholder
          ? null
          : flexRender(column.columnDef.header, getContext())}
        &nbsp;{sortIcon}
      </div>
    </th>
  );
};

export default HeaderCell;
