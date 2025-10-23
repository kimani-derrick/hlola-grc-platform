import { useState } from 'react';
import { X, Shield, Globe, Building, Heart, Lock, CreditCard, Plus, Trash2, CheckSquare } from 'lucide-react';

interface CreateFrameworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FrameworkFormData) => void;
  isSubmitting?: boolean;
}

interface ControlData {
  controlId: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  tasks: TaskData[];
}

interface TaskData {
  title: string;
  description: string;
  category: string;
  priority: string;
  estimatedHours: number;
  dueDate: string;
}

interface FrameworkFormData {
  name: string;
  description: string;
  region: string;
  country: string;
  category: string;
  type: string;
  priority: string;
  riskLevel: string;
  status: string;
  industryScope: string;
  maxFineAmount: string;
  maxFineCurrency: string;
  controls: ControlData[];
}

const categoryIcons = {
  'Privacy': Shield,
  'Security': Lock,
  'Compliance': Building,
  'Risk': Shield,
  'Financial': CreditCard,
  'Healthcare': Heart,
};

const categoryColors = {
  'Privacy': '#10B981',
  'Security': '#EF4444',
  'Compliance': '#8B5CF6',
  'Risk': '#F59E0B',
  'Financial': '#06B6D4',
  'Healthcare': '#EC4899',
};

export const CreateFrameworkModal = ({ isOpen, onClose, onSubmit, isSubmitting: externalIsSubmitting }: CreateFrameworkModalProps) => {
  const [formData, setFormData] = useState<FrameworkFormData>({
    name: '',
    description: '',
    region: 'Global',
    country: '',
    category: 'Privacy',
    type: 'Legal',
    priority: 'high',
    riskLevel: 'high',
    status: 'active',
    industryScope: 'All',
    maxFineAmount: '0',
    maxFineCurrency: 'EUR',
    controls: [],
  });

  const isSubmitting = externalIsSubmitting || false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof FrameworkFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addControl = () => {
    const newControl: ControlData = {
      controlId: '',
      title: '',
      description: '',
      category: 'Technical',
      priority: 'medium',
      tasks: [],
    };
    setFormData(prev => ({
      ...prev,
      controls: [...prev.controls, newControl]
    }));
  };

  const updateControl = (index: number, field: keyof ControlData, value: string | TaskData[]) => {
    setFormData(prev => ({
      ...prev,
      controls: prev.controls.map((control, i) => 
        i === index ? { ...control, [field]: value } : control
      )
    }));
  };

  const removeControl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      controls: prev.controls.filter((_, i) => i !== index)
    }));
  };

  const addTask = (controlIndex: number) => {
    const newTask: TaskData = {
      title: '',
      description: '',
      category: 'Implementation',
      priority: 'medium',
      estimatedHours: 1,
      dueDate: '',
    };
    updateControl(controlIndex, 'tasks', [...formData.controls[controlIndex].tasks, newTask]);
  };

  const updateTask = (controlIndex: number, taskIndex: number, field: keyof TaskData, value: string | number) => {
    const updatedTasks = formData.controls[controlIndex].tasks.map((task, i) => 
      i === taskIndex ? { ...task, [field]: value } : task
    );
    updateControl(controlIndex, 'tasks', updatedTasks);
  };

  const removeTask = (controlIndex: number, taskIndex: number) => {
    const updatedTasks = formData.controls[controlIndex].tasks.filter((_, i) => i !== taskIndex);
    updateControl(controlIndex, 'tasks', updatedTasks);
  };

  if (!isOpen) return null;

  const IconComponent = categoryIcons[formData.category as keyof typeof categoryIcons] || Shield;
  const iconColor = categoryColors[formData.category as keyof typeof categoryColors] || '#10B981';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: iconColor + '20' }}
            >
              <IconComponent className="w-5 h-5" style={{ color: iconColor }} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Create New Framework</h2>
              <p className="text-sm text-slate-600">Add a new compliance framework to the system</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Framework Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent"
                  placeholder="e.g., GDPR, PCI DSS, HIPAA"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Region *
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => handleChange('region', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent"
                >
                  <option value="Global">Global</option>
                  <option value="Europe">Europe</option>
                  <option value="Americas">Americas</option>
                  <option value="Asia">Asia</option>
                  <option value="Africa">Africa</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent"
                rows={3}
                placeholder="Brief description of the framework and its purpose"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent"
                  placeholder="e.g., United States, European Union"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Industry Scope
                </label>
                <select
                  value={formData.industryScope}
                  onChange={(e) => handleChange('industryScope', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent"
                >
                  <option value="All">All Industries</option>
                  <option value="Financial">Financial Services</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Technology">Technology</option>
                  <option value="Government">Government</option>
                </select>
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800">Classification</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent"
                >
                  <option value="Privacy">Privacy</option>
                  <option value="Security">Security</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Risk">Risk</option>
                  <option value="Financial">Financial</option>
                  <option value="Healthcare">Healthcare</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent"
                >
                  <option value="Legal">Legal</option>
                  <option value="Standards">Standards</option>
                  <option value="Industry">Industry</option>
                  <option value="International">International</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Priority *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Risk Level *
                </label>
                <select
                  value={formData.riskLevel}
                  onChange={(e) => handleChange('riskLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800">Financial Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Maximum Fine Amount
                </label>
                <input
                  type="number"
                  value={formData.maxFineAmount}
                  onChange={(e) => handleChange('maxFineAmount', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Currency
                </label>
                <select
                  value={formData.maxFineCurrency}
                  onChange={(e) => handleChange('maxFineCurrency', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="KES">KES (KSh)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-800">Controls</h3>
              <button
                type="button"
                onClick={addControl}
                className="flex items-center gap-2 px-3 py-2 bg-hlola-blue text-white rounded-lg hover:bg-hlola-blue/90 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Control
              </button>
            </div>

            {formData.controls.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Shield className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No controls added yet. Click "Add Control" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.controls.map((control, controlIndex) => (
                  <div key={controlIndex} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-slate-800">Control {controlIndex + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeControl(controlIndex)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Control ID
                        </label>
                        <input
                          type="text"
                          value={control.controlId}
                          onChange={(e) => updateControl(controlIndex, 'controlId', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent text-sm"
                          placeholder="e.g., A.5.1.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Category
                        </label>
                        <select
                          value={control.category}
                          onChange={(e) => updateControl(controlIndex, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent text-sm"
                        >
                          <option value="Technical">Technical</option>
                          <option value="Administrative">Administrative</option>
                          <option value="Physical">Physical</option>
                          <option value="Organizational">Organizational</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Control Title
                      </label>
                      <input
                        type="text"
                        value={control.title}
                        onChange={(e) => updateControl(controlIndex, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent text-sm"
                        placeholder="e.g., Implement access controls"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={control.description}
                        onChange={(e) => updateControl(controlIndex, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent text-sm"
                        rows={2}
                        placeholder="Control description"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={control.priority}
                        onChange={(e) => updateControl(controlIndex, 'priority', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent text-sm"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>

                    {/* Tasks for this control */}
                    <div className="border-t border-slate-200 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-slate-700">Tasks</h5>
                        <button
                          type="button"
                          onClick={() => addTask(controlIndex)}
                          className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors text-sm"
                        >
                          <Plus className="w-3 h-3" />
                          Add Task
                        </button>
                      </div>

                      {control.tasks.length === 0 ? (
                        <p className="text-sm text-slate-500 italic">No tasks added for this control</p>
                      ) : (
                        <div className="space-y-3">
                          {control.tasks.map((task, taskIndex) => (
                            <div key={taskIndex} className="bg-slate-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-600">Task {taskIndex + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => removeTask(controlIndex, taskIndex)}
                                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-slate-600 mb-1">
                                    Task Title
                                  </label>
                                  <input
                                    type="text"
                                    value={task.title}
                                    onChange={(e) => updateTask(controlIndex, taskIndex, 'title', e.target.value)}
                                    className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-hlola-blue focus:border-transparent text-sm"
                                    placeholder="Task title"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-slate-600 mb-1">
                                    Category
                                  </label>
                                  <select
                                    value={task.category}
                                    onChange={(e) => updateTask(controlIndex, taskIndex, 'category', e.target.value)}
                                    className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-hlola-blue focus:border-transparent text-sm"
                                  >
                                    <option value="Implementation">Implementation</option>
                                    <option value="Review">Review</option>
                                    <option value="Testing">Testing</option>
                                    <option value="Documentation">Documentation</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-slate-600 mb-1">
                                    Priority
                                  </label>
                                  <select
                                    value={task.priority}
                                    onChange={(e) => updateTask(controlIndex, taskIndex, 'priority', e.target.value)}
                                    className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-hlola-blue focus:border-transparent text-sm"
                                  >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-slate-600 mb-1">
                                    Hours
                                  </label>
                                  <input
                                    type="number"
                                    value={task.estimatedHours}
                                    onChange={(e) => updateTask(controlIndex, taskIndex, 'estimatedHours', parseInt(e.target.value) || 0)}
                                    className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-hlola-blue focus:border-transparent text-sm"
                                    min="1"
                                  />
                                </div>
                              </div>
                              
                              <div className="mt-2">
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  Description
                                </label>
                                <textarea
                                  value={task.description}
                                  onChange={(e) => updateTask(controlIndex, taskIndex, 'description', e.target.value)}
                                  className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-hlola-blue focus:border-transparent text-sm"
                                  rows={2}
                                  placeholder="Task description"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-hlola-gradient-strong text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Framework'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
