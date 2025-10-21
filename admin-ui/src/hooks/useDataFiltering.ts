import { useMemo } from 'react';
import { Framework, Control, Task } from '@/types';

export const useDataFiltering = (
  selectedFramework: Framework | null, 
  selectedControl: Control | null,
  allControls: Control[] = [],
  allTasks: Task[] = []
) => {
  const getCurrentControls = useMemo((): Control[] => {
    if (!selectedFramework) return [];
    return allControls.filter(control => control.framework_id === selectedFramework.id);
  }, [selectedFramework, allControls]);

  const getCurrentTasks = useMemo((): Task[] => {
    if (!selectedControl) return [];
    return allTasks.filter(task => task.control_id === selectedControl.id);
  }, [selectedControl, allTasks]);

  return {
    getCurrentControls,
    getCurrentTasks,
  };
};
