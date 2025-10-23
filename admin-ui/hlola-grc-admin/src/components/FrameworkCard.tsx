import { Framework } from '@/types';
import { Layers, MoreVertical } from 'lucide-react';
import { getPriorityColor, getRiskLevelColor } from '@/utils/styling';

interface FrameworkCardProps {
  framework: Framework;
  onClick: (framework: Framework) => void;
}

export const FrameworkCard = ({ framework, onClick }: FrameworkCardProps) => {
  // Helper function to determine if description should be shown
  const shouldShowDescription = (name: string, description: string) => {
    const nameLower = name.toLowerCase();
    const descLower = description.toLowerCase();
    
    // Hide description if it's just a generic "Data protection..." and name already indicates data protection
    if (descLower.includes('data protection') && 
        (nameLower.includes('data protection') || nameLower.includes('gdpr') || nameLower.includes('ccpa'))) {
      return false;
    }
    
    // Hide if description is very short and redundant
    if (descLower.length < 50 && descLower.includes('data protection')) {
      return false;
    }
    
    return true;
  };

  return (
        <div 
          className="glass rounded-xl p-3 sm:p-4 hover:shadow-lg hover:scale-105 transition-all cursor-pointer h-full"
          onClick={() => onClick(framework)}
        >
      <div className="flex flex-col h-full">
        {/* Header with icon and title */}
        <div className="flex items-start gap-3 mb-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: framework.color + '20' }}
          >
            <Layers className="w-5 h-5" style={{ color: framework.color }} />
          </div>
          <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-hlola-blue leading-tight">{framework.name}</h3>
              {shouldShowDescription(framework.name, framework.description) && (
                <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed line-clamp-2">{framework.description}</p>
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
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{framework.region}</span>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{framework.type}</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(framework.priority)}`}>
            {framework.priority}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskLevelColor(framework.risk_level)}`}>
            {framework.risk_level}
          </span>
        </div>

            {/* Stats - Stacked vertically for compactness */}
            <div className="flex justify-between items-center mt-auto">
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-hlola-blue">{framework.actual_controls_count || 0}</div>
                <div className="text-xs text-slate-500">Controls</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-hlola-blue">{framework.actual_tasks_count || 0}</div>
                <div className="text-xs text-slate-500">Tasks</div>
              </div>
            </div>
      </div>
    </div>
  );
};
