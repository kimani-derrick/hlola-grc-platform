'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Entity {
  id: string;
  name: string;
  country: string;
  type: 'branch' | 'subsidiary' | 'office';
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  complianceScore?: number;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  lastAuditDate?: Date;
}

interface EntityContextType {
  entities: Entity[];
  selectedEntity: Entity | null;
  addEntity: (entity: Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntity: (id: string, updates: Partial<Entity>) => void;
  deleteEntity: (id: string) => void;
  selectEntity: (entity: Entity | null) => void;
  isLoading: boolean;
}

const EntityContext = createContext<EntityContextType | undefined>(undefined);

// Mock data for demonstration
const mockEntities: Entity[] = [
  {
    id: '1',
    name: 'Nairobi Branch',
    country: 'Kenya',
    type: 'branch',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    complianceScore: 85,
    riskLevel: 'medium',
    lastAuditDate: new Date('2024-01-10'),
  },
  {
    id: '2',
    name: 'Lagos Office',
    country: 'Nigeria',
    type: 'office',
    status: 'active',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    complianceScore: 92,
    riskLevel: 'low',
    lastAuditDate: new Date('2024-01-25'),
  },
  {
    id: '3',
    name: 'Cape Town Subsidiary',
    country: 'South Africa',
    type: 'subsidiary',
    status: 'active',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    complianceScore: 78,
    riskLevel: 'high',
    lastAuditDate: new Date('2024-01-05'),
  },
  {
    id: '4',
    name: 'Accra Branch',
    country: 'Ghana',
    type: 'branch',
    status: 'inactive',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    complianceScore: 65,
    riskLevel: 'critical',
    lastAuditDate: new Date('2023-12-15'),
  },
];

export function EntityProvider({ children }: { children: React.ReactNode }) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setEntities(mockEntities);
      setSelectedEntity(mockEntities[0]); // Select first entity by default
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const addEntity = (entityData: Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntity: Entity = {
      ...entityData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setEntities(prev => [...prev, newEntity]);
  };

  const updateEntity = (id: string, updates: Partial<Entity>) => {
    setEntities(prev =>
      prev.map(entity =>
        entity.id === id
          ? { ...entity, ...updates, updatedAt: new Date() }
          : entity
      )
    );
    
    // Update selected entity if it's the one being updated
    if (selectedEntity?.id === id) {
      setSelectedEntity(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    }
  };

  const deleteEntity = (id: string) => {
    setEntities(prev => prev.filter(entity => entity.id !== id));
    
    // Clear selection if the selected entity is deleted
    if (selectedEntity?.id === id) {
      setSelectedEntity(entities.length > 1 ? entities.find(e => e.id !== id) || null : null);
    }
  };

  const selectEntity = (entity: Entity | null) => {
    setSelectedEntity(entity);
  };

  return (
    <EntityContext.Provider
      value={{
        entities,
        selectedEntity,
        addEntity,
        updateEntity,
        deleteEntity,
        selectEntity,
        isLoading,
      }}
    >
      {children}
    </EntityContext.Provider>
  );
}

export function useEntity() {
  const context = useContext(EntityContext);
  if (context === undefined) {
    throw new Error('useEntity must be used within an EntityProvider');
  }
  return context;
}
