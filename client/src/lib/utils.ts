import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import { CompoundFilterFormValues } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(s: string) {
  const date = new Date(s);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
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

function dateString(date?: Date) {
  if (!date) return "";
  const dateString = date.toISOString();
  const formattedDate = formatDate(dateString);
  return formattedDate;
}

const dateFilterSchema = z.object({
  equals: z.date().optional().catch(undefined).transform(dateString),
  before: z.date().optional().catch(undefined).transform(dateString),
  after: z.date().optional().catch(undefined).transform(dateString),
});

export function parseNotionFilter(filters: ColumnFiltersState) {
  const parsed: ColumnFiltersState = [];

  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i];
    if (
      filter.id === "dueDate" ||
      filter.id === "createdAt" ||
      filter.id === "lastEditedTime"
    ) {
      const parsedDate = dateFilterSchema.parse(filter.value);
      parsed.push({
        id: filter.id,
        value: parsedDate,
      });
    } else {
      parsed.push(filter);
    }
  }

  return parsed;
}

const propertyMap: Record<string, string> = {
  name: "rich_text",
  estimation: "number",
};

export function parseCompoundFilter(
  filters: CompoundFilterFormValues["filters"]
): Record<string, unknown>[] {
  const res = [];

  for (const filter of filters) {
    if ("property" in filter && filter.property && filter.operation) {
      res.push({
        property: filter.property,
        [propertyMap[filter.property]]: {
          [filter.operation]: filter.value,
        },
      });
    } else if ("operator" in filter) {
      res.push({
        [filter.operator]: parseCompoundFilter(filter.filters),
      });
    }
  }

  return res;
}
