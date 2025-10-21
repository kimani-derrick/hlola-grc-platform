import { Task } from '@/types';

export const extractUniqueTaskFilterValues = (tasks: Task[]) => {
  const categories = Array.from(new Set(tasks.map(t => t.category))).sort();
  const priorities = Array.from(new Set(tasks.map(t => t.priority))).sort();
  const statuses = Array.from(new Set(tasks.map(t => t.status))).sort();

  return { categories, priorities, statuses };
};
