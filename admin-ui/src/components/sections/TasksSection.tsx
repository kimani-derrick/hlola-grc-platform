import { Control, Task } from '@/types';
import { TaskCard } from '../TaskCard';
import { CheckSquare } from 'lucide-react';

interface TasksSectionProps {
  selectedControl: Control | null;
  tasks: Task[];
}

export const TasksSection = ({ selectedControl, tasks }: TasksSectionProps) => {
  if (!selectedControl) {
    return (
      <div className="text-center py-12">
        <CheckSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-hlola-blue mb-2">Select a Control</h3>
        <p className="text-slate-600">Choose a control from the list above to view its tasks</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6 p-4 bg-gradient-to-r from-orange-400/10 to-orange-500/10 rounded-xl border border-orange-200/20">
        <h3 className="text-lg font-semibold text-hlola-blue mb-2">{selectedControl.title} Tasks</h3>
        <p className="text-slate-600 text-sm">Control: {selectedControl.code} • Framework: {selectedControl.frameworkName}</p>
      </div>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};
