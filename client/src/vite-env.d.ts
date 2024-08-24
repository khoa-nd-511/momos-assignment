/// <reference types="vite/client" />

import "@tanstack/react-table"; //or vue, svelte, solid, qwik, etc.
import { ReactNode } from "react";

declare module "@tanstack/react-table" {
  interface TableMeta {
    sortIcons?: {
      asc: ReactNode;
      desc: ReactNode;
    };
  }
}
