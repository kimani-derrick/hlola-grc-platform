'use client';

import { Framework } from '../types/frameworks';

interface FrameworkCardProps {
  framework: Framework;
  activeFrameworkTab: 'active' | 'library';
  isFrameworkActive: (id: string) => boolean;
  onCountryClick: (framework: Framework) => void;
  onAddToActive: (id: string) => void;
  controlsCount?: number;
}

export default function FrameworkCard({
  framework,
  activeFrameworkTab,
  isFrameworkActive,
  onCountryClick,
  onAddToActive,
  controlsCount
}: FrameworkCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="text-2xl">{framework.icon}</div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              framework.type === 'Legal' ? 'text-blue-600 bg-blue-100' :
              framework.type === 'Standards' ? 'text-blue-600 bg-blue-100' :
              'text-gray-600 bg-gray-100'
            }`}>
              {framework.type}
            </span>
            {activeFrameworkTab === 'library' && isFrameworkActive(framework.id) && (
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-3">{framework.name}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Compliance</span>
            <span className="text-sm font-semibold text-red-600">{framework.compliance}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full"
              style={{ width: `${framework.compliance}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600">
            Requirements {typeof controlsCount === 'number' ? controlsCount : framework.requirements}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onCountryClick(framework)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View
          </button>
          {activeFrameworkTab === 'library' && (
            isFrameworkActive(framework.id) ? (
              <button 
                disabled
                className="w-10 h-10 bg-green-500 text-white rounded-lg flex items-center justify-center cursor-not-allowed"
                title="Already Added to Active Frameworks"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            ) : (
              <button 
                onClick={() => onAddToActive(framework.id)}
                className="w-10 h-10 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
                title="Add to Active Frameworks"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
