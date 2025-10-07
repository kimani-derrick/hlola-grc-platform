'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon
} from '../../../components/icons/CommonIcons';

export default function RiskManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const riskManagementItems = [
    {
      title: 'Vendor Risk Management',
      description: 'Assess and manage risks associated with third-party vendors',
      href: '/dashboard/risk-management/vendor-risk',
      icon: BuildingOfficeIcon,
      status: 'active',
      riskLevel: 'medium',
      color: 'blue'
    },
    {
      title: 'Vendor Privacy Assessments',
      description: 'Evaluate vendor privacy practices and compliance',
      href: '/dashboard/risk-management/vendor-assessments',
      icon: ClipboardDocumentListIcon,
      status: 'active',
      riskLevel: 'low',
      color: 'green'
    },
    {
      title: 'Incident Management',
      description: 'Track and respond to security and privacy incidents',
      href: '/dashboard/risk-management/incident-management',
      icon: ExclamationTriangleIcon,
      status: 'active',
      riskLevel: 'high',
      color: 'red'
    },
    {
      title: 'Breach Risk Assessments',
      description: 'Assess potential breach risks and mitigation strategies',
      href: '/dashboard/risk-management/breach-assessments',
      icon: ShieldExclamationIcon,
      status: 'in-progress',
      riskLevel: 'medium',
      color: 'yellow'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      case 'critical': return 'text-red-800 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600 bg-blue-100';
      case 'green': return 'text-green-600 bg-green-100';
      case 'red': return 'text-red-600 bg-red-100';
      case 'yellow': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Risk Management</h1>
        <p className="text-gray-600">
          Comprehensive risk assessment and management for vendors, incidents, and breach scenarios.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search risk management tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Risk Management Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {riskManagementItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${getIconColor(item.color)}`}>
                <item.icon className="h-6 w-6" />
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status.replace('-', ' ')}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(item.riskLevel)}`}>
                  {item.riskLevel} risk
                </span>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {item.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Risk Overview Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Vendors</p>
              <p className="text-2xl font-bold text-gray-900">47</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Incidents</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ShieldExclamationIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Risk Assessments</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Risk Score</p>
              <p className="text-2xl font-bold text-gray-900">7.2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
