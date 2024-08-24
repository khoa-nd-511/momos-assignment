import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(s: string) {
  const date = new Date(s);
  return `${date.getFullYear()}-${date
    .getMonth()
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

export function constructQueryString(
  sorts: SortingState = [],
  filters: ColumnFiltersState = []
) {
  const params = new URLSearchParams();

  // Add filters to query string
  filters.forEach((filter) => {
    const value = filter.value;
    if (value && typeof value === "object") {
      Object.entries(value).forEach(([operation, operationVal]) => {
        params.append(`filter[${filter.id}][${operation}]`, operationVal);
      });
    } else if (typeof value === "string") {
      params.append(`filter[${filter.id}]`, value);
    }
  });

  // Add sorts to query string
  if (sorts.length > 0) {
    params.append(
      "sort",
      sorts.map(({ id, desc }) => (desc ? `-${id}` : id)).join(",")
    );
  }

  return `?${params.toString()}`;
}
