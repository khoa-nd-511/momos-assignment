/// <reference types="vite/client" />

import "@tanstack/react-table"; //or vue, svelte, solid, qwik, etc.
import { HeaderContext } from "@tanstack/react-table";
import { ReactNode } from "react";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterRender?: (props: HeaderContext<TData, unknown>) => ReactNode;
    filterable?: boolean;
    filterIcon?: ReactNode;
    filterLabel?: string;
  }
}
