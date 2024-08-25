import { Column, Table } from "@tanstack/react-table";

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
