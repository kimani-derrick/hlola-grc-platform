'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  ShieldCheck as ShieldCheckIcon, 
  CheckSquare, 
  Upload, 
  Clock, 
  Plus,
  Search,
  Settings,
  LogOut
} from 'lucide-react';

// Import our new abstractions
import { mockFrameworks } from '@/services/mockData';
import { useNavigation } from '@/hooks/useNavigation';
import { useDataFiltering } from '@/hooks/useDataFiltering';
import { useAuth } from '@/contexts/AuthContext';
import apiService, { Framework, Control, Task } from '@/services/api';
import { Breadcrumb } from '@/components/Breadcrumb';
import { StatsCards } from '@/components/StatsCards';
import { FrameworksSection } from '@/components/sections/FrameworksSection';
import { ControlsSection } from '@/components/sections/ControlsSection';
import { TasksSection } from '@/components/sections/TasksSection';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('frameworks');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { logout, admin } = useAuth();

  // Real data state
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [controls, setControls] = useState<Control[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use our custom hooks
  const {
    selectedFramework,
    selectedControl,
    breadcrumb,
    handleFrameworkClick,
    handleControlClick,
    handleBackToFrameworks,
    handleBackToControls,
  } = useNavigation();

  const { getCurrentControls, getCurrentTasks } = useDataFiltering(selectedFramework, selectedControl, controls, tasks);

  // Calculate stats from real data
  const calculateStats = () => {
    const activeFrameworks = frameworks.filter(f => f.is_active).length;
    const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;
    
    return {
      totalFrameworks: frameworks.length,
      totalControls: controls.length,
      totalTasks: tasks.length,
      activeFrameworks,
      pendingTasks
    };
  };

  const stats = calculateStats();

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [frameworksResponse, controlsResponse, tasksResponse] = await Promise.all([
          apiService.getFrameworks(),
          apiService.getControls(),
          apiService.getTasks()
        ]);

        if (frameworksResponse.success && frameworksResponse.frameworks) {
          setFrameworks(frameworksResponse.frameworks);
        } else {
          console.error('Failed to fetch frameworks:', frameworksResponse.message);
        }

        if (controlsResponse.success && controlsResponse.controls) {
          setControls(controlsResponse.controls);
        } else {
          console.error('Failed to fetch controls:', controlsResponse.message);
        }

        if (tasksResponse.success && tasksResponse.tasks) {
          setTasks(tasksResponse.tasks);
        } else {
          console.error('Failed to fetch tasks:', tasksResponse.message);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Navigation handlers with tab switching
  const handleFrameworkClickWithTab = (framework: any) => {
    handleFrameworkClick(framework, setActiveTab);
  };

  const handleControlClickWithTab = (control: any) => {
    handleControlClick(control, setActiveTab);
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) handleBackToFrameworks(setActiveTab);
    else if (index === 1 && selectedFramework) handleBackToControls(setActiveTab);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-hlola-gradient">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-hlola-blue rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-hlola-cyan rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="glass-nav border-b border-hlola-cyan/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-hlola-gradient-strong rounded-lg flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-hlola-blue">Admin Portal</h1>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/80 border border-hlola-cyan/30 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-hlola-cyan backdrop-blur-sm"
                  />
                </div>
                
                {/* Admin Info */}
                {admin && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/80 rounded-lg backdrop-blur-sm">
                    <div className="w-6 h-6 bg-hlola-gradient-strong rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {admin.firstName?.charAt(0)}{admin.lastName?.charAt(0)}
                      </span>
                    </div>
                    <span className="text-slate-700 text-sm font-medium">
                      {admin.firstName} {admin.lastName}
                    </span>
                  </div>
                )}
                
                <button className="p-2 text-slate-400 hover:text-hlola-blue transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Breadcrumb Navigation */}
          <Breadcrumb items={breadcrumb} onNavigate={handleBreadcrumbClick} />

          {/* Navigation Tabs */}
          <div className="glass rounded-2xl p-2 mb-8">
            <nav className="flex space-x-2">
              {[
                { id: 'frameworks', name: 'Frameworks', icon: Layers },
                { id: 'controls', name: 'Controls', icon: ShieldCheck },
                { id: 'tasks', name: 'Tasks', icon: CheckSquare },
                { id: 'bulk-import', name: 'Bulk Import', icon: Upload },
                { id: 'audit-logs', name: 'Audit Logs', icon: Clock }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-hlola-blue text-white shadow-lg'
                      : 'text-slate-600 hover:text-hlola-blue hover:bg-hlola-cyan/10'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="glass rounded-2xl overflow-hidden">
            {/* Content Header */}
            <div className="px-6 py-4 border-b border-hlola-cyan/20 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-hlola-blue capitalize">
                  {selectedFramework && selectedControl ? `${selectedControl.title} Tasks` :
                   selectedFramework ? `${selectedFramework.name} Controls` :
                   activeTab.replace('-', ' ')}
                </h2>
                <p className="text-slate-600 text-sm">
                  {selectedFramework && selectedControl ? `Tasks for control ${selectedControl.control_id} in ${selectedFramework.name}` :
                   selectedFramework ? `Controls within the ${selectedFramework.name} framework` :
                   activeTab === 'frameworks' && 'Manage compliance frameworks and their controls'}
                  {activeTab === 'controls' && !selectedFramework && 'Select a framework to view its controls'}
                  {activeTab === 'tasks' && !selectedControl && 'Select a control to view its tasks'}
                  {activeTab === 'bulk-import' && 'Import frameworks, controls, and tasks in bulk'}
                  {activeTab === 'audit-logs' && 'View administrative actions and changes'}
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-hlola-gradient-strong text-white rounded-lg hover:opacity-90 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add {selectedFramework && selectedControl ? 'Task' :
                     selectedFramework ? 'Control' :
                     activeTab === 'frameworks' ? 'Framework' : 
                     activeTab === 'controls' ? 'Control' : 
                     activeTab === 'tasks' ? 'Task' : 'Item'}
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-hlola-blue border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3 text-slate-600">Loading data...</span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-4">{error}</div>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="px-4 py-2 bg-hlola-blue text-white rounded-lg hover:opacity-90"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  {activeTab === 'frameworks' && (
                    <FrameworksSection 
                      frameworks={frameworks} 
                      onFrameworkClick={handleFrameworkClickWithTab} 
                    />
                  )}

                  {activeTab === 'controls' && (
                    <ControlsSection 
                      selectedFramework={selectedFramework}
                      controls={getCurrentControls}
                      onControlClick={handleControlClickWithTab}
                    />
                  )}

                  {activeTab === 'tasks' && (
                    <TasksSection 
                      selectedControl={selectedControl}
                      tasks={getCurrentTasks}
                    />
                  )}

                  {activeTab === 'bulk-import' && (
                <div className="text-center py-12">
                  <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-hlola-blue mb-2">Bulk Import</h3>
                  <p className="text-slate-600 mb-6">Upload CSV or Excel files to import frameworks, controls, and tasks</p>
                  <button className="px-6 py-3 bg-hlola-gradient-strong text-white rounded-lg hover:opacity-90 transition-all">
                    Choose Files
                  </button>
                </div>
              )}

                  {activeTab === 'audit-logs' && (
                <div className="space-y-4">
                  {[
                    { action: 'Framework Created', item: 'GDPR', user: 'Admin User', time: '2 hours ago' },
                    { action: 'Control Updated', item: 'A.5.1.1', user: 'Admin User', time: '4 hours ago' },
                    { action: 'Task Created', item: 'Review Policy', user: 'Admin User', time: '6 hours ago' },
                    { action: 'Bulk Import', item: '3 Frameworks', user: 'Admin User', time: '1 day ago' }
                  ].map((log, index) => (
                    <div key={index} className="glass rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-hlola-gradient-strong rounded-lg flex items-center justify-center">
                            <Clock className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-hlola-blue font-medium">{log.action}</p>
                            <p className="text-slate-600 text-sm">{log.item} • {log.user}</p>
                          </div>
                        </div>
                        <span className="text-slate-500 text-sm">{log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
