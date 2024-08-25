import { formSchema } from "@/lib/validation";
import { Column, Table } from "@tanstack/react-table";
import { z } from "zod";

export interface ITag {
  id: string;
  name: string;
}

export interface ITask {
  name: string;
  description: string;
  status: string;
  priority: string;
  estimation: number;
  dueDate: string;
  createdAt: string;
  completed: boolean;
  tags: ITag[];
}

export type NotionFilterProps<TData, TValue> = {
  fieldName: string;
  table: Table<TData>;
  column: Column<TData, TValue>;
};

export type CompoundFilterFormValues = z.infer<typeof formSchema>;
