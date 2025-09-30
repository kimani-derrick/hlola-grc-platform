'use client';

import { useEffect, useState } from 'react';

interface SpeedometerGaugeProps {
  value: number;
  maxValue?: number;
  title: string;
  status: 'critical' | 'warning' | 'good';
  size?: number;
}

export default function SpeedometerGauge({ 
  value, 
  maxValue = 100, 
  title: _title, 
  status,
  size = 300 
}: SpeedometerGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 500);
    return () => clearTimeout(timer);
  }, [value]);

  // Calculate angle for needle (-90° at value 0, +90° at value maxValue)
  const angle = ((animatedValue / maxValue) * 180) - 90 - 90;
  
  // Status colors with enhanced gradients
  const statusConfig = {
    critical: {
      color: '#dc2626',
      glowColor: '#dc2626',
      bgGradient: 'from-red-500/20 to-red-700/30'
    },
    warning: {
      color: '#ea580c', 
      glowColor: '#ea580c',
      bgGradient: 'from-orange-500/20 to-orange-700/30'
    },
    good: {
      color: '#16a34a',
      glowColor: '#16a34a', 
      bgGradient: 'from-green-500/20 to-green-700/30'
    }
  };

  const config = statusConfig[status];
  
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const center = size / 2;
  const outerRadius = size * 0.4;
  const innerRadius = size * 0.32;
  const needleLength = outerRadius - 20;

  if (!isClient) {
    return (
      <div className="relative flex flex-col items-center">
        <div className="w-80 h-60 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
          <span className="text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size * 0.75} className="overflow-visible drop-shadow-2xl">
          {/* Outer Ring - Decorative */}
          <circle
            cx={center}
            cy={center}
            r={outerRadius + 8}
            fill="none"
            stroke="url(#outerGradient)"
            strokeWidth="2"
            className="opacity-60"
          />

          {/* Main Gauge Background Arc */}
          <path
            d={`M ${center - outerRadius} ${center} A ${outerRadius} ${outerRadius} 0 0 1 ${center + outerRadius} ${center}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="20"
            strokeLinecap="round"
            className="drop-shadow-sm"
          />
          
          {/* Progress Arc with Enhanced Styling */}
          <path
            d={`M ${center - outerRadius} ${center} A ${outerRadius} ${outerRadius} 0 0 1 ${center + outerRadius} ${center}`}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={Math.PI * outerRadius}
            strokeDashoffset={Math.PI * outerRadius - (Math.PI * outerRadius * (animatedValue / maxValue))}
            className="transition-all duration-2000 ease-out drop-shadow-lg"
            style={{
              filter: `drop-shadow(0 0 10px ${config.color}60) drop-shadow(0 0 20px ${config.color}30)`,
            }}
          />

          {/* Inner Ring for Depth */}
          <circle
            cx={center}
            cy={center}
            r={innerRadius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="1"
            className="opacity-40"
          />

          {/* Enhanced Tick Marks */}
          {Array.from({ length: 21 }, (_, i) => {
            const tickAngle = -90 + (i * 9); // 180 degrees / 20 intervals
            const isMainTick = i % 5 === 0;
            const isMidTick = i % 5 === 2.5;
            
            const outerTickRadius = outerRadius + (isMainTick ? 15 : isMidTick ? 8 : 5);
            const innerTickRadius = outerRadius - (isMainTick ? 8 : isMidTick ? 4 : 2);
            
            const outer = polarToCartesian(center, center, outerTickRadius, tickAngle);
            const inner = polarToCartesian(center, center, innerTickRadius, tickAngle);
            
            return (
              <line
                key={i}
                x1={outer.x}
                y1={outer.y}
                x2={inner.x}
                y2={inner.y}
                stroke={isMainTick ? "#4b5563" : isMidTick ? "#6b7280" : "#9ca3af"}
                strokeWidth={isMainTick ? "3" : isMidTick ? "2" : "1"}
                strokeLinecap="round"
                className="drop-shadow-sm"
              />
            );
          })}

          {/* Scale Numbers */}
          {Array.from({ length: 11 }, (_, i) => {
            const tickAngle = -90 + (i * 18);
            const numberRadius = outerRadius + 35;
            const pos = polarToCartesian(center, center, numberRadius, tickAngle);
            const number = (i * 10).toString();
            
            return (
              <text
                key={i}
                x={pos.x}
                y={pos.y + 6}
                textAnchor="middle"
                className="text-sm font-bold fill-gray-600"
                style={{ fontSize: '14px' }}
              >
                {number}
              </text>
            );
          })}

          {/* Premium Needle Design */}
          <g 
            transform={`rotate(${angle} ${center} ${center})`}
            className="transition-all duration-2000 ease-out"
          >
            {/* Needle Shadow */}
            <polygon
              points={`${center},${center} ${center + needleLength - 5},${center - 2} ${center + needleLength},${center} ${center + needleLength - 5},${center + 2}`}
              fill="rgba(0,0,0,0.3)"
              transform="translate(2,2)"
            />
            
            {/* Main Needle Body */}
            <polygon
              points={`${center},${center} ${center + needleLength - 5},${center - 4} ${center + needleLength},${center} ${center + needleLength - 5},${center + 4}`}
              fill={`url(#needleGradient)`}
              stroke={config.color}
              strokeWidth="1"
              className="drop-shadow-lg"
            />
            
            {/* Needle Tip */}
            <circle
              cx={center + needleLength - 2}
              cy={center}
              r="3"
              fill={config.color}
              className="animate-pulse"
              style={{
                filter: `drop-shadow(0 0 6px ${config.color}) drop-shadow(0 0 12px ${config.color}60)`,
              }}
            />
          </g>

          {/* Center Hub - Enhanced */}
          <circle
            cx={center}
            cy={center}
            r="20"
            fill="url(#hubGradient)"
            stroke="#374151"
            strokeWidth="2"
            className="drop-shadow-xl"
          />
          
          <circle
            cx={center}
            cy={center}
            r="12"
            fill={config.color}
            className="drop-shadow-lg animate-pulse"
            style={{
              filter: `drop-shadow(0 0 8px ${config.color}80)`,
            }}
          />

          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d1d5db" />
              <stop offset="100%" stopColor="#9ca3af" />
            </linearGradient>
            
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={config.color} />
              <stop offset="50%" stopColor={config.color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={config.color} stopOpacity="0.9" />
            </linearGradient>
            
            <radialGradient id="needleGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f9fafb" />
              <stop offset="50%" stopColor="#e5e7eb" />
              <stop offset="100%" stopColor="#9ca3af" />
            </radialGradient>
            
            <radialGradient id="hubGradient" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#f3f4f6" />
              <stop offset="70%" stopColor="#d1d5db" />
              <stop offset="100%" stopColor="#9ca3af" />
            </radialGradient>
          </defs>
        </svg>

      </div>

      {/* Status Indicator */}
      <div className="mt-16 text-center">
        <div className="text-lg font-bold text-gray-800 mb-1">Overall Compliance Score</div>
        <div className="flex items-center justify-center gap-2">
          <div 
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: config.color }}
          />
          <span className="text-sm font-medium text-gray-600">
            {status === 'critical' ? 'Below Standards' : 
             status === 'warning' ? 'Needs Attention' : 'Good Standing'}
          </span>
        </div>
      </div>
      
      {/* Extra spacing for bottom text */}
      <div className="h-16"></div>
    </div>
  );
}