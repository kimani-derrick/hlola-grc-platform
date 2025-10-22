import { useState } from 'react';
import { X, Shield } from 'lucide-react';
import { Framework } from '@/types';

interface CreateControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ControlFormData) => void;
  framework: Framework | null;
}

interface ControlFormData {
  controlId: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  priority: string;
  implementationLevel: string;
  businessImpact: string;
  technicalRequirements: string;
  legalRequirements: string;
  implementationGuidance: string;
  testingProcedures: string;
}

export const CreateControlModal = ({ isOpen, onClose, onSubmit, framework }: CreateControlModalProps) => {
  const [formData, setFormData] = useState<ControlFormData>({
    controlId: '',
    title: '',
    description: '',
    category: 'Technical',
    subcategory: '',
    priority: 'medium',
    implementationLevel: 'Basic',
    businessImpact: '',
    technicalRequirements: '',
    legalRequirements: '',
    implementationGuidance: '',
    testingProcedures: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSubmit(formData);
    setIsSubmitting(false);
    onClose();
  };

  const handleChange = (field: keyof ControlFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Create New Control</h2>
              <p className="text-sm text-slate-600">
                Add a new control to {framework?.name || 'the selected framework'}
              </p>
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
                  Control ID *
                </label>
                <input
                  type="text"
                  value={formData.controlId}
                  onChange={(e) => handleChange('controlId', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent"
                  placeholder="e.g., A.5.1.1, PCI-1.1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent"
                >
                  <option value="Technical">Technical</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Physical">Physical</option>
                  <option value="Organizational">Organizational</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Control Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent"
                placeholder="e.g., Implement access controls"
                required
              />
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
                placeholder="Detailed description of the control and its purpose"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subcategory
                </label>
                <input
                  type="text"
                  value={formData.subcategory}
                  onChange={(e) => handleChange('subcategory', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent"
                  placeholder="e.g., Access Management, Data Protection"
                />
              </div>

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
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
          </div>

          {/* Implementation Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800">Implementation Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Implementation Level
              </label>
              <select
                value={formData.implementationLevel}
                onChange={(e) => handleChange('implementationLevel', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent"
              >
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Business Impact
              </label>
              <textarea
                value={formData.businessImpact}
                onChange={(e) => handleChange('businessImpact', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent"
                rows={2}
                placeholder="Describe the business impact of this control"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Technical Requirements
              </label>
              <textarea
                value={formData.technicalRequirements}
                onChange={(e) => handleChange('technicalRequirements', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent"
                rows={3}
                placeholder="Technical requirements and specifications"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Legal Requirements
              </label>
              <textarea
                value={formData.legalRequirements}
                onChange={(e) => handleChange('legalRequirements', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hlola-blue focus:border-transparent"
                rows={2}
                placeholder="Legal and regulatory requirements"
              />
            </div>
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
                'Create Control'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
