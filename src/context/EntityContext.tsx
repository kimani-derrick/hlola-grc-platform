'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService, Entity } from '../services/api';

export interface EntityWithDates extends Omit<Entity, 'createdAt' | 'updatedAt' | 'lastAuditDate'> {
  createdAt: Date;
  updatedAt: Date;
  lastAuditDate?: Date;
}

interface EntityContextType {
  entities: EntityWithDates[];
  selectedEntity: EntityWithDates | null;
  addEntity: (entity: Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntity: (id: string, updates: Partial<Entity>) => void;
  deleteEntity: (id: string) => void;
  selectEntity: (entity: EntityWithDates | null) => void;
  isLoading: boolean;
  error: string | null;
  refreshEntities: () => Promise<void>;
}

const EntityContext = createContext<EntityContextType | undefined>(undefined);

// Helper function to convert API entity to EntityWithDates
const convertApiEntity = (apiEntity: Entity): EntityWithDates => ({
  ...apiEntity,
  createdAt: new Date(apiEntity.createdAt),
  updatedAt: new Date(apiEntity.updatedAt),
  lastAuditDate: apiEntity.lastAuditDate ? new Date(apiEntity.lastAuditDate) : undefined,
});

export function EntityProvider({ children }: { children: React.ReactNode }) {
  const [entities, setEntities] = useState<EntityWithDates[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<EntityWithDates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Always rely on backend to infer organization from auth token
      const response = await apiService.getEntities(undefined as any);
      
      if (response.success && response.data) {
        // Handle both direct array response and wrapped response
        const entitiesArray = Array.isArray(response.data) ? response.data : response.data.entities || [];
        const convertedEntities = entitiesArray.map(convertApiEntity);
        setEntities(convertedEntities);
        
        // Select first entity by default if none selected
        if (convertedEntities.length > 0 && !selectedEntity) {
          setSelectedEntity(convertedEntities[0]);
        }
      } else {
        throw new Error(response.error || 'Failed to fetch entities');
      }
    } catch (err) {
      console.error('Error fetching entities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch entities');
      // No mock fallback: API-only as requested
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, []);

  const addEntity = (entityData: Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntity: EntityWithDates = {
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

  const selectEntity = (entity: EntityWithDates | null) => {
    setSelectedEntity(entity);
  };

  const refreshEntities = async () => {
    await fetchEntities();
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
        error,
        refreshEntities,
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
