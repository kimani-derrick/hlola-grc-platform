import { useMemo } from 'react';
import { Framework, Control, Task } from '@/types';
import { mockControls, mockTasks } from '@/services/mockData';

export const useDataFiltering = (selectedFramework: Framework | null, selectedControl: Control | null) => {
  const getCurrentControls = useMemo((): Control[] => {
    if (!selectedFramework) return [];
    return mockControls.filter(control => control.frameworkId === selectedFramework.id);
  }, [selectedFramework]);

  const getCurrentTasks = useMemo((): Task[] => {
    if (!selectedControl) return [];
    return mockTasks.filter(task => task.controlId === selectedControl.id);
  }, [selectedControl]);

  return {
    getCurrentControls,
    getCurrentTasks,
  };
};
