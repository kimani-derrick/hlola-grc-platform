import React from 'react';

interface ControlsHeaderProps {
  activeFrameworkCount: number;
}

export default function ControlsHeader({ activeFrameworkCount }: ControlsHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compliance Controls</h1>
          <p className="text-gray-600 mt-2">Track and complete specific tasks required by your active frameworks</p>
          
          {/* Active frameworks info */}
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Showing controls for {activeFrameworkCount} active framework{activeFrameworkCount !== 1 ? 's' : ''}. 
                  Controls are automatically loaded from your assigned frameworks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
