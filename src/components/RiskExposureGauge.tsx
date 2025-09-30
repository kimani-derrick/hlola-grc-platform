'use client';

import { useState, useEffect } from 'react';

interface RiskExposureGaugeProps {
  exposureAmount: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  industryAverage?: number;
  trend?: 'up' | 'down' | 'stable';
  trendPercentage?: number;
  size?: number;
  currency?: 'USD' | 'KES';
}

export default function RiskExposureGauge({
  exposureAmount = 2400000,
  riskLevel = 'critical',
  industryAverage = 1800000,
  trend = 'up',
  trendPercentage = 15,
  size = 280,
  currency = 'USD'
}: RiskExposureGaugeProps) {
  const [animatedAmount, setAnimatedAmount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Risk level configurations
  const riskConfig = {
    low: {
      color: '#22c55e',
      bgColor: '#f0fdf4',
      borderColor: '#bbf7d0',
      percentage: 20,
      label: 'Low Risk',
      description: 'Minimal exposure'
    },
    medium: {
      color: '#f59e0b',
      bgColor: '#fffbeb',
      borderColor: '#fed7aa',
      percentage: 45,
      label: 'Medium Risk',
      description: 'Moderate exposure'
    },
    high: {
      color: '#ef4444',
      bgColor: '#fef2f2',
      borderColor: '#fecaca',
      percentage: 75,
      label: 'High Risk',
      description: 'Significant exposure'
    },
    critical: {
      color: '#dc2626',
      bgColor: '#fef2f2',
      borderColor: '#fecaca',
      percentage: 90,
      label: 'Critical Risk',
      description: 'Maximum exposure'
    }
  };

  const config = riskConfig[riskLevel];
  const radius = (size - 40) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (config.percentage / 100) * circumference;

  // Animate the counter
  useEffect(() => {
    if (isVisible) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = exposureAmount / steps;
      const stepDuration = duration / steps;

      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= exposureAmount) {
          setAnimatedAmount(exposureAmount);
          clearInterval(timer);
        } else {
          setAnimatedAmount(Math.floor(current));
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [exposureAmount, isVisible]);

  // Intersection observer for animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('risk-gauge');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const formatCurrency = (amount: number) => {
    if (currency === 'KES') {
      if (amount >= 1000000000) {
        return `KSh ${(amount / 1000000000).toFixed(1)}B`;
      } else if (amount >= 1000000) {
        return `KSh ${(amount / 1000000).toFixed(1)}M`;
      } else if (amount >= 1000) {
        return `KSh ${(amount / 1000).toFixed(0)}K`;
      }
      return `KSh ${amount.toLocaleString()}`;
    } else {
      if (amount >= 1000000) {
        return `$${(amount / 1000000).toFixed(1)}M`;
      } else if (amount >= 1000) {
        return `$${(amount / 1000).toFixed(0)}K`;
      }
      return `$${amount.toLocaleString()}`;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
        );
      case 'down':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        );
    }
  };

  return (
    <div id="risk-gauge" className="relative">
      <div 
        className="glass-card rounded-2xl p-6 relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${config.bgColor} 0%, rgba(255,255,255,0.8) 100%)`,
          border: `2px solid ${config.borderColor}`,
          boxShadow: `0 8px 32px ${config.color}20, 0 0 0 1px ${config.color}10`
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-gray-800">Risk Exposure</h3>
            <p className="text-xs text-gray-600">Potential monetary fines</p>
          </div>
          <div className="flex items-center gap-1">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: config.color }}
            />
            <span 
              className="text-xs font-semibold px-2 py-1 rounded-full"
              style={{ 
                backgroundColor: `${config.color}20`,
                color: config.color
              }}
            >
              {config.label}
            </span>
          </div>
        </div>

        {/* Gauge */}
        <div className="flex justify-center items-center mb-4">
          <div className="relative" style={{ width: size, height: size }}>
            {/* Background circle */}
            <svg
              width={size}
              height={size}
              className="absolute inset-0 transform -rotate-90"
            >
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#e5e7eb"
                strokeWidth="6"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={config.color}
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-2000 ease-out"
                style={{
                  filter: `drop-shadow(0 0 6px ${config.color}40)`
                }}
              />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-center">
                <div 
                  className="text-xl font-bold mb-1"
                  style={{ color: config.color }}
                >
                  {formatCurrency(animatedAmount)}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {config.description}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trend indicator - Below gauge */}
        <div className="flex items-center justify-center gap-1 text-xs mb-3">
          {getTrendIcon()}
          <span className={trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-gray-500'}>
            {trendPercentage}% vs last month
          </span>
        </div>

        {/* Bottom metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-xs font-semibold text-gray-800">
              {formatCurrency(industryAverage)}
            </div>
            <div className="text-xs text-gray-600">Industry Average</div>
          </div>
          <div className="text-center">
            <div 
              className="text-xs font-semibold"
              style={{ color: config.color }}
            >
              {config.percentage}%
            </div>
            <div className="text-xs text-gray-600">Risk Level</div>
          </div>
        </div>

        {/* Pulsing effect for critical risk */}
        {riskLevel === 'critical' && (
          <div 
            className="absolute inset-0 rounded-2xl animate-pulse"
            style={{ 
              background: `radial-gradient(circle at center, ${config.color}10 0%, transparent 70%)`
            }}
          />
        )}
      </div>
    </div>
  );
}
