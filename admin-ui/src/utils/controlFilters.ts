import { Control } from '@/types';

export const extractUniqueControlFilterValues = (controls: Control[]) => {
  const categories = Array.from(new Set(controls.map(c => c.category))).sort();
  const priorities = Array.from(new Set(controls.map(c => c.priority))).sort();
  const statuses = Array.from(new Set(controls.map(c => c.status))).sort();

  return { categories, priorities, statuses };
};
