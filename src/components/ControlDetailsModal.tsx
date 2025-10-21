'use client';

import { useState, useEffect } from 'react';
import { ControlDetail } from '../types/frameworks';
import { apiService } from '../services/api';

interface ControlDetailsModalProps {
  control: ControlDetail | null;
  isOpen: boolean;
  onClose: () => void;
  controlId?: string; // Add controlId prop
}

export default function ControlDetailsModal({ control, isOpen, onClose, controlId }: ControlDetailsModalProps) {
  // Add state for tasks
  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [tasksError, setTasksError] = useState<string | null>(null);

  // Fetch tasks on control change
  useEffect(() => {
    if (isOpen && controlId) {
      fetchTasks();
    }
  }, [isOpen, controlId]);

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      setTasksError(null);
      const response = await apiService.getTasksByControl(controlId!);
      if (response.success) {
        // The API returns tasks in response.data, but the actual tasks are in response.data
        const tasks = (response as any).data || [];
        setTasks(tasks);
      } else {
        setTasksError(response.error || 'Failed to load tasks');
      }
    } catch (error) {
      setTasksError('Error loading tasks');
    } finally {
      setLoadingTasks(false);
    }
  };

  // Calculate compliance from tasks
  const calculateComplianceFromTasks = () => {
    if (tasks.length === 0) return { progress: 0, status: 'Not Started' };
    
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const progress = Math.round((completedTasks / tasks.length) * 100);
    const status = progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started';
    
    return { progress, status };
  };

  if (!isOpen || !control) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                {control.id}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                {control.article}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{control.title}</h3>
          <p className="text-lg text-gray-600 mt-1">{control.subtitle}</p>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
            <p className="text-gray-600">{control.description}</p>
            <p className="text-gray-600 mt-3">{control.detailedDescription}</p>
          </div>

          {/* Compliance Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Compliance Status</h4>
            {(() => {
              const compliance = calculateComplianceFromTasks();
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium text-gray-900">{compliance.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-teal-500 h-2 rounded-full"
                        style={{ width: `${compliance.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Status</div>
                    <div className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${
                      compliance.status === 'In Progress' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : compliance.status === 'Not Started'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {compliance.status}
                    </div>
                  </div>
                </div>
              );
            })()}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
              <div>Tasks: {tasks.length}</div>
              <div>Completed: {tasks.filter(t => t.status === 'completed').length}</div>
            </div>
          </div>

          {/* Tasks Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center justify-between">
              <span>Tasks ({tasks.length})</span>
              {loadingTasks && <span className="text-sm text-gray-500">Loading...</span>}
            </h4>
            
            {tasksError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                {tasksError}
              </div>
            )}
            
            {!loadingTasks && tasks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No tasks assigned to this control yet.
              </div>
            )}
            
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{task.title}</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {task.status?.replace('_', ' ')}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {task.assignee_first_name && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {task.assignee_first_name} {task.assignee_last_name}
                      </div>
                    )}
                    
                    {task.due_date && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </div>
                    )}
                    
                    {task.priority && (
                      <div className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${
                          task.priority === 'high' ? 'bg-red-500' :
                          task.priority === 'medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`} />
                        {task.priority} priority
                      </div>
                    )}
                  </div>
                  
                  {task.progress !== undefined && task.progress !== null && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className="text-xs font-medium text-gray-700">{task.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-teal-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal footer removed per design request */}
      </div>
    </div>
  );
}
