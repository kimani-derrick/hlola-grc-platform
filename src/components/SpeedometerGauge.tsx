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
  title, 
  status,
  size = 200 
}: SpeedometerGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  // Calculate angle for needle (-90 to +90 degrees, 180 degree range)
  const angle = ((animatedValue / maxValue) * 180) - 90;
  
  // Status colors
  const statusColors = {
    critical: '#ef4444', // red-500
    warning: '#f97316',  // orange-500
    good: '#22c55e'      // green-500
  };

  const statusColor = statusColors[status];
  
  // Create arc path for the gauge background
  const createArcPath = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const center = size / 2;
  const radius = size * 0.35;
  const needleLength = radius - 10;

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size * 0.7} className="overflow-visible">
        {/* Gauge Background Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${Math.PI * radius} ${Math.PI * radius}`}
          strokeDashoffset={Math.PI * radius / 2}
        />
        
        {/* Progress Arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={statusColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${Math.PI * radius} ${Math.PI * radius}`}
          strokeDashoffset={Math.PI * radius - (Math.PI * radius * (animatedValue / maxValue)) / 2}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${statusColor}40)`,
          }}
        />

        {/* Tick marks */}
        {Array.from({ length: 11 }, (_, i) => {
          const tickAngle = -90 + (i * 18); // 180 degrees / 10 intervals
          const outerRadius = radius + 5;
          const innerRadius = radius - 5;
          const isMain = i % 2 === 0;
          
          const outer = polarToCartesian(center, center, outerRadius, tickAngle);
          const inner = polarToCartesian(center, center, innerRadius, tickAngle);
          
          return (
            <line
              key={i}
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              stroke="#9ca3af"
              strokeWidth={isMain ? "2" : "1"}
            />
          );
        })}

        {/* Needle */}
        <g transform={`rotate(${angle} ${center} ${center})`}>
          <line
            x1={center}
            y1={center}
            x2={center + needleLength}
            y2={center}
            stroke={statusColor}
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 2px 4px ${statusColor}60)`,
            }}
          />
          <circle
            cx={center}
            cy={center}
            r="6"
            fill={statusColor}
            className="transition-all duration-1000 ease-out"
          />
        </g>

        {/* Needle tip glow effect */}
        <g transform={`rotate(${angle} ${center} ${center})`}>
          <circle
            cx={center + needleLength - 5}
            cy={center}
            r="3"
            fill={statusColor}
            className="transition-all duration-1000 ease-out animate-pulse"
            style={{
              filter: `drop-shadow(0 0 8px ${statusColor})`,
            }}
          />
        </g>
      </svg>

      {/* Value Display */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div 
          className="text-4xl font-bold transition-all duration-1000 ease-out"
          style={{ color: statusColor }}
        >
          {Math.round(animatedValue)}
        </div>
        <div className={`text-xs font-semibold px-2 py-1 rounded-full text-white mt-1 inline-block`}
             style={{ backgroundColor: statusColor }}>
          {title.toUpperCase()}
        </div>
      </div>

      {/* Scale labels */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-sm font-medium text-gray-600">{title} Score</div>
        <div className="text-xs text-gray-500">Below Standards</div>
      </div>
    </div>
  );
}
