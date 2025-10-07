'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  ClipboardDocumentListIcon,
  ChartBarIcon,
  DocumentCheckIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '../../../components/icons/CommonIcons';

export default function PrivacyAssessmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const assessmentItems = [
    {
      title: 'Privacy Impact Assessments',
      description: 'Evaluate the privacy impact of data processing activities',
      href: '/dashboard/privacy-assessments/privacy-impact',
      icon: ClipboardDocumentListIcon,
      status: 'active',
      count: 8,
      color: 'blue'
    },
    {
      title: 'Privacy Maturity Assessments',
      description: 'Assess organizational privacy maturity and capabilities',
      href: '/dashboard/privacy-assessments/privacy-maturity',
      icon: ChartBarIcon,
      status: 'active',
      count: 3,
      color: 'green'
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

  const getIconColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600 bg-blue-100';
      case 'green': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Assessments</h1>
        <p className="text-gray-600">
          Comprehensive privacy impact and maturity assessments to ensure compliance and best practices.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search privacy assessments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Assessment Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {assessmentItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${getIconColor(item.color)}`}>
                <item.icon className="h-6 w-6" />
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
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Active Assessments</span>
              <span className="text-lg font-semibold text-gray-900">{item.count}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Assessment Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Assessments</p>
              <p className="text-2xl font-bold text-gray-900">11</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DocumentCheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">7</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
