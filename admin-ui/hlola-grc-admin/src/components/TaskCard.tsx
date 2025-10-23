import { Task } from '@/types';
import { CheckSquare, MoreVertical } from 'lucide-react';
import { getPriorityColor } from '@/utils/styling';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
  // Helper function to determine if description should be shown
  const shouldShowDescription = (title: string, description?: string) => {
    if (!description) return false;
    
    const titleLower = title.toLowerCase();
    const descLower = description.toLowerCase();
    
    // Hide description if it's very short and redundant
    if (descLower.length < 30) {
      return false;
    }
    
    // Hide if description is just a repetition of the title
    if (descLower.includes(titleLower) && descLower.length < 100) {
      return false;
    }
    
    return true;
  };

  return (
    <div 
      className="glass rounded-xl p-3 sm:p-4 hover:shadow-lg hover:scale-105 transition-all cursor-pointer h-full"
      onClick={() => onClick(task)}
    >
      <div className="flex flex-col h-full">
        {/* Header with icon and title */}
        <div className="flex items-start gap-3 mb-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#8b5cf6' + '20' }}
          >
            <CheckSquare className="w-5 h-5" style={{ color: '#8b5cf6' }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-hlola-blue leading-tight line-clamp-2">{task.title}</h3>
            {shouldShowDescription(task.title, task.description) && (
              <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed line-clamp-2">{task.description}</p>
            )}
          </div>
          <button 
            className="p-1 text-slate-400 hover:text-hlola-blue transition-colors flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Add menu functionality
            }}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{task.category}</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            task.status === 'completed' ? 'bg-green-100 text-green-700' : 
            task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 
            'bg-gray-100 text-gray-700'
          }`}>
            {task.status}
          </span>
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div className="text-xs text-slate-500 mb-3">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}

        {/* Stats - Stacked vertically for compactness */}
        <div className="flex justify-between items-center mt-auto">
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-hlola-blue">{task.estimated_hours || 0}h</div>
            <div className="text-xs text-slate-500">Est. Time</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-hlola-blue">{task.progress || 0}%</div>
            <div className="text-xs text-slate-500">Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
};