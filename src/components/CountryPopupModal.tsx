'use client';

interface Framework {
  id: string;
  name: string;
  description: string;
  compliance: number;
  controls: number;
  requirements: number;
  icon: string;
  type: 'Legal' | 'Other' | 'Standards';
}

interface CountryPopupModalProps {
  framework: Framework | null;
  isOpen: boolean;
  onClose: () => void;
  onViewControls: () => void;
  controlsCount?: number | null;
}

export default function CountryPopupModal({ 
  framework, 
  isOpen, 
  onClose, 
  onViewControls,
  controlsCount = null
}: CountryPopupModalProps) {
  if (!isOpen || !framework) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{framework.icon}</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{framework.name}</h2>
              <p className="text-sm text-gray-600">Framework details and compliance information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Compliance Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compliance Status
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${framework.compliance}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {framework.compliance}%
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <p className="text-gray-900">{framework.description}</p>
          </div>

          {/* Requirements Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            {/* Total Requirements */}
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-purple-600 text-sm font-medium mb-1">
                Total Requirements
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {typeof controlsCount === 'number' ? controlsCount : framework.requirements}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-blue-600 text-sm font-medium mb-1">
                Controls
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {typeof controlsCount === 'number' ? controlsCount : framework.controls}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            Close
          </button>
          <button
            onClick={onViewControls}
            className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            View Controls
          </button>
        </div>
      </div>
    </div>
  );
}
