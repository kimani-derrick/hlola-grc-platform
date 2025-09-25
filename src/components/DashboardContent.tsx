'use client';

import { useAuth } from '../context/AuthContext';

export default function DashboardContent() {
  const { user } = useAuth();

  const stats = [
    { name: 'Compliance Score', value: '94%', change: '+2.1%', changeType: 'positive', icon: '📊' },
    { name: 'Active Policies', value: '12', change: '+1', changeType: 'positive', icon: '📋' },
    { name: 'Pending Reviews', value: '3', change: '-2', changeType: 'positive', icon: '⏳' },
    { name: 'Risk Score', value: 'Low', change: 'Stable', changeType: 'neutral', icon: '🛡️' },
  ];

  const recentActivities = [
    { id: 1, type: 'completed', message: 'Data mapping completed for EU operations', time: '2 hours ago', icon: '✅' },
    { id: 2, type: 'warning', message: 'Policy review due tomorrow: Privacy Policy v2.1', time: '4 hours ago', icon: '⚠️' },
    { id: 3, type: 'info', message: 'New team member Sarah joined Compliance team', time: '1 day ago', icon: '👥' },
    { id: 4, type: 'completed', message: 'Monthly compliance report generated', time: '2 days ago', icon: '📈' },
    { id: 5, type: 'info', message: 'GDPR assessment started for Q1 2025', time: '3 days ago', icon: '🔍' },
  ];

  const upcomingTasks = [
    { id: 1, title: 'Review Privacy Policy v2.1', dueDate: 'Tomorrow', priority: 'high', assignee: 'Sarah O.' },
    { id: 2, title: 'Complete vendor risk assessment', dueDate: 'Jan 30', priority: 'medium', assignee: 'John D.' },
    { id: 3, title: 'Update employee training modules', dueDate: 'Feb 5', priority: 'low', assignee: 'Maria K.' },
    { id: 4, title: 'Audit preparation checklist', dueDate: 'Feb 12', priority: 'high', assignee: 'Sarah O.' },
  ];

  const complianceModules = [
    { name: 'GDPR', status: 'compliant', score: 96, icon: '🇪🇺' },
    { name: 'POPIA', status: 'compliant', score: 94, icon: '🇿🇦' },
    { name: 'SOC 2', status: 'in-progress', score: 89, icon: '🔒' },
    { name: 'ISO 27001', status: 'compliant', score: 92, icon: '🛡️' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#26558e]">
              Welcome back, {user?.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Here's your compliance overview for today
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Today</p>
            <p className="text-lg font-semibold text-[#26558e]">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card rounded-2xl p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-[#26558e]">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
            <div className="mt-2 flex items-center">
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 
                stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">from last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Activities */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-[#26558e] mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="text-lg">{activity.icon}</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-sm text-[#41c3d6] hover:text-[#359bb0] font-medium">
            View all activities →
          </button>
        </div>

        {/* Upcoming Tasks */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-[#26558e] mb-4">Upcoming Tasks</h3>
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{task.title}</p>
                  <p className="text-xs text-gray-500">Assigned to {task.assignee}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{task.dueDate}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-sm text-[#41c3d6] hover:text-[#359bb0] font-medium">
            View all tasks →
          </button>
        </div>
      </div>

      {/* Compliance Modules */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-[#26558e] mb-6">Compliance Modules</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {complianceModules.map((module) => (
            <div key={module.name} className="bg-white/50 rounded-xl p-4 hover-lift">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{module.icon}</span>
                  <h4 className="font-medium text-gray-900">{module.name}</h4>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  module.status === 'compliant' ? 'bg-green-100 text-green-800' :
                  module.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {module.status}
                </span>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Score</span>
                  <span className="font-semibold">{module.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      module.score >= 95 ? 'bg-green-500' :
                      module.score >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${module.score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-[#26558e] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <button className="glass-button p-4 rounded-xl text-center hover-lift">
            <div className="text-2xl mb-2">📋</div>
            <p className="text-sm font-medium text-gray-900">New Policy</p>
          </button>
          <button className="glass-button p-4 rounded-xl text-center hover-lift">
            <div className="text-2xl mb-2">🔍</div>
            <p className="text-sm font-medium text-gray-900">Start Audit</p>
          </button>
          <button className="glass-button p-4 rounded-xl text-center hover-lift">
            <div className="text-2xl mb-2">📈</div>
            <p className="text-sm font-medium text-gray-900">Generate Report</p>
          </button>
          <button className="glass-button p-4 rounded-xl text-center hover-lift">
            <div className="text-2xl mb-2">👥</div>
            <p className="text-sm font-medium text-gray-900">Invite Team</p>
          </button>
        </div>
      </div>
    </div>
  );
}
