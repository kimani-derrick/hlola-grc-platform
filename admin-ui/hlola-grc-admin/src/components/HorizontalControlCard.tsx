import { Control } from '@/types';
import { Shield, MoreVertical } from 'lucide-react';
import { getPriorityColor } from '@/utils/styling';

interface HorizontalControlCardProps {
  control: Control;
  onClick: (control: Control) => void;
}

export const HorizontalControlCard = ({ control, onClick }: HorizontalControlCardProps) => {
  return (
    <div 
      className="glass rounded-xl p-4 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer border border-slate-200/50"
      onClick={() => onClick(control)}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
          style={{ backgroundColor: '#10b981' + '20' }}
        >
          <Shield className="w-6 h-6" style={{ color: '#10b981' }} />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Description */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-hlola-blue leading-tight mb-2">
              {control.title}
            </h3>
            {control.description && (
              <p className="text-slate-600 text-sm leading-relaxed">
                {control.description}
              </p>
            )}
          </div>

          {/* Code */}
          {control.control_id && (
            <div className="text-sm text-slate-500 mb-3">
              <span className="font-medium">Code:</span>{' '}
              <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs">
                {control.control_id}
              </span>
            </div>
          )}

          {/* Tags and Stats Row */}
          <div className="flex items-center justify-between">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {control.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(control.priority)}`}>
                {control.priority}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                control.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {control.status}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 ml-4">
              <div className="text-center">
                <div className="text-xl font-bold text-hlola-blue">{control.tasksCount || 0}</div>
                <div className="text-xs text-slate-500">Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-hlola-blue">{control.complianceScore || 0}%</div>
                <div className="text-xs text-slate-500">Score</div>
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
