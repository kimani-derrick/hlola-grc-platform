'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import CountryPopupModal from '../../../../components/CountryPopupModal';
import CountryDetailView from '../../../../components/CountryDetailView';
import { apiService } from '../../../../services/api';
import FrameworkCard from '../../../../components/FrameworkCard';
import { Framework, ControlDetail, Priority } from '../../../../types/frameworks';
import { getPriorityColor, getRiskLevelColor } from '../../../../utils/frameworkUtils';
import { formatDate } from '../../../../utils/dateUtils';
import { useActiveFrameworks } from '../../../../context/ActiveFrameworksContext';
import { useEntity } from '../../../../context/EntityContext';
import { useFrameworksData } from '../../../../hooks/useFrameworksData';


export default function FrameworksPage() {
  const { activeFrameworkIds, addActiveFramework, removeActiveFramework, isFrameworkActive, setActiveFrameworkIds } = useActiveFrameworks() as any;
  const { selectedEntity } = useEntity();
  const { frameworks, isLoading, error, refetch } = useFrameworksData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  const [activeTab, setActiveTab] = useState<'controls'>('controls');
  const [selectedFilter, setSelectedFilter] = useState<'Legal' | 'Other'>('Legal');
  const [selectedEntityName, setSelectedEntityName] = useState<string>('Entity 2');
  const [activeFrameworkTab, setActiveFrameworkTab] = useState<'active' | 'library'>('library');
  const [popupFramework, setPopupFramework] = useState<Framework | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedControl, setSelectedControl] = useState<string | null>(null);
  const [controlsById, setControlsById] = useState<Record<string, ControlDetail>>({});
  const [frameworkControlsCount, setFrameworkControlsCount] = useState<Record<string, number>>({});
  const [loadingControls, setLoadingControls] = useState(false);
  const [controlsError, setControlsError] = useState<string | null>(null);
  // API-only active frameworks (ignore local cache)
  const [assignedFrameworkIds, setAssignedFrameworkIds] = useState<string[]>([]);

  // Load Active Frameworks from backend for current entity
  const refreshAssignedFrameworks = async () => {
    try {
      if (!selectedEntity?.id) return;
      const resp: any = await apiService.getEntityFrameworks(selectedEntity.id);
      if (resp.success) {
        const list = Array.isArray(resp.data) ? resp.data : [];
        const ids = list.map((f: any) => f.framework_id || f.frameworkId || f.id).filter(Boolean);
        setAssignedFrameworkIds(ids);
        if (typeof setActiveFrameworkIds === 'function') setActiveFrameworkIds(ids);
      }
    } catch {}
  };

  useEffect(() => {
    refreshAssignedFrameworks();
  }, [selectedEntity?.id]);

  // Preload grouped control counts once (to avoid stale seeded counts)
  // and override card/popup display when available
  useEffect(() => {
    (async () => {
      try {
        const grouped = await apiService.getControlsGroupedByFramework();
        if (grouped.success && Array.isArray(grouped.data)) {
          const map: Record<string, number> = {};
          (grouped.data as any[]).forEach((r: any) => { map[r.framework_id] = Number(r.control_count) || 0; });
          setFrameworkControlsCount(map);
        }
      } catch (_) { /* ignore */ }
    })();
  }, []);

  const filteredFrameworks = frameworks.filter(framework => {
    const matchesSearch = framework.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         framework.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || framework.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || framework.status === selectedStatus;
    
    // Apply different filters based on tab
    let matchesFilter = true;
    if (activeFrameworkTab === 'active') {
      // API-only: show only frameworks assigned via API
      matchesFilter = assignedFrameworkIds.includes(framework.id);
    } else {
      // In library tab, apply Legal/Other filter
      const region = (framework.region || '').toLowerCase();
      matchesFilter = selectedFilter === 'Legal'
        ? region === 'africa'
        : region !== 'africa';
    }
    
    return matchesSearch && matchesCategory && matchesStatus && matchesFilter;
  });

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 rounded-3xl mx-4 mt-8">
          <div className="bg-hlola-gradient-strong px-6 py-8 rounded-3xl">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.581 9.67-8.5 11.317C4.581 16.67 1 12.225 1 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Privacy Hub</h1>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white/90 backdrop-blur-sm">
                        &gt; Frameworks
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading frameworks...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 rounded-3xl mx-4 mt-8">
          <div className="bg-hlola-gradient-strong px-6 py-8 rounded-3xl">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.581 9.67-8.5 11.317C4.581 16.67 1 12.225 1 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Privacy Hub</h1>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white/90 backdrop-blur-sm">
                        &gt; Frameworks
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load frameworks</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={refetch}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const toggleTaskCompletion = (frameworkId: string, taskId: string) => {
    // This would typically update the backend
    console.log(`Toggling task ${taskId} for framework ${frameworkId}`);
  };

  const addFrameworkToActive = (frameworkId: string) => {
    addActiveFramework(frameworkId);
    // Show success feedback (you could add a toast notification here)
    console.log(`Framework ${frameworkId} added to active frameworks`);
  };

  const removeFrameworkFromActive = (frameworkId: string) => {
    removeActiveFramework(frameworkId);
  };

  const handleCountryClick = (framework: Framework) => {
    setPopupFramework(framework);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setPopupFramework(null);
  };

  const handleViewControls = async () => {
    if (!popupFramework) return;
    try {
      setLoadingControls(true);
      setControlsError(null);
      // Fetch controls from backend
      const res = await apiService.getControlsByFramework(popupFramework.id);
      if (res.success && (res as any).data && Array.isArray((res as any).data)) {
        // Map minimal details into controlDetails store (by id)
        const details: any = {};
        (res as any).data.forEach((c: any) => {
          details[c.id] = {
            id: c.id,
            title: c.title || c.control_id || 'Control',
            subtitle: c.category || '',
            article: c.reference || '',
            description: c.description || '',
            detailedDescription: c.description || '',
            requirements: [],
            implementation: [],
            compliance: { status: 'unknown', progress: 0, lastUpdated: '', nextReview: '' },
            evidence: []
          };
        });
        setControlsById(details);
        // Store fetched count for this framework so cards and modal reflect real number
        setFrameworkControlsCount((prev) => ({ ...prev, [popupFramework.id]: (res as any).data.length }));
      } else if (!res.success) {
        setControlsError(res.error || 'Failed to load controls');
      }
      // Open the detailed view
      setSelectedFramework(popupFramework);
      setActiveTab('controls');
    } catch (e:any) {
      setControlsError(e?.message || 'Failed to load controls');
    } finally {
      setIsPopupOpen(false);
      setPopupFramework(null);
      setLoadingControls(false);
    }
  };

  // Get frameworks based on current tab
  const getDisplayFrameworks = () => {
    if (activeFrameworkTab === 'active') {
      return frameworks.filter(framework => assignedFrameworkIds.includes(framework.id));
    }
    return frameworks;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 rounded-3xl mx-4 mt-8">
        {/* Header Section with Hlola Gradient */}
        <div className="bg-hlola-gradient-strong px-6 py-8 rounded-3xl">
          <div className="max-w-7xl mx-auto">
            {/* Top Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.581 9.67-8.5 11.317C4.581 16.67 1 12.225 1 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Privacy Hub</h1>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white/90 backdrop-blur-sm">
                      &gt; Frameworks
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5h15A1.5 1.5 0 0121 6v12a1.5 1.5 0 01-1.5 1.5h-15z" />
                  </svg>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">4</span>
                  </div>
                </div>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <button className="glass-button text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Manage Frameworks
                </button>
              </div>
            </div>

            {/* Entity Selection - Subtle */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="text-sm text-white/80">Entity:</span>
              </div>
              <div className="relative">
                <select 
                  className="px-3 py-2 pr-8 rounded-lg glass-input text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30 min-w-[140px] appearance-none"
                  value={selectedEntityName}
                  onChange={(e) => setSelectedEntityName(e.target.value)}
                >
                  <option value="Test Entity" className="text-gray-900">Test Entity</option>
                  <option value="Entity 2" className="text-gray-900">Entity 2</option>
                  <option value="Entity 3" className="text-gray-900">Entity 3</option>
                </select>
                <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <button className="text-white/80 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Search and Filter Section */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search frameworks..."
                  className="w-full px-4 py-3 rounded-lg glass-input text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedFilter('Legal')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter === 'Legal'
                      ? 'bg-white/25 text-white backdrop-blur-sm'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  Legal
                </button>
                <button
                  onClick={() => setSelectedFilter('Other')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter === 'Other'
                      ? 'bg-white/25 text-white backdrop-blur-sm'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  Other
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Conditional Content: Main Frameworks or Country Detail View */}
          {!selectedFramework ? (
            /* Main Privacy Frameworks Section */
            <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Privacy Frameworks</h2>
              </div>
              
              {/* Framework Tabs */}
              <div className="flex space-x-1 mb-6">
                <button
                  onClick={() => setActiveFrameworkTab('active')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFrameworkTab === 'active'
                      ? 'bg-teal-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  Active Frameworks
                </button>
                <button
                  onClick={() => setActiveFrameworkTab('library')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFrameworkTab === 'library'
                      ? 'bg-teal-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  Frameworks Library
                </button>
              </div>

              {/* Framework Category Filters - Only show in Library tab */}
              {activeFrameworkTab === 'library' && (
                <div className="flex space-x-2 mb-6">
                  <button
                    onClick={() => setSelectedFilter('Legal')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedFilter === 'Legal'
                        ? 'bg-teal-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    African Legal Frameworks ({frameworks.filter(f => (f.region || '').toLowerCase() === 'africa').length})
                  </button>
                  <button
                    onClick={() => setSelectedFilter('Other')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedFilter === 'Other'
                        ? 'bg-teal-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    Other Frameworks ({frameworks.filter(f => (f.region || '').toLowerCase() !== 'africa').length})
                  </button>
                </div>
              )}

              {/* Frameworks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredFrameworks.map((framework) => (
                  <FrameworkCard
                    key={framework.id}
                    framework={framework}
                    activeFrameworkTab={activeFrameworkTab}
                    isFrameworkActive={isFrameworkActive}
                    onCountryClick={handleCountryClick}
                    onAddToActive={async (id: string) => {
                      if (!selectedEntity?.id) {
                        console.error('No selected entity; cannot assign framework');
                        return;
                      }
                      try {
                        const resp = await apiService.assignFrameworkToEntity(selectedEntity.id, id, { complianceScore: 0, auditReadinessScore: 0, certificationStatus: 'not-applicable' });
                        if (resp.success) {
                          await refreshAssignedFrameworks(); // reflect API state only
                        } else {
                          console.error('Failed to assign framework:', resp.error);
                        }
                      } catch (e) {
                        console.error('Assign framework error:', e);
                      }
                    }}
                controlsCount={frameworkControlsCount[framework.id] ?? framework.requirements}
                  />
                ))}
              </div>

              {/* Empty State */}
              {filteredFrameworks.length === 0 && (
                <div className="text-center py-12">
                  <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m-2 0v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2h2zm8-2V3a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeFrameworkTab === 'active' ? 'No active frameworks' : 'No frameworks found'}
                  </h3>
                  <p className="text-gray-600">
                    {activeFrameworkTab === 'active' 
                      ? 'Add frameworks from the library to get started with compliance.' 
                      : 'Try adjusting your search or filters to find frameworks.'
                    }
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Independent Country Detail View */
            <CountryDetailView
              selectedFramework={selectedFramework}
              selectedControl={selectedControl}
              controlDetails={controlsById}
              controls={Object.values(controlsById)}
              onBack={() => setSelectedFramework(null)}
              onControlSelect={setSelectedControl}
              onControlClose={() => setSelectedControl(null)}
              getRiskLevelColor={getRiskLevelColor}
              getPriorityColor={(priority) => getPriorityColor(priority as Priority)}
            />
          )}
        </div>

        {/* Country Popup Modal */}
        <CountryPopupModal
          framework={popupFramework}
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          onViewControls={handleViewControls}
          controlsCount={popupFramework ? (frameworkControlsCount[popupFramework.id] ?? null) : null}
        />
      </div>
    </DashboardLayout>
  );
}
