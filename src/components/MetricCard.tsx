'use client';

interface MetricCardProps {
  value: number;
  label: string;
  progress: number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  color: 'green' | 'orange' | 'red' | 'cyan';
}

export default function MetricCard({ 
  value, 
  label, 
  progress, 
  change, 
  changeType,
  color 
}: MetricCardProps) {
  const colorClasses = {
    green: {
      bg: 'bg-green-50',
      progress: 'bg-green-500',
      dot: 'bg-green-500',
      text: 'text-green-600'
    },
    orange: {
      bg: 'bg-orange-50',
      progress: 'bg-orange-500',
      dot: 'bg-orange-500',
      text: 'text-orange-600'
    },
    red: {
      bg: 'bg-red-50',
      progress: 'bg-red-500',
      dot: 'bg-red-500',
      text: 'text-red-600'
    },
    cyan: {
      bg: 'bg-cyan-50',
      progress: 'bg-cyan-500',
      dot: 'bg-cyan-500',
      text: 'text-cyan-600'
    }
  };

  const changeIcon = changeType === 'positive' ? '↗' : changeType === 'negative' ? '↘' : '→';
  const changeColor = changeType === 'positive' ? 'text-green-600' : changeType === 'negative' ? 'text-red-600' : 'text-gray-600';

  return (
    <div className={`glass-card rounded-2xl p-6 hover-lift ${colorClasses[color].bg} border-l-4`} 
         style={{ borderLeftColor: colorClasses[color].dot.replace('bg-', '#') === 'bg-green-500' ? '#22c55e' : 
                                   colorClasses[color].dot.replace('bg-', '#') === 'bg-orange-500' ? '#f97316' :
                                   colorClasses[color].dot.replace('bg-', '#') === 'bg-red-500' ? '#ef4444' : '#06b6d4' }}>
      
      <div className="flex items-center justify-between mb-4">
        <div className={`w-4 h-4 rounded-full ${colorClasses[color].dot}`}></div>
        <div className={`text-sm font-medium ${changeColor} flex items-center gap-1`}>
          <span>{changeIcon}</span>
          <span>{change}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className={`text-3xl font-bold ${colorClasses[color].text} mb-1`}>
          {value}
        </div>
        <div className="text-gray-600 text-sm font-medium">{label}</div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Progress</span>
          <span className={`text-sm font-semibold ${colorClasses[color].text}`}>
            {progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${colorClasses[color].progress} transition-all duration-1000 ease-out`}
            style={{ 
              width: `${progress}%`,
              boxShadow: `0 0 8px ${colorClasses[color].progress.includes('green') ? '#22c55e40' : 
                                   colorClasses[color].progress.includes('orange') ? '#f9731640' :
                                   colorClasses[color].progress.includes('red') ? '#ef444440' : '#06b6d440'}`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
