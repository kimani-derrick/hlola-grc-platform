'use client';

import { useState } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { formatDate } from '../../../../utils/dateUtils';

// Framework status types
type FrameworkStatus = 'active' | 'draft' | 'inactive' | 'pending';

interface Framework {
  id: string;
  name: string;
  description: string;
  status: FrameworkStatus;
  compliance: number;
  controls: number;
  lastUpdated: string;
  region: string;
  category: 'Privacy' | 'Security' | 'Compliance' | 'Risk';
  icon: string;
  color: string;
}

const frameworks: Framework[] = [
  {
    id: '1',
    name: 'Kenya',
    description: 'Data Protection Act 2019 - Essential for all Kenyan businesses. Avoid KSh 5 million fines and build customer trust.',
    status: 'active',
    compliance: 87,
    controls: 34,
    lastUpdated: '2024-01-15',
    region: 'Kenya',
    category: 'Privacy',
    icon: '🇰🇪',
    color: 'bg-red-600'
  },
  {
    id: '2',
    name: 'Ghana',
    description: 'Data Protection Act 2012 - Required for all Ghanaian companies handling personal data. Protect your business reputation.',
    status: 'active',
    compliance: 76,
    controls: 29,
    lastUpdated: '2024-01-12',
    region: 'Ghana',
    category: 'Privacy',
    icon: '🇬🇭',
    color: 'bg-yellow-600'
  },
  {
    id: '3',
    name: 'Nigeria',
    description: 'Nigeria Data Protection Act 2023 - Mandatory for Nigerian businesses. Avoid ₦10 billion penalties and regulatory issues.',
    status: 'active',
    compliance: 82,
    controls: 38,
    lastUpdated: '2024-01-10',
    region: 'Nigeria',
    category: 'Privacy',
    icon: '🇳🇬',
    color: 'bg-green-600'
  },
  {
    id: '4',
    name: 'South Africa',
    description: 'Protection of Personal Information Act (POPIA) - Required for all SA businesses. Avoid R10 million fines.',
    status: 'active',
    compliance: 91,
    controls: 47,
    lastUpdated: '2024-01-08',
    region: 'South Africa',
    category: 'Privacy',
    icon: '🇿🇦',
    color: 'bg-blue-600'
  },
  {
    id: '5',
    name: 'Uganda',
    description: 'Data Protection and Privacy Act 2019 - Essential for Ugandan operations. Build trust with local customers.',
    status: 'draft',
    compliance: 43,
    controls: 31,
    lastUpdated: '2024-01-05',
    region: 'Uganda',
    category: 'Privacy',
    icon: '🇺🇬',
    color: 'bg-purple-600'
  },
  {
    id: '6',
    name: 'Ethiopia',
    description: 'Data Protection Proclamation (Draft) - Prepare for Ethiopia\'s emerging data protection framework. Stay ahead of regulations.',
    status: 'pending',
    compliance: 12,
    controls: 28,
    lastUpdated: '2024-01-03',
    region: 'Ethiopia',
    category: 'Privacy',
    icon: '🇪🇹',
    color: 'bg-orange-600'
  },
  {
    id: '7',
    name: 'Rwanda',
    description: 'Law on Data Protection and Privacy 2021 - Required for businesses in Rwanda. Access East African markets confidently.',
    status: 'active',
    compliance: 68,
    controls: 32,
    lastUpdated: '2024-01-01',
    region: 'Rwanda',
    category: 'Privacy',
    icon: '🇷🇼',
    color: 'bg-teal-600'
  },
  {
    id: '8',
    name: 'Tanzania',
    description: 'Personal Data Protection Act 2022 - Essential for Tanzanian businesses. Protect customer data and avoid penalties.',
    status: 'draft',
    compliance: 35,
    controls: 30,
    lastUpdated: '2023-12-28',
    region: 'Tanzania',
    category: 'Privacy',
    icon: '🇹🇿',
    color: 'bg-indigo-600'
  },
  {
    id: '9',
    name: 'Morocco',
    description: 'Law 09-08 on Personal Data Protection - Required for Moroccan operations. Access North African markets with confidence.',
    status: 'active',
    compliance: 73,
    controls: 33,
    lastUpdated: '2023-12-25',
    region: 'Morocco',
    category: 'Privacy',
    icon: '🇲🇦',
    color: 'bg-red-700'
  },
  {
    id: '10',
    name: 'Egypt',
    description: 'Personal Data Protection Law 2020 - Essential for Egyptian businesses. Demonstrate professional data governance.',
    status: 'active',
    compliance: 64,
    controls: 36,
    lastUpdated: '2023-12-20',
    region: 'Egypt',
    category: 'Privacy',
    icon: '🇪🇬',
    color: 'bg-yellow-700'
  },
  {
    id: '11',
    name: 'Mauritius',
    description: 'Data Protection Act 2017 - Required for Mauritian businesses. Build trust as a regional financial hub.',
    status: 'active',
    compliance: 79,
    controls: 35,
    lastUpdated: '2023-12-15',
    region: 'Mauritius',
    category: 'Privacy',
    icon: '🇲🇺',
    color: 'bg-cyan-600'
  },
  {
    id: '12',
    name: 'Botswana',
    description: 'Data Protection Act 2018 - Essential for Botswanan operations. Enhance business credibility and customer trust.',
    status: 'draft',
    compliance: 51,
    controls: 27,
    lastUpdated: '2023-12-10',
    region: 'Botswana',
    category: 'Privacy',
    icon: '🇧🇼',
    color: 'bg-gray-600'
  }
];

const statusConfig = {
  active: { color: 'text-green-700', bg: 'bg-green-100', dot: 'bg-green-500' },
  draft: { color: 'text-yellow-700', bg: 'bg-yellow-100', dot: 'bg-yellow-500' },
  inactive: { color: 'text-gray-700', bg: 'bg-gray-100', dot: 'bg-gray-500' },
  pending: { color: 'text-blue-700', bg: 'bg-blue-100', dot: 'bg-blue-500' }
};

export default function FrameworksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);

  const filteredFrameworks = frameworks.filter(framework => {
    const matchesSearch = framework.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         framework.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || framework.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || framework.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 80) return 'text-green-600';
    if (compliance >= 60) return 'text-yellow-600';
    if (compliance >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getComplianceBg = (compliance: number) => {
    if (compliance >= 80) return 'bg-green-500';
    if (compliance >= 60) return 'bg-yellow-500';
    if (compliance >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <DashboardLayout>
      <div className="px-2 py-4 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">African Country Compliance</h1>
            <p className="text-gray-600 mt-2">Select your country to see specific data protection laws and requirements for your business</p>
            
            {/* What are frameworks explanation */}
            <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>How does this work?</strong> Each country has its own data protection laws. Choose your country to see exactly what your business needs to do 
                    to protect customer data, avoid fines, and build trust with your customers.
                  </p>
                </div>
              </div>
            </div>
          </div>
            <button className="bg-[#26558e] text-white px-6 py-3 rounded-lg hover:bg-[#1e4470] transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Country
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Laws You&apos;re Following</p>
                  <p className="text-2xl font-bold text-gray-900">7</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Still Working On</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                  <p className="text-2xl font-bold text-gray-900">63%</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m-2 0v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2h2zm8-2V3a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
                  <p className="text-2xl font-bold text-gray-900">289</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search countries..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-4 flex-shrink-0">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent min-w-[140px]"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Privacy">Privacy</option>
                <option value="Security">Security</option>
                <option value="Compliance">Compliance</option>
                <option value="Risk">Risk</option>
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent min-w-[120px]"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Frameworks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFrameworks.map((framework) => (
            <div
              key={framework.id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedFramework(framework)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 ${framework.color} rounded-xl flex items-center justify-center text-white text-xl mr-4`}>
                      {framework.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{framework.name}</h3>
                      <p className="text-sm text-gray-500">{framework.region}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[framework.status].bg} ${statusConfig[framework.status].color}`}>
                    <span className={`w-2 h-2 rounded-full mr-1.5 ${statusConfig[framework.status].dot}`}></span>
                    {framework.status.charAt(0).toUpperCase() + framework.status.slice(1)}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{framework.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className={`text-sm font-semibold ${getComplianceColor(framework.compliance)}`}>
                      {framework.compliance}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getComplianceBg(framework.compliance)}`}
                      style={{ width: `${framework.compliance}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{framework.controls} tasks to complete</span>
                    <span>Updated {formatDate(framework.lastUpdated)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFrameworks.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m-2 0v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2h2zm8-2V3a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No countries found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find countries.</p>
          </div>
        )}
      </div>

      {/* Framework Details Modal/Drawer - Placeholder */}
      {selectedFramework && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className={`w-16 h-16 ${selectedFramework.color} rounded-xl flex items-center justify-center text-white text-2xl mr-4`}>
                    {selectedFramework.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedFramework.name}</h2>
                    <p className="text-gray-600">{selectedFramework.region}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFramework(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-gray-700 mb-6">{selectedFramework.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Compliance Score</div>
                  <div className={`text-2xl font-bold ${getComplianceColor(selectedFramework.compliance)}`}>
                    {selectedFramework.compliance}%
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Total Controls</div>
                  <div className="text-2xl font-bold text-gray-900">{selectedFramework.controls}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-[#26558e] text-white px-4 py-2 rounded-lg hover:bg-[#1e4470] transition-colors">
                  View Details
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
