import { Framework } from '@/types';
import { Layers, MoreVertical } from 'lucide-react';
import { getPriorityColor, getRiskLevelColor } from '@/utils/styling';

interface FrameworkCardProps {
  framework: Framework;
  onClick: (framework: Framework) => void;
}

export const FrameworkCard = ({ framework, onClick }: FrameworkCardProps) => {
  return (
    <div 
      className="glass rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
      onClick={() => onClick(framework)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: framework.color + '20' }}
          >
            <Layers className="w-6 h-6" style={{ color: framework.color }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-hlola-blue">{framework.name}</h3>
            <p className="text-slate-600 text-sm">{framework.description}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs text-slate-500">{framework.region}</span>
              <span className="text-xs text-slate-500">{framework.type}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(framework.priority)}`}>
                {framework.priority}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskLevelColor(framework.riskLevel)}`}>
                {framework.riskLevel}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-hlola-blue">{framework.controlsCount}</div>
            <div className="text-xs text-slate-500">Controls</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-hlola-blue">{framework.tasksCount}</div>
            <div className="text-xs text-slate-500">Tasks</div>
          </div>
          <button className="p-2 text-slate-400 hover:text-hlola-blue transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
