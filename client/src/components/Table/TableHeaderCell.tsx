import { flexRender, Header } from "@tanstack/react-table";
import { DragEventHandler, ReactNode } from "react";
import Dropdown from "../Dropdown";

interface TableHeaderCellProps<TData = unknown> extends Header<TData, unknown> {
  sortIcon: ReactNode | null;
  loading: boolean;
  enableDragging?: boolean;
  onDragStart?: DragEventHandler<HTMLTableCellElement>;
  onDragEnd?: DragEventHandler<HTMLTableCellElement>;
  onDragEnter?: DragEventHandler<HTMLTableCellElement>;
}

const TableHeaderCell = <TData,>(props: TableHeaderCellProps<TData>) => {
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

  let fitlerIcon = null;
  let filterLabel = "Search";

  if (column.getCanFilter() && column.columnDef.meta) {
    filterLabel = column.columnDef.meta.filterLabel
      ? column.columnDef.meta.filterLabel
      : filterLabel;
    fitlerIcon = column.columnDef.meta.filterIcon;
  }

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
        {column.columnDef.meta?.filterable ? (
          <Dropdown>
            <Dropdown.Triggerer>
              <span role="botton">&nbsp;{fitlerIcon}</span>
            </Dropdown.Triggerer>

            <Dropdown.Content>
              <label htmlFor={id}>{filterLabel}</label>
              {column.columnDef.meta?.filterRender?.(getContext())}
            </Dropdown.Content>
          </Dropdown>
        ) : null}
        &nbsp;{sortIcon}
      </div>
    </th>
  );
};

export default TableHeaderCell;
