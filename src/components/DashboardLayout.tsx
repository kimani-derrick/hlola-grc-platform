'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊', current: true },
    { name: 'Compliance', href: '/dashboard/compliance', icon: '✅', current: false },
    { name: 'Risk Assessment', href: '/dashboard/risk', icon: '⚠️', current: false },
    { name: 'Policies', href: '/dashboard/policies', icon: '📋', current: false },
    { name: 'Audits', href: '/dashboard/audits', icon: '🔍', current: false },
    { name: 'Reports', href: '/dashboard/reports', icon: '📈', current: false },
    { name: 'Team', href: '/dashboard/team', icon: '👥', current: false },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️', current: false },
  ];

  return (
    <div className="dashboard-container bg-hlola-gradient">
      {/* Sidebar */}
      <div className={`dashboard-sidebar fixed inset-y-0 left-0 z-50 bg-white shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:flex lg:flex-col`}>
        <div className="flex items-center justify-center h-16 px-4 glass-nav border-b border-gray-200">
          <Image
            src="/brand/Hlola Full Color.svg"
            alt="hlola"
            width={120}
            height={36}
            className="h-8 w-auto"
          />
        </div>
        
        <nav className="mt-8 px-4 space-y-2 flex-1 overflow-y-auto">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                item.current 
                  ? 'bg-[#26558e] text-white' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#26558e]'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </a>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="dashboard-main">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 glass-nav px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 w-full">
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

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-[#26558e]">Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <button type="button" className="glass-button p-2 rounded-lg">
                <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button className="flex items-center gap-x-3 glass-card rounded-lg px-4 py-2 hover-lift">
                  <div className="h-8 w-8 rounded-full bg-[#26558e] flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-500">{user?.role}</div>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Dropdown menu would go here */}
                <div className="absolute right-0 mt-2 w-48 glass-card rounded-lg shadow-lg py-2 hidden">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</a>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Sign out
                  </button>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="glass-button px-4 py-2 rounded-lg text-sm font-medium text-[#26558e]"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="dashboard-content">
          <div className="px-4 py-8 sm:px-6 lg:px-8">
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
