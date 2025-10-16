'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../../components/DashboardLayout';
import ControlDetailModal from '../../../../components/ControlDetailModal';
import ControlsHeader from '../../../../components/controls/ControlsHeader';
import ControlsStats from '../../../../components/controls/ControlsStats';
import ControlsFilters from '../../../../components/controls/ControlsFilters';
import ControlCard, { Control } from '../../../../components/controls/ControlCard';
import ControlsEmptyState from '../../../../components/controls/ControlsEmptyState';
import { useActiveFrameworks } from '../../../../context/ActiveFrameworksContext';
import { useControlsData } from '../../../../hooks/useControlsData';
import { useEntity } from '../../../../context/EntityContext';
import { apiService } from '../../../../services/api';

export default function ControlsPage() {
  const { activeFrameworkIds, setActiveFrameworkIds } = useActiveFrameworks();
  const { selectedEntity } = useEntity();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedFramework, setSelectedFramework] = useState<string>('all');
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Load assigned frameworks for the current entity
  useEffect(() => {
    const refreshAssignedFrameworks = async () => {
      try {
        if (!selectedEntity?.id) return;
        const resp: any = await apiService.getEntityFrameworks(selectedEntity.id);
        if (resp.success) {
          const list = Array.isArray(resp.data) ? resp.data : [];
          const ids = list.map((f: any) => f.framework_id || f.frameworkId || f.id).filter(Boolean);
          setActiveFrameworkIds(ids);
        }
      } catch (error) {
        console.error('Error loading assigned frameworks:', error);
      }
    };

    refreshAssignedFrameworks();
  }, [selectedEntity?.id, setActiveFrameworkIds]);
  
  // Use custom hook for data management
  const {
    controls,
    countries,
    frameworksList,
    loading,
    error,
    completedControls,
    inProgressControls,
    overallProgress,
    refreshControlStats
  } = useControlsData();

  // Filter controls based on selected criteria
  const filteredControls = controls.filter(control => {
    const matchesSearch = control.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         control.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         control.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || control.country === selectedCountry;
    const matchesStatus = selectedStatus === 'all' || control.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || control.priority === selectedPriority;
    const matchesFramework = selectedFramework === 'all' || control.framework === selectedFramework;
    
    return matchesSearch && matchesCountry && matchesStatus && matchesPriority && matchesFramework;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading controls...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">⚠️ Error</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (activeFrameworkIds.length === 0) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Active Frameworks</h2>
            <p className="text-gray-600 mb-6">Please assign frameworks to see their controls.</p>
            <Link 
              href="/dashboard/privacy-hub/frameworks" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Frameworks
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-2 py-4 max-w-5xl mx-auto w-full">
        <ControlsHeader activeFrameworkCount={activeFrameworkIds.length} />
        
        <ControlsStats
          totalControls={controls.length}
          completedControls={completedControls}
          inProgressControls={inProgressControls}
          overallProgress={overallProgress}
        />

        <ControlsFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedPriority={selectedPriority}
          setSelectedPriority={setSelectedPriority}
          selectedFramework={selectedFramework}
          setSelectedFramework={setSelectedFramework}
          countries={countries}
          frameworksList={frameworksList}
        />

        {/* Controls List */}
        <div className="space-y-4">
          {filteredControls.length === 0 ? (
            <ControlsEmptyState />
          ) : (
            filteredControls.map((control) => (
              <ControlCard
                key={control.id}
                control={control}
                onClick={() => {
                  setSelectedControl(control);
                  setIsDetailModalOpen(true);
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Control Detail Modal */}
      {selectedControl && (
        <ControlDetailModal
          control={selectedControl}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedControl(null);
          }}
          onTaskCompleted={refreshControlStats}
        />
      )}
    </DashboardLayout>
  );
}
