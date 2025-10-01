'use client';

import { useState } from 'react';
import { useEntity, Entity } from '../context/EntityContext';

interface AddEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddEntityModal({ isOpen, onClose }: AddEntityModalProps) {
  const { addEntity } = useEntity();
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    type: 'branch' as Entity['type'],
    status: 'active' as Entity['status'],
    complianceScore: '',
    riskLevel: 'medium' as Entity['riskLevel'],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const entityData = {
        name: formData.name,
        country: formData.country,
        type: formData.type,
        status: formData.status,
        complianceScore: formData.complianceScore ? parseInt(formData.complianceScore) : undefined,
        riskLevel: formData.riskLevel,
      };

      addEntity(entityData);
      
      // Reset form
      setFormData({
        name: '',
        country: '',
        type: 'branch',
        status: 'active',
        complianceScore: '',
        riskLevel: 'medium',
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding entity:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
      {/* Popup panel */}
      <div className="relative bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl max-w-md w-full pointer-events-auto border border-gray-200">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-[#26558e]/10">
                    <svg className="h-4 w-4 text-[#26558e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Add New Entity</h3>
                    <p className="text-sm text-gray-500">Create a new branch, office, or subsidiary</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="px-6 py-4">

              <div className="space-y-4">
                {/* Entity Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Entity Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#26558e] focus:border-[#26558e] sm:text-sm px-3 py-2 border"
                    placeholder="e.g., Nairobi Branch"
                  />
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#26558e] focus:border-[#26558e] sm:text-sm px-3 py-2 border"
                    placeholder="e.g., Kenya"
                  />
                </div>

                {/* Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Entity Type *
                  </label>
                  <select
                    name="type"
                    id="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#26558e] focus:border-[#26558e] sm:text-sm px-3 py-2 border"
                  >
                    <option value="branch">Branch</option>
                    <option value="office">Office</option>
                    <option value="subsidiary">Subsidiary</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status *
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#26558e] focus:border-[#26558e] sm:text-sm px-3 py-2 border"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Compliance Score */}
                <div>
                  <label htmlFor="complianceScore" className="block text-sm font-medium text-gray-700">
                    Compliance Score (Optional)
                  </label>
                  <input
                    type="number"
                    name="complianceScore"
                    id="complianceScore"
                    min="0"
                    max="100"
                    value={formData.complianceScore}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#26558e] focus:border-[#26558e] sm:text-sm px-3 py-2 border"
                    placeholder="e.g., 85"
                  />
                </div>

                {/* Risk Level */}
                <div>
                  <label htmlFor="riskLevel" className="block text-sm font-medium text-gray-700">
                    Risk Level
                  </label>
                  <select
                    name="riskLevel"
                    id="riskLevel"
                    value={formData.riskLevel}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#26558e] focus:border-[#26558e] sm:text-sm px-3 py-2 border"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#26558e]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-[#26558e] border border-transparent rounded-lg hover:bg-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#26558e] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </div>
                ) : (
                  'Add Entity'
                )}
              </button>
            </div>
          </form>
        </div>
    </div>
  );
}
