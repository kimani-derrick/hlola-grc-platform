'use client';

import { ControlDetail } from '../types/frameworks';

interface ControlDetailsModalProps {
  control: ControlDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ControlDetailsModal({ control, isOpen, onClose }: ControlDetailsModalProps) {
  if (!isOpen || !control) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                {control.id}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                {control.article}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{control.title}</h3>
          <p className="text-lg text-gray-600 mt-1">{control.subtitle}</p>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
            <p className="text-gray-600">{control.description}</p>
            <p className="text-gray-600 mt-3">{control.detailedDescription}</p>
          </div>

          {/* Compliance Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Compliance Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-gray-900">{control.compliance.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-teal-500 h-2 rounded-full"
                    style={{ width: `${control.compliance.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Status</div>
                <div className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${
                  control.compliance.status === 'In Progress' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : control.compliance.status === 'Not Started'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {control.compliance.status}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
              <div>Last Updated: {control.compliance.lastUpdated}</div>
              <div>Next Review: {control.compliance.nextReview}</div>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h4>
            <ul className="space-y-2">
              {control.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  <span className="text-gray-600">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Implementation Steps */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Implementation Steps</h4>
            <ol className="space-y-2">
              {control.implementation.map((step, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-600">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Evidence Required */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Evidence Required</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {control.evidence.map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal footer removed per design request */}
      </div>
    </div>
  );
}
