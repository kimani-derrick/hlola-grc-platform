import { Framework, Control } from '@/types';
import { ControlCard } from '../ControlCard';
import { ShieldCheck } from 'lucide-react';

interface ControlsSectionProps {
  selectedFramework: Framework | null;
  controls: Control[];
  onControlClick: (control: Control) => void;
}

export const ControlsSection = ({ selectedFramework, controls, onControlClick }: ControlsSectionProps) => {
  if (!selectedFramework) {
    return (
      <div className="text-center py-12">
        <ShieldCheck className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-hlola-blue mb-2">Select a Framework</h3>
        <p className="text-slate-600">Choose a framework from the list above to view its controls</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6 p-4 bg-hlola-cyan/10 rounded-xl border border-hlola-cyan/20">
        <h3 className="text-lg font-semibold text-hlola-blue mb-2">{selectedFramework.name} Controls</h3>
        <p className="text-slate-600 text-sm">{selectedFramework.description}</p>
      </div>
      {controls.map((control) => (
        <ControlCard
          key={control.id}
          control={control}
          onClick={onControlClick}
        />
      ))}
    </div>
  );
};
