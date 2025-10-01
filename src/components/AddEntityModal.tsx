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
    frameworkAssignment: '',
    admins: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const entityData = {
        name: formData.name,
        country: 'Default Country', // Default value since it's not in the form
        type: 'branch' as Entity['type'], // Default value
        status: 'active' as Entity['status'], // Default value
        complianceScore: undefined,
        riskLevel: 'medium' as Entity['riskLevel'], // Default value
      };

      addEntity(entityData);
      
      // Reset form
      setFormData({
        name: '',
        frameworkAssignment: '',
        admins: '',
        description: '',
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Dark layered background overlay */}
      <div 
        className="absolute inset-0 bg-black/30 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal panel - positioned on top of dashboard */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full z-[10000] border border-gray-200">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-[#26558e]/10">
                  <svg className="h-4 w-4 text-[#26558e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Add New Entity</h3>
                  <p className="text-sm text-gray-500">Create a new entity workspace by filling out the form below.</p>
                </div>
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
                    className="mt-1 block w-full border-blue-300 bg-blue-50 rounded-md shadow-sm focus:ring-[#26558e] focus:border-[#26558e] sm:text-sm px-3 py-2 border placeholder-gray-600"
                    placeholder="e.g. Product X"
                  />
                </div>

                {/* Framework Assignment */}
                <div>
                  <label htmlFor="frameworkAssignment" className="block text-sm font-medium text-gray-700">
                    Framework Assignment *
                  </label>
                  <div className="relative">
                    <select
                      name="frameworkAssignment"
                      id="frameworkAssignment"
                      required
                      value={formData.frameworkAssignment}
                      onChange={handleChange}
                      className="mt-1 block w-full border-blue-300 bg-blue-50 rounded-md shadow-sm focus:ring-[#26558e] focus:border-[#26558e] sm:text-sm px-3 py-2 border appearance-none text-gray-600"
                    >
                      <option value="" className="text-gray-600">Select frameworks</option>
                      <option value="gdpr" className="text-gray-800">GDPR</option>
                      <option value="ccpa" className="text-gray-800">CCPA</option>
                      <option value="sox" className="text-gray-800">SOX</option>
                      <option value="hipaa" className="text-gray-800">HIPAA</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Admins */}
                <div>
                  <label htmlFor="admins" className="block text-sm font-medium text-gray-700">
                    Admins *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="admins"
                      id="admins"
                      required
                      value={formData.admins}
                      onChange={handleChange}
                      className="mt-1 block flex-1 border-blue-300 bg-blue-50 rounded-md shadow-sm focus:ring-[#26558e] focus:border-[#26558e] sm:text-sm px-3 py-2 border placeholder-gray-600"
                      placeholder="Select or invite admins..."
                    />
                    <button
                      type="button"
                      className="mt-1 px-4 py-2 border border-blue-300 bg-white text-blue-600 rounded-md hover:bg-blue-50 focus:ring-[#26558e] focus:border-[#26558e] text-sm font-medium"
                    >
                      Invite
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description (optional)
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full border-blue-300 bg-blue-50 rounded-md shadow-sm focus:ring-[#26558e] focus:border-[#26558e] sm:text-sm px-3 py-2 border resize-none placeholder-gray-600"
                    placeholder="Notes about the entity's purpose"
                  />
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
                  'Create Entity'
                )}
              </button>
            </div>
          </form>
        </div>
    </div>
  );
}
