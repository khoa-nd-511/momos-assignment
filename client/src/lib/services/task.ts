import { ColumnFiltersState, SortingState } from "@tanstack/react-table";

import { ITask } from "../types";
import { constructQueryString, parseNotionFilter } from "../utils";

export async function getTasks({
  sorts = [],
  filters = [],
}: {
  sorts?: SortingState;
  filters?: ColumnFiltersState;
} = {}): Promise<ITask[]> {
  const sortObj: Record<string, string> = {};
  for (const sort of sorts) {
    sortObj[sort.id] = sort.desc ? "descending" : "ascending";
  }

  const parsedFilters = parseNotionFilter(filters);
  const queryString = constructQueryString(sorts, parsedFilters);

  const res = await fetch(`http://localhost:3000/tasks${queryString}`);
  return res.json();
}
