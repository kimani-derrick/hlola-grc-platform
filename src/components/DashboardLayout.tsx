'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  DashboardIcon,
  SettingsIcon
} from './icons/NavIcons';
import {
  PrivacyHubIcon,
  ControlsIcon,
  DocumentsIcon,
  AuditCentreIcon,
  AssessmentsIcon,
  ConsentManagementIcon,
  DSRManagementIcon,
  VendorRiskManagementIcon,
  DataManagementIcon,
  IncidentManagementIcon,
  LearningCentreIcon,
  DropdownArrowIcon,
  FrameworksIcon,
  ControlsSubIcon,
  DocumentsSubIcon,
  AuditCenterSubIcon,
  ReportsSubIcon
} from './icons/ExtendedNavIcons';
import { ReportsIcon } from './icons/NavIcons';

interface SubMenuItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current: boolean;
  hasDropdown?: boolean;
  subItems?: SubMenuItem[];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const toggleDropdown = (itemName: string) => {
    setOpenDropdowns(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon, current: true },
    { 
      name: 'Privacy Hub', 
      href: '/dashboard/privacy-hub', 
      icon: PrivacyHubIcon, 
      current: false,
      hasDropdown: true,
      subItems: [
        { name: 'Frameworks', href: '/dashboard/privacy-hub/frameworks', icon: FrameworksIcon },
        { name: 'Controls', href: '/dashboard/privacy-hub/controls', icon: ControlsSubIcon },
        { name: 'Documents', href: '/dashboard/privacy-hub/documents', icon: DocumentsSubIcon },
        { name: 'Audit Center', href: '/dashboard/privacy-hub/audit-center', icon: AuditCenterSubIcon },
        { name: 'Reports', href: '/dashboard/privacy-hub/reports', icon: ReportsSubIcon }
      ]
    },
    { 
      name: 'Assessments', 
      href: '/dashboard/assessments', 
      icon: AssessmentsIcon, 
      current: false,
      hasDropdown: true,
      subItems: [
        { name: 'Risk Assessments', href: '/dashboard/assessments/risk' },
        { name: 'Compliance Assessments', href: '/dashboard/assessments/compliance' },
        { name: 'Security Assessments', href: '/dashboard/assessments/security' }
      ]
    },
    { name: 'Consent Management', href: '/dashboard/consent-management', icon: ConsentManagementIcon, current: false },
    { name: 'DSR Management', href: '/dashboard/dsr-management', icon: DSRManagementIcon, current: false },
    { name: 'Vendor Risk Management', href: '/dashboard/vendor-risk-management', icon: VendorRiskManagementIcon, current: false },
    { 
      name: 'Data Management', 
      href: '/dashboard/data-management', 
      icon: DataManagementIcon, 
      current: false,
      hasDropdown: true,
      subItems: [
        { name: 'Data Discovery', href: '/dashboard/data-management/discovery' },
        { name: 'Data Classification', href: '/dashboard/data-management/classification' },
        { name: 'Data Lineage', href: '/dashboard/data-management/lineage' }
      ]
    },
    { name: 'Incident Management', href: '/dashboard/incident-management', icon: IncidentManagementIcon, current: false },
    { name: 'Learning Centre', href: '/dashboard/learning-centre', icon: LearningCentreIcon, current: false },
    { 
      name: 'Settings', 
      href: '/dashboard/settings', 
      icon: SettingsIcon, 
      current: false,
      hasDropdown: true,
      subItems: [
        { name: 'Account Settings', href: '/dashboard/settings/account' },
        { name: 'Organization Settings', href: '/dashboard/settings/organization' },
        { name: 'Integrations', href: '/dashboard/settings/integrations' }
      ]
    },
  ];

  return (
    <div className="dashboard-container bg-hlola-gradient">
      {/* Sidebar */}
      <div className={`dashboard-sidebar fixed inset-y-0 left-0 z-50 sidebar-gradient shadow-xl transform transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 ${
        sidebarCollapsed ? 'collapsed' : ''
      } rounded-r-2xl m-2`}>
        
        {/* Collapse Toggle Button - Desktop Only */}
        <div className={`hidden lg:flex items-center h-16 border-b border-white/10 ${
          sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'
        }`}>
          {!sidebarCollapsed && (
            <Image
              src="/brand/Hlola Full White.svg"
              alt="hlola"
              width={100}
              height={30}
              className="h-6 w-auto"
            />
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg 
              className={`w-5 h-5 text-white transition-transform duration-300 ${
                sidebarCollapsed ? 'rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-center h-16 px-4 border-b border-white/10">
          <Image
            src="/brand/Hlola Full White.svg"
            alt="hlola"
            width={100}
            height={30}
            className="h-6 w-auto"
          />
        </div>
        
        <nav className="mt-4 px-3 space-y-1 flex-1 overflow-y-auto sidebar-scroll">
          {navigation.map((item) => {
            const IconComponent = item.icon;
            const isDropdownOpen = openDropdowns.includes(item.name);
            
            return (
              <div key={item.name}>
                <a
                  href={item.href}
                  onClick={(e) => {
                    if (item.hasDropdown) {
                      e.preventDefault();
                      toggleDropdown(item.name);
                    }
                  }}
                  className={`nav-item group flex items-center ${
                    sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3'
                  } py-2.5 text-xs font-medium rounded-lg ${
                    item.current 
                      ? 'active text-white' 
                      : 'text-white/90 hover:text-white'
                  }`}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <div className="flex items-center">
                    <IconComponent className={`${
                      sidebarCollapsed ? 'w-6 h-6' : 'mr-3 w-6 h-6'
                    } ${
                      item.current ? 'text-white' : 'text-white/80 group-hover:text-white'
                    }`} />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </div>
                  
                  {item.hasDropdown && !sidebarCollapsed && (
                    <DropdownArrowIcon 
                      className={`dropdown-arrow w-4 h-4 text-white/70 ${
                        isDropdownOpen ? 'open' : ''
                      }`} 
                    />
                  )}
                </a>

                {/* Dropdown Sub-menu - Only show when not collapsed */}
                {item.hasDropdown && isDropdownOpen && !sidebarCollapsed && (
                  <div className="mt-2 ml-8 space-y-1 dropdown-enter-active">
                    {item.subItems?.map((subItem) => {
                      const SubItemIcon = subItem.icon;
                      return (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className="sub-menu-item flex items-center px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                        >
                          {SubItemIcon && (
                            <SubItemIcon className="w-4 h-4 mr-3 text-white/60" />
                          )}
                          {subItem.name}
                        </a>
                      );
                    })}
        </div>
      )}
    </div>
  );
})}
        </nav>
      </div>

      {/* Main content */}
      <div className={`dashboard-main transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'collapsed' : ''
      }`}>
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-2 glass-nav px-2 shadow-sm sm:gap-x-3 sm:px-4 lg:px-6 w-full">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="h-6 w-px bg-gray-200 lg:hidden" />

          <div className="flex flex-1 gap-x-2 self-stretch lg:gap-x-3">
            <div className="relative flex flex-1 items-center min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-[#26558e]">Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-x-1 lg:gap-x-2 flex-shrink-0">
              {/* Notifications */}
              <button type="button" className="glass-button p-1.5 rounded-lg">
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </button>

              {/* Profile dropdown */}
              <div className="relative flex-shrink-0">
                <button className="flex items-center gap-x-1 lg:gap-x-2 glass-card rounded-lg px-1.5 lg:px-3 py-1.5 hover-lift">
                  <div className="h-7 w-7 rounded-full bg-[#26558e] flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">
                      {user?.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-semibold text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-500">{user?.role}</div>
                  </div>
                  <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <button 
                onClick={handleLogout}
                className="glass-button px-2 lg:px-3 py-1.5 rounded-lg text-xs font-medium text-[#26558e] flex-shrink-0 whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="dashboard-content">
          <div className="px-2 py-6 sm:px-4 lg:px-6 max-w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}