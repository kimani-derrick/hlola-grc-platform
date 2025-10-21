import { Control } from '@/types';
import { Shield, MoreVertical } from 'lucide-react';
import { getPriorityColor } from '@/utils/styling';

interface ControlCardProps {
  control: Control;
  onClick: (control: Control) => void;
}

export const ControlCard = ({ control, onClick }: ControlCardProps) => {
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
      onClick={() => onClick(control)}
    >
      <div className="flex flex-col h-full">
        {/* Header with icon and title */}
        <div className="flex items-start gap-3 mb-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#10b981' + '20' }}
          >
            <Shield className="w-5 h-5" style={{ color: '#10b981' }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-hlola-blue leading-tight line-clamp-2">{control.title}</h3>
            {shouldShowDescription(control.title, control.description) && (
              <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed line-clamp-2">{control.description}</p>
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

        {/* Code */}
        {control.control_id && (
          <div className="text-xs text-slate-500 mb-2">
            Code: <span className="font-mono">{control.control_id}</span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{control.category}</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(control.priority)}`}>
            {control.priority}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            control.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {control.status}
          </span>
        </div>

        {/* Stats - Stacked vertically for compactness */}
        <div className="flex justify-between items-center mt-auto">
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-hlola-blue">{control.tasksCount || 0}</div>
            <div className="text-xs text-slate-500">Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-hlola-blue">{control.complianceScore || 0}%</div>
            <div className="text-xs text-slate-500">Score</div>
          </div>
        </div>
      </div>
    </div>
  );
};