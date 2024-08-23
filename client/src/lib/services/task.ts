import qs from "qs";
import { ITask } from "../types";

export async function getTasks({
  sorting = [],
}: {
  sorting?: { id: string; desc: boolean }[];
} = {}): Promise<ITask[]> {
  const sortObj: Record<string, string> = {};
  for (const sort of sorting) {
    sortObj[sort.id] = sort.desc ? "descending" : "ascending";
  }
  const queryString = qs.stringify(sortObj);

  const res = await fetch(`http://localhost:3000/tasks?${queryString}`);
  return res.json();
}
