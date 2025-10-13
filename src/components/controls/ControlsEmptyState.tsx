import React from 'react';

interface ControlsEmptyStateProps {
  message?: string;
  description?: string;
}

export default function ControlsEmptyState({ 
  message = "No controls found", 
  description = "Try adjusting your filters or search terms." 
}: ControlsEmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 text-6xl mb-4">📋</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
