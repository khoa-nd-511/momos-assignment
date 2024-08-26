import { ColumnFiltersState, SortingState } from "@tanstack/react-table";

import { ITask } from "../types";
import { constructQueryString, parseNotionFilter } from "../utils";

export async function loadTasks({
  sorts = [],
  filters = [],
  compoundFilter,
}: {
  sorts?: SortingState;
  filters?: ColumnFiltersState;
  compoundFilter?: unknown;
} = {}): Promise<ITask[]> {
  if (compoundFilter) {
    const res = await fetch(`http://localhost:3000/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the request content type to JSON
      },
      body: JSON.stringify(compoundFilter),
    });

    return res.json();
  }

  const sortObj: Record<string, string> = {};
  for (const sort of sorts) {
    sortObj[sort.id] = sort.desc ? "descending" : "ascending";
  }

  const parsedFilters = parseNotionFilter(filters);
  const queryString = constructQueryString(sorts, parsedFilters);

  const res = await fetch(`http://localhost:3000/tasks${queryString}`);
  return res.json();
}
