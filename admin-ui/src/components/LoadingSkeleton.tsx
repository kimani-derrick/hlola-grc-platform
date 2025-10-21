import { Layers } from 'lucide-react';

interface SkeletonCardProps {
  className?: string;
}

const SkeletonCard = ({ className = '' }: SkeletonCardProps) => (
  <div className={`glass rounded-xl p-4 animate-pulse ${className}`}>
    <div className="flex flex-col h-full">
      {/* Header with icon and title */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
          <Layers className="w-5 h-5 text-slate-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-full mb-1"></div>
          <div className="h-3 bg-slate-200 rounded w-2/3"></div>
        </div>
        <div className="w-6 h-6 bg-slate-200 rounded flex-shrink-0"></div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        <div className="h-6 bg-slate-200 rounded w-16"></div>
        <div className="h-6 bg-slate-200 rounded w-20"></div>
        <div className="h-6 bg-slate-200 rounded w-14"></div>
        <div className="h-6 bg-slate-200 rounded w-12"></div>
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center mt-auto">
        <div className="text-center">
          <div className="h-6 bg-slate-200 rounded w-8 mb-1"></div>
          <div className="h-3 bg-slate-200 rounded w-12"></div>
        </div>
        <div className="text-center">
          <div className="h-6 bg-slate-200 rounded w-8 mb-1"></div>
          <div className="h-3 bg-slate-200 rounded w-10"></div>
        </div>
      </div>
    </div>
  </div>
);

interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

export const LoadingSkeleton = ({ count = 18, className = '' }: LoadingSkeletonProps) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
