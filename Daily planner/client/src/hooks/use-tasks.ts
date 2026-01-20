import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type InsertTask, type Task } from "@shared/schema";

const TASKS_QUERY_KEY = ["tasks"];
const TASKS_STORAGE_KEY = "focus_tasks";

type StoredTask = Omit<Task, "createdAt"> & { createdAt: string };

function getSeedTasks(): Task[] {
  const now = new Date();
  return [
    { id: 1, text: "Plan my day", completed: true, createdAt: now },
    { id: 2, text: "Drink water", completed: false, createdAt: now },
    { id: 3, text: "Read a book", completed: false, createdAt: now },
  ];
}

function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(TASKS_STORAGE_KEY);
  if (!raw) {
    const seeded = getSeedTasks();
    saveTasks(seeded);
    return seeded;
  }

  try {
    const parsed = JSON.parse(raw) as StoredTask[];
    return parsed.map((task) => ({
      ...task,
      createdAt: new Date(task.createdAt),
    }));
  } catch {
    const seeded = getSeedTasks();
    saveTasks(seeded);
    return seeded;
  }
}

function saveTasks(tasks: Task[]) {
  if (typeof window === "undefined") return;
  const stored: StoredTask[] = tasks.map((task) => ({
    ...task,
    createdAt: task.createdAt.toISOString(),
  }));
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(stored));
}

function getNextId(tasks: Task[]) {
  const maxId = tasks.reduce((max, task) => Math.max(max, task.id), 0);
  return maxId + 1;
}

export function useTasks() {
  return useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: async () => loadTasks(),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: InsertTask) => {
      const tasks = loadTasks();
      const newTask: Task = {
        id: getNextId(tasks),
        text: task.text,
        completed: task.completed ?? false,
        createdAt: new Date(),
      };
      const updated = [...tasks, newTask];
      saveTasks(updated);
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(TASKS_QUERY_KEY, updated);
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertTask>) => {
      const tasks = loadTasks();
      const updated = tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task,
      );
      saveTasks(updated);
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(TASKS_QUERY_KEY, updated);
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const tasks = loadTasks();
      const updated = tasks.filter((task) => task.id !== id);
      saveTasks(updated);
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(TASKS_QUERY_KEY, updated);
    },
  });
}
