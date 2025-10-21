import { Stats } from '@/types';
import { Layers, ShieldCheck, CheckSquare, CheckCircle } from 'lucide-react';

interface StatsCardsProps {
  stats: Stats;
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Total Frameworks</p>
            <p className="text-3xl font-bold text-hlola-blue">{stats.totalFrameworks}</p>
          </div>
          <div className="w-12 h-12 bg-hlola-gradient-strong rounded-xl flex items-center justify-center">
            <Layers className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Total Controls</p>
            <p className="text-3xl font-bold text-hlola-blue">{stats.totalControls}</p>
          </div>
          <div className="w-12 h-12 bg-hlola-cyan rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Total Tasks</p>
            <p className="text-3xl font-bold text-hlola-blue">{stats.totalTasks}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl flex items-center justify-center">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Completed Tasks</p>
            <p className="text-3xl font-bold text-hlola-blue">{stats.completedTasks}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
