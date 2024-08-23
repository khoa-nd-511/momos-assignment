import { ITask } from "../types";

export async function getTasks(): Promise<ITask[]> {
  const res = await fetch("http://localhost:3000/tasks");
  return res.json();
}
