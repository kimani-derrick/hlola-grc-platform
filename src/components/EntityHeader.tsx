'use client';

import { useState } from 'react';
import { useEntity } from '../context/EntityContext';
import AddEntityModal from './AddEntityModal';
import EntityDropdown from './EntityDropdown';

export default function EntityHeader() {
  const { selectedEntity, isLoading } = useEntity();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card rounded-xl p-4 mb-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-[#26558e] to-[#1e3a5f] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#26558e]">
                  {selectedEntity ? selectedEntity.name : 'No Entity Selected'}
                </h2>
                <p className="text-sm text-gray-600">
                  {selectedEntity ? `${selectedEntity.country} • ${selectedEntity.type}` : 'Select an entity to view dashboard'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <EntityDropdown />
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-[#26558e] to-[#1e3a5f] text-white px-4 py-2 rounded-lg hover:from-[#1e3a5f] hover:to-[#26558e] transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium">Add Entity</span>
            </button>
          </div>
        </div>
        
        {selectedEntity && (
          <div className="mt-4 flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                selectedEntity.status === 'active' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-gray-600 capitalize">{selectedEntity.status}</span>
            </div>
            
            {selectedEntity.complianceScore && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Compliance Score:</span>
                <span className={`text-sm font-semibold ${
                  selectedEntity.complianceScore >= 90 ? 'text-green-600' :
                  selectedEntity.complianceScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {selectedEntity.complianceScore}%
                </span>
              </div>
            )}
            
            {selectedEntity.riskLevel && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Risk Level:</span>
                <span className={`text-sm font-semibold px-2 py-1 rounded-full text-xs ${
                  selectedEntity.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                  selectedEntity.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  selectedEntity.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedEntity.riskLevel.toUpperCase()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <AddEntityModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </>
  );
}
