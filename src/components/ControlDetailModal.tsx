'use client';

import { useState, useEffect } from 'react';
import { formatDate } from '../utils/dateUtils';
import TaskDetailModal from './TaskDetailModal';
import { Control } from './controls/ControlCard';

interface ControlDetailModalProps {
  control: Control;
  isOpen: boolean;
  onClose: () => void;
}

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'system' | 'manual';
  status: 'completed' | 'in-progress' | 'not-started' | 'overdue';
  progress: number;
  assignee?: string;
  dueDate?: string;
}

// Generate tasks based on the control
const generateTasksForControl = (control: ControlDetailModalProps['control']): Task[] => {
  const baseTasks = [
    {
      id: `${control.id}-1`,
      title: 'Update data inventory for compliance',
      description: 'Review and update the data inventory to ensure it meets current compliance requirements',
      type: 'system' as const,
      status: 'in-progress' as const,
      progress: 60,
      assignee: 'John Doe',
      dueDate: '2024-06-15'
    },
    {
      id: `${control.id}-2`,
      title: 'Implement access controls',
      description: 'Set up proper access controls and permission management',
      type: 'system' as const,
      status: 'not-started' as const,
      progress: 0,
      assignee: 'Sarah Smith',
      dueDate: '2024-05-30'
    },
    {
      id: `${control.id}-3`,
      title: 'Document processing activities',
      description: 'Create comprehensive documentation of all data processing activities',
      type: 'manual' as const,
      status: 'overdue' as const,
      progress: 30,
      assignee: 'Mike Johnson',
      dueDate: '2024-04-15'
    }
  ];

  // Add control-specific tasks
  const controlSpecificTasks = [
    {
      id: `${control.id}-4`,
      title: control.title,
      description: control.description,
      type: 'system' as const,
      status: control.status === 'completed' ? 'completed' as const : 
              control.status === 'in-progress' ? 'in-progress' as const : 'not-started' as const,
      progress: control.completionRate || 0,
      assignee: control.assignee || 'Compliance Team',
      dueDate: control.dueDate || '2024-12-31'
    }
  ];

  return [...baseTasks, ...controlSpecificTasks];
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-50 text-green-700 border border-green-200';
    case 'in-progress':
      return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
    case 'not-started':
      return 'bg-gray-50 text-gray-700 border border-gray-200';
    case 'overdue':
      return 'bg-red-50 text-red-700 border border-red-200';
    default:
      return 'bg-gray-50 text-gray-700 border border-gray-200';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getProgressColor = (progress: number) => {
  if (progress === 100) return 'bg-green-500';
  if (progress >= 50) return 'bg-blue-500';
  if (progress > 0) return 'bg-yellow-500';
  return 'bg-gray-300';
};

export default function ControlDetailModal({ control, isOpen, onClose }: ControlDetailModalProps) {
  const [selectedComplianceStatus, setSelectedComplianceStatus] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskFilter, setTaskFilter] = useState('all');
  const [taskSort, setTaskSort] = useState('dueDate');
  const [activeTaskMenu, setActiveTaskMenu] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Update tasks when control changes
  useEffect(() => {
    if (control) {
      setTasks(generateTasksForControl(control));
    }
  }, [control]);

  // Note: menu is toggle-only; clicking an action will close it

  if (!isOpen) return null;

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const overdueTasks = tasks.filter(t => t.status === 'overdue').length;

  const handleTaskAction = (taskId: string, action: string) => {
    switch (action) {
      case 'view-details':
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          setSelectedTask(task);
          setIsTaskDetailOpen(true);
        }
        setActiveTaskMenu(null);
        break;
      case 'mark-in-progress':
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId 
              ? { ...task, status: 'in-progress' as const }
              : task
          )
        );
        setActiveTaskMenu(null);
        break;
      case 'mark-complete':
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId 
              ? { ...task, status: 'completed' as const, progress: 100 }
              : task
          )
        );
        setActiveTaskMenu(null);
        break;
      case 'delegate':
        // Handle delegate task - could open a delegate modal
        console.log('Delegate task:', taskId);
        setActiveTaskMenu(null);
        break;
      default:
        setActiveTaskMenu(null);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (taskFilter === 'all') return true;
    if (taskFilter === 'system') return task.type === 'system';
    if (taskFilter === 'manual') return task.type === 'manual';
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200">
                    {control.country}-{control.id}
                  </span>
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200">
                    {control.category}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{control.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-xs font-medium">{control.completionRate}% At Risk</span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Control Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-indigo-500 rounded"></div>
                <h3 className="text-lg font-semibold text-gray-900">Description</h3>
              </div>
              <p className="text-gray-700">{control.description}</p>
            </div>

            {/* Legal & Implementation */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9" />
                    </svg>
                    <h4 className="font-semibold text-gray-900">Legal Provision</h4>
                  </div>
                  <p className="text-sm text-gray-600">Art. 6</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h4 className="font-semibold text-gray-900">Implementation Guidance</h4>
                  </div>
                  <p className="text-sm text-gray-600">Document the lawful basis for processing in your data processing register.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence Requirements */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Evidence Requirements</h3>
            </div>
            <p className="text-gray-700">Processing register, data mapping documentation.</p>
          </div>

          {/* Status and Evidence Management */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Completion: 0/2</span>
                <span className="text-sm font-medium text-gray-900">{control.completionRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">SLA Status:</span>
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                  Overdue
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <h4 className="font-semibold text-gray-900">Control Evidence</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">Upload evidence files to demonstrate compliance with this control requirement.</p>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Evidence
              </button>
            </div>
          </div>

          {/* Tasks Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m-2 0v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2h2zm8-2V3a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">Tasks Management</h3>
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Task
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="text-sm text-gray-600">
                {tasks.length} total tasks • {completedTasks} completed • {inProgressTasks} in progress • {overdueTasks} overdue
              </div>
            </div>

            {/* Task Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <select
                  value={taskFilter}
                  onChange={(e) => setTaskFilter(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Tasks</option>
                  <option value="system">System Generated</option>
                  <option value="manual">Manual Tasks</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <select
                  value={taskSort}
                  onChange={(e) => setTaskSort(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="status">Status</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">System Generated Tasks</span>
              </div>
            </div>

            {/* Task Cards */}
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{task.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.type === 'system' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {task.type === 'system' ? 'System' : 'Manual'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
                        </span>
                        <div className="flex items-center gap-1">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getProgressColor(task.progress)}`}
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs">{task.progress}%</span>
                        </div>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {task.assignee}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0v1a2 2 0 002 2h4a2 2 0 002-2V7m-6 0h6m-6 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                          </svg>
                          {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                        className={`text-gray-400 hover:text-gray-600 transition-transform ${expandedTaskId === task.id ? 'rotate-180' : ''}`}
                      >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div className="relative">
                        <button 
                          onClick={() => setActiveTaskMenu(activeTaskMenu === task.id ? null : task.id)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                        >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                        
                        {/* Task Action Menu */}
                        {activeTaskMenu === task.id && (
                  <div className="absolute right-0 top-8 bg-white rounded-xl shadow-xl py-1 z-10 min-w-[160px] border border-gray-200">
                            <button
                              onClick={() => handleTaskAction(task.id, 'view-details')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-50"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleTaskAction(task.id, 'mark-in-progress')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-50"
                            >
                              Mark In Progress
                            </button>
                            <button
                              onClick={() => handleTaskAction(task.id, 'mark-complete')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-50"
                            >
                              Mark Complete
                            </button>
                            <button
                              onClick={() => handleTaskAction(task.id, 'delegate')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-50"
                            >
                              Delegate Task
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Collapsible Upload Evidence for this task */}
                  {expandedTaskId === task.id && (
                    <div className="mt-3 border-t border-gray-100 pt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <span className="text-sm font-medium text-gray-900">Upload Evidence</span>
                        </div>
                        <button className="px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm">Choose File</button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Attach documents proving completion for this task (PDF, DOCX, images).</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Update Compliance Status */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Update Compliance Status</h3>
            <p className="text-sm text-gray-600 mb-4">Manually update the compliance level for this control.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedComplianceStatus('at-risk')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  selectedComplianceStatus === 'at-risk'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                At Risk
              </button>
              <button
                onClick={() => setSelectedComplianceStatus('in-progress')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  selectedComplianceStatus === 'in-progress'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                In Progress
              </button>
              <button
                onClick={() => setSelectedComplianceStatus('compliant')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  selectedComplianceStatus === 'compliant'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Compliant
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={isTaskDetailOpen}
          onClose={() => {
            setIsTaskDetailOpen(false);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
}
