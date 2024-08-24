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

export type TTaskFilter = {
  id: string;
  value: Record<string, string> | string;
};
