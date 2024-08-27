import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import { CompoundFilterFormValues } from "@/lib/types";
import { notionCompoundFilterSchema } from "@/lib/validation";

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

export function parseCompoundFilterFormValues(
  filters: CompoundFilterFormValues["filters"]
): Record<string, unknown>[] {
  const res = [];

  for (const filter of filters) {
    if (
      "property" in filter &&
      "operation" in filter &&
      "propertyType" in filter &&
      "value" in filter &&
      typeof filter.propertyType === "string" &&
      typeof filter.operation === "string"
    ) {
      res.push({
        property: filter.property,
        [filter.propertyType]: {
          [filter.operation]: filter.value,
        },
      });
    } else if (
      "filters" in filter &&
      "operator" in filter &&
      Array.isArray(filter.filters) &&
      typeof filter.operator === "string"
    ) {
      res.push({
        [filter.operator]: parseCompoundFilterFormValues(filter.filters),
      });
    }
  }

  return res;
}

function parseFilter(data: z.infer<typeof notionCompoundFilterSchema>) {
  if ("or" in data) {
    return {
      operator: "or",
      filters: parseCompoundFilter(data.or),
    };
  } else if ("and" in data) {
    return {
      operator: "and",
      filters: parseCompoundFilter(data.and),
    };
  } else {
    const propertyType = Object.keys(data).find(
      (key) => key !== "property"
    ) as keyof typeof data;
    if (!propertyType) return null;
    const objObject = data[propertyType] as unknown as object;
    const operation = Object.keys(objObject)[0];
    const value = objObject[operation as keyof object];
    return {
      property: data.property,
      propertyType,
      operation,
      value,
    };
  }
}

export function parseCompoundFilter(
  params: unknown
): CompoundFilterFormValues["filters"] {
  if (!params) return [];
  if (!Array.isArray(params)) return [];

  const res = [];

  for (let i = 0; i < params.length; i++) {
    const parsed = notionCompoundFilterSchema.safeParse(params[i]);
    if (!parsed.data) {
      continue;
    }
    const filter = parseFilter(parsed.data);
    if (!filter) {
      continue;
    }
    res.push(filter);
  }

  return res as CompoundFilterFormValues["filters"];
}
