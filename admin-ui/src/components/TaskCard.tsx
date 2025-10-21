import { Task } from '@/types';
import { CheckSquare, MoreVertical } from 'lucide-react';
import { getPriorityColor, getStatusColor } from '@/utils/styling';

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <div className="glass rounded-xl p-6 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl flex items-center justify-center">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-hlola-blue">{task.title}</h3>
            <p className="text-slate-600 text-sm">{task.description}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs text-slate-500">{task.category}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-semibold text-hlola-blue">{task.estimatedHours}h</div>
            <div className="text-xs text-slate-500">Estimated</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-hlola-blue">{task.dueDate}</div>
            <div className="text-xs text-slate-500">Due Date</div>
          </div>
          <button className="p-2 text-slate-400 hover:text-hlola-blue transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
