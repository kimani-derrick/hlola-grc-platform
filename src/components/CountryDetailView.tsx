'use client';

import { Framework, ControlDetail, Priority } from '../types/frameworks';
import ControlDetailsModal from './ControlDetailsModal';

interface CountryDetailViewProps {
  selectedFramework: Framework;
  selectedControl: string | null;
  controlDetails: Record<string, ControlDetail>;
  onBack: () => void;
  onControlSelect: (controlId: string) => void;
  onControlClose: () => void;
  getRiskLevelColor: (riskLevel: string) => string;
  getPriorityColor: (priority: Priority) => string;
}

export default function CountryDetailView({
  selectedFramework,
  selectedControl,
  controlDetails,
  onBack,
  onControlSelect,
  onControlClose,
  getRiskLevelColor,
  getPriorityColor
}: CountryDetailViewProps) {
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border">
        {/* Header with Back Button */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Back to frameworks"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className={`w-12 h-12 ${selectedFramework.color} rounded-xl flex items-center justify-center text-white text-xl mr-4`}>
                {selectedFramework.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedFramework.name}</h2>
                <p className="text-gray-600">{selectedFramework.region}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(selectedFramework.riskLevel)}`}>
                    {selectedFramework.riskLevel.toUpperCase()} RISK
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedFramework.priority)}`}>
                    {selectedFramework.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <div className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-white text-[#26558e] shadow-sm">
              <span>⚙️</span>
              <span className="hidden sm:inline">Controls</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
              {/* Header Section */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedFramework.name} Controls</h3>
                    <p className="text-gray-600">Manage and track compliance requirements</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Legal Framework</div>
                    <div className="text-2xl font-bold text-gray-900">{selectedFramework.requirements} Requirements</div>
                  </div>
                </div>
              </div>

              {/* Framework Overview */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Framework Overview</h4>
                <div className="mb-4">
                  <h5 className="font-medium text-gray-900 mb-2">Description</h5>
                  <p className="text-gray-600">{selectedFramework.description}</p>
                </div>
                
                {/* Requirements Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">Controls</div>
                    <div className="text-3xl font-bold text-gray-900">{selectedFramework.controls}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">Tasks</div>
                    <div className="text-3xl font-bold text-gray-900">{selectedFramework.tasks.length}</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">Evidence</div>
                    <div className="text-3xl font-bold text-gray-900">{Math.floor(selectedFramework.controls * 0.8)}</div>
                  </div>
                </div>
              </div>

              {/* Framework Controls Section */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Framework Controls</h4>
                    <p className="text-gray-600">Manage compliance requirements and evidence</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{selectedFramework.controls} Controls</span>
                    <div className="flex gap-1">
                      <button className="px-3 py-1 bg-teal-600 text-white rounded text-sm">Table</button>
                      <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">List</button>
                    </div>
                  </div>
                </div>

                {/* Controls Cards */}
                <div className="space-y-4">
                  {/* Control 1 */}
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">DZA-001</span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">Art. 6</span>
                        </div>
                        <h5 className="font-semibold text-gray-900 mb-2">Data Protection Principles</h5>
                        <h6 className="font-medium text-gray-700 mb-2">Lawful Basis for Processing</h6>
                        <p className="text-gray-600 text-sm mb-3">
                          Organizations must establish and document lawful basis for all personal data processing activities
                        </p>
                        <button 
                          onClick={() => onControlSelect('DZA-001')}
                          className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Control 2 */}
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">DZA-002</span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">Art. 15</span>
                        </div>
                        <h5 className="font-semibold text-gray-900 mb-2">Data Subject Rights</h5>
                        <h6 className="font-medium text-gray-700 mb-2">Right to Access</h6>
                        <p className="text-gray-600 text-sm mb-3">
                          Organizations must provide data subjects with access to their personal data upon request
                        </p>
                        <button 
                          onClick={() => onControlSelect('DZA-002')}
                          className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Additional Controls Placeholder */}
                  {selectedFramework.controls > 2 && (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-2">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <p className="text-gray-500">+{selectedFramework.controls - 2} more controls</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 bg-[#26558e] text-white px-6 py-3 rounded-lg hover:bg-[#1e4470] transition-colors font-medium">
              Start Compliance Process
            </button>
            <button className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Generate Report
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Get Help
            </button>
          </div>
        </div>
      </div>

      {/* Control Details Modal */}
      <ControlDetailsModal
        control={selectedControl ? controlDetails[selectedControl] : null}
        isOpen={!!selectedControl}
        onClose={onControlClose}
      />
    </>
  );
}
