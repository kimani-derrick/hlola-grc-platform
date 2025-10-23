'use client';

import { useState, useEffect } from 'react';

interface MetricCardProps {
  title: string;
  value: number;
  maxValue?: number;
  percentage?: number;
  status: 'critical' | 'warning' | 'good';
  metrics: {
    primary?: { value: number; label: string; color?: string };
    secondary?: { value: number; label: string; color?: string };
    tertiary?: { value: number; label: string; color?: string };
    quaternary?: { value: number; label: string; color?: string };
  } | Record<string, unknown>;
  icon: React.ReactNode;
  gradient: string; // Tailwind gradient classes, e.g., "from-blue-50 to-blue-100"
}

export default function MetricCard({
  title,
  value,
  maxValue = 100,
  percentage,
  status,
  metrics,
  icon,
  gradient
}: MetricCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 500);
    return () => clearTimeout(timer);
  }, [value]);

  const statusConfig = {
    critical: {
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      statusText: 'Critical',
      statusColor: 'bg-red-100 text-red-800'
    },
    warning: {
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      statusText: 'Warning',
      statusColor: 'bg-orange-100 text-orange-800'
    },
    good: {
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      statusText: 'Good',
      statusColor: 'bg-green-100 text-green-800'
    }
  };

  const config = statusConfig[status];
  const displayPercentage = percentage !== undefined ? percentage : (animatedValue / maxValue) * 100;

  if (!isClient) {
    return (
      <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className={`glass-card rounded-2xl p-6 bg-gradient-to-br ${gradient} border ${config.borderColor} hover:shadow-lg transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bgColor}`}>
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.statusColor}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${status === 'good' ? 'bg-green-500' : status === 'warning' ? 'bg-orange-500' : 'bg-red-500'}`}></div>
              {config.statusText}
            </div>
          </div>
        </div>
      </div>

      {/* Main Value Display */}
      <div className="text-center mb-6">
        <div className={`text-4xl font-bold ${config.color} mb-1`}>
          {animatedValue.toLocaleString()}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ease-out ${
              status === 'good' ? 'bg-green-500' : 
              status === 'warning' ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(100, displayPercentage)}%` }}
          ></div>
        </div>
      </div>

      {/* Metrics Grid */}
      {metrics.primary && (
        <div className={`grid gap-4 ${metrics.secondary ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <div className="text-center">
            <div className={`text-2xl font-bold ${metrics.primary.color || config.color}`}>
              {metrics.primary.value.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">{metrics.primary.label}</div>
          </div>
          {metrics.secondary && (
            <div className="text-center">
              <div className={`text-2xl font-bold ${metrics.secondary.color || 'text-gray-700'}`}>
                {metrics.secondary.value.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">{metrics.secondary.label}</div>
            </div>
          )}
          {metrics.tertiary && (
            <div className="text-center">
              <div className={`text-lg font-semibold ${metrics.tertiary.color || 'text-blue-600'}`}>
                {metrics.tertiary.value.toLocaleString()}{typeof metrics.tertiary.value === 'number' && metrics.tertiary.value <= 1 ? '%' : ''}
              </div>
              <div className="text-xs text-gray-600">{metrics.tertiary.label}</div>
            </div>
          )}
          {metrics.quaternary && (
            <div className="text-center">
              <div className={`text-lg font-semibold ${metrics.quaternary.color || 'text-orange-600'}`}>
                {metrics.quaternary.value.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">{metrics.quaternary.label}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}