import { HeaderContext } from "@tanstack/react-table";
import { useState } from "react";

type TableFilterInputProps<TData> = HeaderContext<TData, unknown>;

const TableFilterInput = <TData,>(props: TableFilterInputProps<TData>) => {
  const { table, header } = props;

  const { getState } = table;
  const { columnFilters } = getState();
  const { id } = header;

  const filter = columnFilters.find((i) => i.id === id);

  const [value, setValue] = useState(String(filter?.value || ""));

  return (
    <input
      id={id}
      value={value}
      autoFocus
      className="focus:ring-2 font-normal pl-2"
      autoComplete="off"
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          table.setColumnFilters((filters) => {
            if (!filters.find((filter) => filter.id === id)) {
              return [...filters, { id, value: value.trim() }];
            }
            return filters.map((filter) => ({
              ...filter,
              value: filter.id === id ? value.trim() : filter.value,
            }));
          });
        }
      }}
    />
  );
};

export default TableFilterInput;
