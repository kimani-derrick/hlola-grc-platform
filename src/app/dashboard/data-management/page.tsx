'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  DocumentTextIcon,
  ChartBarIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon
} from '../../../components/icons/CommonIcons';

export default function DataManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const dataManagementItems = [
    {
      title: 'Data Discovery',
      description: 'Automatically discover and catalog data across your organization',
      href: '/dashboard/data-management/discovery',
      icon: MagnifyingGlassIcon,
      status: 'active',
      progress: 85,
      color: 'blue'
    },
    {
      title: 'Data Classification',
      description: 'Classify and categorize data based on sensitivity and regulatory requirements',
      href: '/dashboard/data-management/classification',
      icon: DocumentTextIcon,
      status: 'active',
      progress: 72,
      color: 'green'
    },
    {
      title: 'Data Lineage',
      description: 'Track data flow and transformations across systems',
      href: '/dashboard/data-management/lineage',
      icon: ArrowPathIcon,
      status: 'in-progress',
      progress: 45,
      color: 'purple'
    },
    {
      title: 'DSR Management',
      description: 'Manage data subject rights requests and responses',
      href: '/dashboard/data-management/dsr-management',
      icon: ShieldCheckIcon,
      status: 'active',
      progress: 90,
      color: 'indigo'
    },
    {
      title: 'Data Subject Rights Assessments',
      description: 'Assess compliance with data subject rights requirements',
      href: '/dashboard/data-management/dsr-assessments',
      icon: ClipboardDocumentListIcon,
      status: 'active',
      progress: 78,
      color: 'emerald'
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

  const getProgressColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'purple': return 'bg-purple-500';
      case 'indigo': return 'bg-indigo-500';
      case 'emerald': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Management</h1>
        <p className="text-gray-600">
          Comprehensive data discovery, classification, lineage tracking, and data subject rights management.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search data management tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Data Management Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dataManagementItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${getProgressColor(item.color)} bg-opacity-10`}>
                <item.icon className={`h-6 w-6 ${getProgressColor(item.color).replace('bg-', 'text-')}`} />
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                {item.status.replace('-', ' ')}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {item.description}
            </p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{item.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getProgressColor(item.color)}`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Data Sources</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Classified Records</p>
              <p className="text-2xl font-bold text-gray-900">1.2M</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ArrowPathIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Data Flows</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <ShieldCheckIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">DSR Requests</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
