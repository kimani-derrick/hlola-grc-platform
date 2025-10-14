'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEntity } from '../context/EntityContext';
import { useDashboardData } from '../hooks/useDashboardData';
import { useActivitiesData } from '../hooks/useActivitiesData';
import SpeedometerGauge from './SpeedometerGauge';
import RiskExposureGauge from './RiskExposureGauge';
import EntityHeader from './EntityHeader';
import MetricCard from './MetricCard';

export default function DashboardContent() {
  const { user, isLoading: authLoading } = useAuth();
  const { selectedEntity, isLoading: entityLoading } = useEntity();
  const { data: dashboardData, isLoading: dataLoading, error: dataError } = useDashboardData(user?.organizationId);
  const { recentActivities, priorityActions, loading: activitiesLoading, error: activitiesError } = useActivitiesData(user?.organizationId);
  const [gaugeSize, setGaugeSize] = useState(160);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const updateGaugeSize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setGaugeSize(110);
      } else if (width < 768) {
        setGaugeSize(130);
      } else if (width < 1024) {
        setGaugeSize(150);
      } else {
        setGaugeSize(160);
      }
    };

    updateGaugeSize();
    window.addEventListener('resize', updateGaugeSize);
    return () => window.removeEventListener('resize', updateGaugeSize);
  }, []);

  // Show loading state while auth or entities are loading, but not if we have cached data
  if (authLoading || entityLoading || (dataLoading && !dashboardData)) {
    return (
      <div className="space-y-6 max-w-full">
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="glass-card rounded-2xl p-6 h-64 bg-gray-100 animate-pulse"></div>
          <div className="glass-card rounded-2xl p-6 h-64 bg-gray-100 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-6 h-48 bg-gray-100 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Show message when no entity is selected
  if (!selectedEntity) {
    return (
      <div className="space-y-6 max-w-full">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Entity Selected</h3>
          <p className="text-gray-500 mb-4">Please select an entity from the dropdown above to view its dashboard.</p>
        </div>
      </div>
    );
  }

  // DEBUG: Log dashboard data
  console.log('🔍 DEBUG - Dashboard Data:', dashboardData);
  console.log('🔍 DEBUG - Selected Entity:', selectedEntity);
  console.log('🔍 DEBUG - Critical Issues:', dashboardData?.criticalIssues);
  console.log('🔍 DEBUG - Compliance Score:', dashboardData?.complianceScore);
  console.log('🔍 DEBUG - Using Real Data?', !!dashboardData);
  console.log('🔍 DEBUG - Data Loading?', dataLoading);
  console.log('🔍 DEBUG - Gauge Metrics:', {
    progress: dashboardData?.completionRate,
    controls: dashboardData?.totalControls,
    done: dashboardData?.completedTasks,
    target: 50
  });

  // Use real dashboard data or zeros when none is available
  const entityData = {
    criticalIssues: dashboardData?.criticalIssues || 0,
    riskExposure: dashboardData?.riskExposure || 0,
    controls: dashboardData?.totalControls || 0,
    policies: dashboardData?.uploadedDocuments || 0,
    risks: Math.round((dashboardData?.totalTasks || 0) * 0.4),
    tasks: dashboardData?.totalTasks || 0,
    completedTasks: dashboardData?.completedTasks || 0,
    pendingTasks: dashboardData?.pendingTasks || 0,
    inProgressTasks: dashboardData?.inProgressTasks || 0,
    overdueTasks: dashboardData?.overdueTasks || 0,
    completionRate: dashboardData?.completionRate || 0,
    uploadedDocuments: dashboardData?.uploadedDocuments || 0, // Just uploaded documents
    requiredDocuments: dashboardData?.requiredDocuments || 0,
    uploadPercentage: dashboardData?.uploadPercentage || 0,
    assignedFrameworks: dashboardData?.assignedFrameworks || 0,
    totalAvailableFrameworks: dashboardData?.totalAvailableFrameworks || 0,
    frameworkCoverage: dashboardData?.frameworkCoverage || 0,
    // Control metrics
    totalControls: dashboardData?.totalControls || 0,
    completedControls: dashboardData?.completedControls || 0,
    inProgressControls: dashboardData?.inProgressControls || 0,
    notStartedControls: dashboardData?.notStartedControls || 0,
    controlsCompletionRate: dashboardData?.controlsCompletionRate || 0,
  };

  return (
    <div className="space-y-6 max-w-full">
      <EntityHeader />
      {/* Welcome Section */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#26558e]">
              Welcome back, {user?.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-600 mt-1 text-xs">
              Here&apos;s your compliance overview for {selectedEntity.name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Today</p>
            <p className="text-sm font-semibold text-[#26558e]">
              {isClient ? new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'Loading...'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Compliance Dashboard - Two Dials */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Speedometer Gauge - Left Side */}
        <div>
          <div className="glass-card rounded-2xl p-6 sm:p-8 h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 gauge-container relative">
            {/* Digital Display Counter - Top Left Inside Card */}
            <div className="absolute top-4 left-4 z-20">
              <div className="bg-black/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-2xl border border-gray-300">
                <div className="text-xl font-mono font-bold text-center transition-all duration-1000 ease-out text-red-600">
                  {Math.round(dashboardData?.complianceScore || 0)}%
                </div>
                <div className="text-xs text-gray-300 text-center mt-1 font-semibold tracking-wider">
                  COMPLIANCE
                </div>
              </div>
            </div>
            <div className="gauge-glow">
              <SpeedometerGauge
                value={dashboardData?.complianceScore || 0}
                maxValue={100}
                title="Overall Compliance Score"
                status={(dashboardData?.complianceScore || 0) > 80 ? "good" : (dashboardData?.complianceScore || 0) > 50 ? "warning" : "critical"}
                size={gaugeSize}
                progress={dashboardData?.completionRate || 0}
                controls={dashboardData?.totalControls || 0}
                done={dashboardData?.completedTasks || 0}
                target={50}
              />
            </div>
          </div>
        </div>

        {/* Risk Exposure Gauge - Right Side */}
        <div>
          <RiskExposureGauge
            exposureAmount={entityData.riskExposure}
            riskLevel={dashboardData?.riskLevel || selectedEntity.riskLevel || "critical"}
            industryAverage={Math.round(entityData.riskExposure * 0.3)} // 30% of current exposure
            trend="up"
            trendPercentage={15}
            size={gaugeSize}
            currency="KES"
          />
        </div>
      </div>

      {/* Key Metrics - Elegant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Framework Coverage Card */}
        <MetricCard
          title="Framework Coverage"
          value={entityData.assignedFrameworks}
          maxValue={entityData.totalAvailableFrameworks}
          percentage={entityData.frameworkCoverage}
          status={entityData.frameworkCoverage > 80 ? "good" : entityData.frameworkCoverage > 50 ? "warning" : "critical"}
          metrics={{
            primary: { value: entityData.totalAvailableFrameworks, label: "Available", color: "text-gray-700" },
            secondary: { value: entityData.totalAvailableFrameworks - entityData.assignedFrameworks, label: "Remaining", color: "text-orange-600" }
          }}
          icon={
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
          gradient="from-orange-50 to-orange-100"
        />

        {/* Controls Card */}
        <MetricCard
          title="Controls"
          value={entityData.totalControls}
          maxValue={entityData.totalControls}
          percentage={entityData.controlsCompletionRate}
          status={entityData.controlsCompletionRate > 80 ? "good" : entityData.controlsCompletionRate > 50 ? "warning" : "critical"}
          metrics={{}}
          icon={
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
          gradient="from-indigo-50 to-indigo-100"
        />

        {/* Total Tasks Card */}
        <MetricCard
          title="Total Tasks"
          value={entityData.tasks}
          maxValue={100}
          status={entityData.tasks > 150 ? "critical" : entityData.tasks > 100 ? "warning" : "good"}
          metrics={{
            primary: { value: entityData.completedTasks, label: "Completed", color: "text-green-600" },
            secondary: { value: entityData.tasks - entityData.completedTasks, label: "Pending", color: "text-orange-600" }
          }}
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          }
          gradient="from-blue-50 to-blue-100"
        />

        {/* Evidence Upload Progress Card */}
        <MetricCard
          title="Evidence Upload Progress"
          value={entityData.uploadedDocuments}
          maxValue={entityData.requiredDocuments}
          percentage={entityData.uploadPercentage}
          status={entityData.uploadPercentage >= 100 ? "good" : entityData.uploadPercentage > 50 ? "warning" : "critical"}
          metrics={{
            primary: { value: entityData.requiredDocuments, label: "Required", color: "text-gray-700" },
            secondary: { value: Math.max(0, entityData.requiredDocuments - entityData.uploadedDocuments), label: "Missing", color: "text-orange-600" }
          }}
          icon={
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          }
          gradient="from-purple-50 to-purple-100"
        />

      </div>

      {/* Recent Activities and Priority Actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 max-w-full">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-[#26558e] mb-4">Recent Activities</h3>
          {activitiesLoading ? (
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-4/5 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ) : activitiesError ? (
            <div className="text-center py-4">
              <p className="text-sm text-red-500">Failed to load activities</p>
            </div>
          ) : recentActivities.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">No recent activities</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.color === 'red' ? 'bg-red-500' : 
                    activity.color === 'orange' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-[#26558e] mb-4">Priority Actions</h3>
          {activitiesLoading ? (
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ) : activitiesError ? (
            <div className="text-center py-4">
              <p className="text-sm text-red-500">Failed to load priority actions</p>
            </div>
          ) : priorityActions.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">No priority actions</p>
            </div>
          ) : (
            <div className="space-y-4">
              {priorityActions.map((action) => (
                <div key={action.id} className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${
                  action.color === 'red' ? 'bg-red-50 border-red-500' : 
                  action.color === 'orange' ? 'bg-orange-50 border-orange-500' : 'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{action.title}</p>
                    <p className="text-xs text-gray-500">Due: {action.dueDate}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    action.color === 'red' ? 'text-red-600 bg-red-100' : 
                    action.color === 'orange' ? 'text-orange-600 bg-orange-100' : 'text-blue-600 bg-blue-100'
                  }`}>
                    {action.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}