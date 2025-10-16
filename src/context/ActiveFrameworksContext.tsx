'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ActiveFrameworksContextType {
  activeFrameworkIds: string[];
  setActiveFrameworkIds: (ids: string[]) => void;
  addActiveFramework: (id: string) => void;
  removeActiveFramework: (id: string) => void;
  isFrameworkActive: (id: string) => boolean;
  resetToDefault: () => void;
  getActiveFrameworkCount: () => number;
}

const ActiveFrameworksContext = createContext<ActiveFrameworksContextType | undefined>(undefined);

export const useActiveFrameworks = () => {
  const context = useContext(ActiveFrameworksContext);
  if (context === undefined) {
    throw new Error('useActiveFrameworks must be used within an ActiveFrameworksProvider');
  }
  return context;
};

interface ActiveFrameworksProviderProps {
  children: ReactNode;
}

export const ActiveFrameworksProvider: React.FC<ActiveFrameworksProviderProps> = ({ children }) => {
  // Initialize with empty array - will be populated by components that load assigned frameworks
  const [activeFrameworkIds, setActiveFrameworkIds] = useState<string[]>([]);

  // Load from localStorage on mount, but clear if it's from a different user
  useEffect(() => {
    const savedActiveFrameworks = localStorage.getItem('activeFrameworks');
    const savedUserId = localStorage.getItem('activeFrameworksUserId');
    const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    
    // Clear saved frameworks if user has changed
    if (savedUserId && currentUserId && savedUserId !== currentUserId) {
      localStorage.removeItem('activeFrameworks');
      localStorage.removeItem('activeFrameworksUserId');
      setActiveFrameworkIds([]);
      return;
    }
    
    if (savedActiveFrameworks) {
      try {
        const parsed = JSON.parse(savedActiveFrameworks);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setActiveFrameworkIds(parsed);
        }
      } catch (error) {
        console.error('Error parsing saved active frameworks:', error);
        // Keep default value if parsing fails
      }
    }
  }, []);

  // Save to localStorage whenever activeFrameworkIds changes
  useEffect(() => {
    localStorage.setItem('activeFrameworks', JSON.stringify(activeFrameworkIds));
    // Also save the current user ID to detect user changes
    const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    if (currentUserId) {
      localStorage.setItem('activeFrameworksUserId', currentUserId);
    }
  }, [activeFrameworkIds]);

  const addActiveFramework = (id: string) => {
    if (!activeFrameworkIds.includes(id)) {
      const newActiveFrameworks = [...activeFrameworkIds, id];
      setActiveFrameworkIds(newActiveFrameworks);
    }
  };

  const removeActiveFramework = (id: string) => {
    const newActiveFrameworks = activeFrameworkIds.filter(frameworkId => frameworkId !== id);
    setActiveFrameworkIds(newActiveFrameworks);
  };

  const isFrameworkActive = (id: string) => {
    return activeFrameworkIds.includes(id);
  };

  const resetToDefault = () => {
    setActiveFrameworkIds([]); // Reset to empty - will be populated by assigned frameworks
    // Clear localStorage as well
    localStorage.removeItem('activeFrameworks');
    localStorage.removeItem('activeFrameworksUserId');
  };

  const getActiveFrameworkCount = () => {
    return activeFrameworkIds.length;
  };

  const value: ActiveFrameworksContextType = {
    activeFrameworkIds,
    setActiveFrameworkIds,
    addActiveFramework,
    removeActiveFramework,
    isFrameworkActive,
    resetToDefault,
    getActiveFrameworkCount,
  };

  return (
    <ActiveFrameworksContext.Provider value={value}>
      {children}
    </ActiveFrameworksContext.Provider>
  );
};
