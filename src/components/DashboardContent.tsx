'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SpeedometerGauge from './SpeedometerGauge';
import MetricCard from './MetricCard';
import AuditOverview from './AuditOverview';
import RiskExposureGauge from './RiskExposureGauge';

export default function DashboardContent() {
  const { user } = useAuth();
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
              Here&apos;s your compliance overview for today
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
                  11
                </div>
                <div className="text-xs text-gray-300 text-center mt-1 font-semibold tracking-wider">
                  CRITICAL
                </div>
              </div>
            </div>
            <div className="gauge-glow">
              <SpeedometerGauge
                value={11}
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
            exposureAmount={7000000}
            riskLevel="critical"
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
          value={86}
          label="Controls"
          progress={75}
          change="+5%"
          changeType="positive"
          color="green"
        />
        <MetricCard
          value={30}
          label="Policies"
          progress={78}
          change="+5%"
          changeType="positive"
          color="orange"
        />
        <MetricCard
          value={16}
          label="Risks"
          progress={75}
          change="-2%"
          changeType="negative"
          color="red"
        />
        <MetricCard
          value={38}
          label="Tasks"
          progress={70}
          change="0%"
          changeType="neutral"
          color="cyan"
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