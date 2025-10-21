'use client';

import { useState, useEffect } from 'react';
import { Framework, ControlDetail, Priority } from '../types/frameworks';
import ControlDetailsModal from './ControlDetailsModal';
import { apiService } from '../services/api';

interface CountryDetailViewProps {
  selectedFramework: Framework;
  selectedControl: string | null;
  controlDetails: Record<string, ControlDetail>;
  controls?: ControlDetail[];
  onBack: () => void;
  onControlSelect: (controlId: string) => void;
  onControlClose: () => void;
  getRiskLevelColor: (riskLevel: string) => string;
  getPriorityColor: (priority: Priority) => string;
  isActiveFramework?: boolean; // Add this prop
}

export default function CountryDetailView({
  selectedFramework,
  selectedControl,
  controlDetails,
  controls = [],
  onBack,
  onControlSelect,
  onControlClose,
  getRiskLevelColor,
  getPriorityColor,
  isActiveFramework = false
}: CountryDetailViewProps) {
  const [frameworkTasks, setFrameworkTasks] = useState<any[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  
  const computedControlsCount = (controls && controls.length) || selectedFramework.controls || selectedFramework.requirements || 0;

  // Fetch tasks for this framework
  useEffect(() => {
    const fetchFrameworkTasks = async () => {
      try {
        setTasksLoading(true);
        const response = await apiService.getTasksByFramework(
          selectedFramework.id, 
          isActiveFramework
        );
        if (response.success) {
          setFrameworkTasks(response.data || []);
        } else {
          console.error('Failed to fetch framework tasks:', response.error);
          setFrameworkTasks([]);
        }
      } catch (error) {
        console.error('Error fetching framework tasks:', error);
        setFrameworkTasks([]);
      } finally {
        setTasksLoading(false);
      }
    };

    if (selectedFramework.id) {
      fetchFrameworkTasks();
    }
  }, [selectedFramework.id, isActiveFramework]);
  const evidenceCount = controls && controls.length > 0
    ? controls.reduce((sum, c) => sum + ((c as any).evidence ? (c as any).evidence.length : 0), 0)
    : 0;
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
                    <div className="text-2xl font-bold text-gray-900">{computedControlsCount} Controls</div>
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
                    <div className="text-3xl font-bold text-gray-900">{computedControlsCount}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">Tasks</div>
                    <div className="text-3xl font-bold text-gray-900">
                      {tasksLoading ? '...' : frameworkTasks.length}
                    </div>
                  </div>
                  {/* Evidence removed in view-only controls context */}
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
                    <span className="text-sm text-gray-500">{(controls && controls.length) || selectedFramework.controls} Controls</span>
                    <div className="flex gap-1">
                      <button className="px-3 py-1 bg-teal-600 text-white rounded text-sm">Table</button>
                      <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">List</button>
                    </div>
                  </div>
                </div>

                {/* Controls Cards - real data */}
                <div className="space-y-4">
                  {controls && controls.length > 0 ? (
                    controls.map((c) => (
                      <div key={c.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">{c.id}</span>
                              {c.article ? (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">{c.article}</span>
                              ) : null}
                            </div>
                            <h5 className="font-semibold text-gray-900 mb-2">{c.title}</h5>
                            {c.subtitle && <h6 className="font-medium text-gray-700 mb-2">{c.subtitle}</h6>}
                            {c.description && (
                              <p className="text-gray-600 text-sm mb-3">{c.description}</p>
                            )}
                            <button 
                              onClick={() => onControlSelect(c.id)}
                              className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                            >
                              View Details →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">No controls found for this framework.</div>
                  )}
                </div>
              </div>
            </div>
        </div>

        {/* Footer actions removed per design update */}
      </div>

      {/* Control Details Modal */}
      <ControlDetailsModal
        control={selectedControl ? controlDetails[selectedControl] : null}
        controlId={selectedControl || undefined}
        isOpen={!!selectedControl}
        onClose={onControlClose}
        isActiveFramework={isActiveFramework}
      />
    </>
  );
}
