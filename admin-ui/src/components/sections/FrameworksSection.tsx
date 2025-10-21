import { Framework } from '@/types';
import { FrameworkCard } from '../FrameworkCard';

interface FrameworksSectionProps {
  frameworks: Framework[];
  onFrameworkClick: (framework: Framework) => void;
}

export const FrameworksSection = ({ frameworks, onFrameworkClick }: FrameworksSectionProps) => {
  return (
    <div className="space-y-4">
      {frameworks.map((framework) => (
        <FrameworkCard
          key={framework.id}
          framework={framework}
          onClick={onFrameworkClick}
        />
      ))}
    </div>
  );
};
