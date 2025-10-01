'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEntity } from '../context/EntityContext';
import SpeedometerGauge from './SpeedometerGauge';
import MetricCard from './MetricCard';
import AuditOverview from './AuditOverview';
import RiskExposureGauge from './RiskExposureGauge';

export default function DashboardContent() {
  const { user } = useAuth();
  const { selectedEntity, isLoading: entityLoading } = useEntity();
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

  // Show loading state while entities are loading
  if (entityLoading) {
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

  // Get entity-specific data
  const getEntitySpecificData = () => {
    const baseData = {
      criticalIssues: 11,
      riskExposure: 7000000,
      controls: 86,
      policies: 30,
      risks: 16,
      tasks: 38,
    };

    // Adjust data based on entity's compliance score and risk level
    if (selectedEntity.complianceScore) {
      const score = selectedEntity.complianceScore;
      const multiplier = score / 100;
      
      return {
        ...baseData,
        criticalIssues: Math.max(1, Math.round(baseData.criticalIssues * (1 - multiplier + 0.2))),
        controls: Math.round(baseData.controls * multiplier),
        policies: Math.round(baseData.policies * multiplier),
        risks: Math.round(baseData.risks * (1 - multiplier + 0.3)),
        tasks: Math.round(baseData.tasks * multiplier),
      };
    }

    return baseData;
  };

  const entityData = getEntitySpecificData();

  return (
    <div className="space-y-6 max-w-full">
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
                  {entityData.criticalIssues}
                </div>
                <div className="text-xs text-gray-300 text-center mt-1 font-semibold tracking-wider">
                  CRITICAL
                </div>
              </div>
            </div>
            <div className="gauge-glow">
              <SpeedometerGauge
                value={entityData.criticalIssues}
                maxValue={100}
                title="critical"
                status="critical"
                size={gaugeSize}
              />
            </div>
          </div>
        </div>

        {/* Risk Exposure Gauge - Right Side */}
        <div>
          <RiskExposureGauge
            exposureAmount={entityData.riskExposure}
            riskLevel={selectedEntity.riskLevel || "critical"}
            industryAverage={5000000}
            trend="up"
            trendPercentage={15}
            size={gaugeSize}
            currency="KES"
          />
        </div>
      </div>


      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-full">
        <MetricCard
          value={entityData.controls}
          label="Controls"
          progress={selectedEntity.complianceScore || 75}
          change="+5%"
          changeType="positive"
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <MetricCard
          value={entityData.policies}
          label="Policies"
          progress={selectedEntity.complianceScore || 78}
          change="+5%"
          changeType="positive"
          color="orange"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <MetricCard
          value={entityData.risks}
          label="Risks"
          progress={75}
          change="-2%"
          changeType="negative"
          color="red"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          }
        />
        <MetricCard
          value={entityData.tasks}
          label="Tasks"
          progress={selectedEntity.complianceScore || 70}
          change="0%"
          changeType="neutral"
          color="cyan"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
        />
      </div>

      {/* Recent Activities - Simplified */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 max-w-full">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-[#26558e] mb-4">Recent Activities</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Critical compliance gap identified in data processing</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Policy review due tomorrow: Privacy Policy v2.1</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">New team member Phillip joined Compliance team</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-[#26558e] mb-4">Priority Actions</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Address critical compliance gaps</p>
                <p className="text-xs text-gray-500">Due: Today</p>
              </div>
              <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">URGENT</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Review high-risk policies</p>
                <p className="text-xs text-gray-500">Due: Tomorrow</p>
              </div>
              <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded">HIGH</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Update compliance training</p>
                <p className="text-xs text-gray-500">Due: Next week</p>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">MEDIUM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Overview Section */}
      <AuditOverview />
    </div>
  );
}