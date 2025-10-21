import { Control } from '@/types';
import { ShieldCheck, MoreVertical } from 'lucide-react';
import { getPriorityColor, getRiskLevelColor } from '@/utils/styling';

interface ControlCardProps {
  control: Control;
  onClick: (control: Control) => void;
}

export const ControlCard = ({ control, onClick }: ControlCardProps) => {
  return (
    <div 
      className="glass rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
      onClick={() => onClick(control)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-hlola-cyan rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-hlola-blue">{control.title}</h3>
            <p className="text-slate-600 text-sm">Code: {control.code}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs text-slate-500">{control.category}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(control.priority)}`}>
                {control.priority}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskLevelColor(control.riskLevel)}`}>
                {control.riskLevel}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-hlola-blue">{control.tasksCount}</div>
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
