import { Task } from '@/types';
import { CheckSquare, MoreVertical, Clock, Calendar } from 'lucide-react';
import { getPriorityColor } from '@/utils/styling';

interface HorizontalTaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

export const HorizontalTaskCard = ({ task, onClick }: HorizontalTaskCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in_progress':
        return '⏳';
      case 'pending':
        return '⏸️';
      default:
        return '○';
    }
  };

  return (
    <div 
      className="glass rounded-xl p-4 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer border border-slate-200/50"
      onClick={() => onClick(task)}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
          style={{ backgroundColor: '#8b5cf6' + '20' }}
        >
          <CheckSquare className="w-6 h-6" style={{ color: '#8b5cf6' }} />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Description */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-hlola-blue leading-tight mb-2">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-slate-600 text-sm leading-relaxed">
                {task.description}
              </p>
            )}
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">
              <Calendar className="w-4 h-4" />
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}

          {/* Tags and Stats Row */}
          <div className="flex items-center justify-between">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {task.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(task.status)}`}>
                <span>{getStatusIcon(task.status)}</span>
                {task.status}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 ml-4">
              <div className="text-center">
                <div className="flex items-center gap-1 text-xl font-bold text-hlola-blue">
                  <Clock className="w-4 h-4" />
                  {task.estimated_hours || 0}h
                </div>
                <div className="text-xs text-slate-500">Est. Time</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-hlola-blue">{task.progress || 0}%</div>
                <div className="text-xs text-slate-500">Progress</div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Button */}
        <button 
          className="p-2 text-slate-400 hover:text-hlola-blue hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Add menu functionality
          }}
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
