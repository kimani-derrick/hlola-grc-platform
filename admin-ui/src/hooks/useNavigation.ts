import { useState } from 'react';
import { Framework, Control, BreadcrumbItem } from '@/types';

export const useNavigation = () => {
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>(['Frameworks']);

  const handleFrameworkClick = (framework: Framework, setActiveTab: (tab: string) => void) => {
    setSelectedFramework(framework);
    setSelectedControl(null);
    setBreadcrumb(['Frameworks', framework.name]);
    setActiveTab('controls');
  };

  const handleControlClick = (control: Control, setActiveTab: (tab: string) => void) => {
    setSelectedControl(control);
    setBreadcrumb(['Frameworks', selectedFramework?.name || 'Framework', control.title]);
    setActiveTab('tasks');
  };

  const handleBackToFrameworks = (setActiveTab: (tab: string) => void) => {
    setSelectedFramework(null);
    setSelectedControl(null);
    setBreadcrumb(['Frameworks']);
    setActiveTab('frameworks');
  };

  const handleBackToControls = (setActiveTab: (tab: string) => void) => {
    setSelectedControl(null);
    setBreadcrumb(['Frameworks', selectedFramework?.name || 'Framework']);
    setActiveTab('controls');
  };

  return {
    selectedFramework,
    selectedControl,
    breadcrumb,
    setSelectedFramework,
    setSelectedControl,
    handleFrameworkClick,
    handleControlClick,
    handleBackToFrameworks,
    handleBackToControls,
  };
};
