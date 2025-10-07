import { Document, DocumentFilters } from '../types/documents';

export const filterDocuments = (documents: Document[], filters: DocumentFilters): Document[] => {
  return documents.filter(document => {
    // Evidence-only filter
    if (filters.showEvidenceOnly && !document.isEvidence) {
      return false;
    }

    // Search filter
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        document.title.toLowerCase().includes(searchLower) ||
        document.description.toLowerCase().includes(searchLower) ||
        document.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        document.author.toLowerCase().includes(searchLower) ||
        (document.frameworkName && document.frameworkName.toLowerCase().includes(searchLower)) ||
        (document.controlName && document.controlName.toLowerCase().includes(searchLower)) ||
        (document.taskName && document.taskName.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.selectedCategory !== 'all') {
      if (document.category !== filters.selectedCategory) return false;
    }

    // Status filter
    if (filters.selectedStatus !== 'all') {
      if (document.status !== filters.selectedStatus) return false;
    }

    // Framework filter
    if (filters.selectedFramework !== 'all') {
      if (document.frameworkId !== filters.selectedFramework) return false;
    }

    // Control filter
    if (filters.selectedControl !== 'all') {
      if (document.controlId !== filters.selectedControl) return false;
    }

    // Task filter
    if (filters.selectedTask !== 'all') {
      if (document.taskId !== filters.selectedTask) return false;
    }

    // Evidence type filter
    if (filters.selectedEvidenceType !== 'all') {
      if (document.evidenceType !== filters.selectedEvidenceType) return false;
    }

    return true;
  });
};

export const sortDocuments = (documents: Document[], sortBy: string = 'lastModified'): Document[] => {
  return [...documents].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'category':
        return a.category.localeCompare(b.category);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'author':
        return a.author.localeCompare(b.author);
      case 'framework':
        return (a.frameworkName || '').localeCompare(b.frameworkName || '');
      case 'uploadedDate':
        if (a.uploadedDate && b.uploadedDate) {
          return new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime();
        }
        return 0;
      case 'lastModified':
      default:
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
    }
  });
};

export const getUniqueFrameworks = (documents: Document[]): Array<{id: string, name: string}> => {
  const frameworks = new Map<string, string>();
  documents.forEach(doc => {
    if (doc.frameworkId && doc.frameworkName) {
      frameworks.set(doc.frameworkId, doc.frameworkName);
    }
  });
  return Array.from(frameworks.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
};

export const getUniqueControls = (documents: Document[], frameworkId?: string): Array<{id: string, name: string}> => {
  const controls = new Map<string, string>();
  documents.forEach(doc => {
    if (doc.controlId && doc.controlName) {
      if (!frameworkId || doc.frameworkId === frameworkId) {
        controls.set(doc.controlId, doc.controlName);
      }
    }
  });
  return Array.from(controls.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
};

export const getUniqueTasks = (documents: Document[], frameworkId?: string, controlId?: string): Array<{id: string, name: string}> => {
  const tasks = new Map<string, string>();
  documents.forEach(doc => {
    if (doc.taskId && doc.taskName) {
      let matches = true;
      if (frameworkId && doc.frameworkId !== frameworkId) matches = false;
      if (controlId && doc.controlId !== controlId) matches = false;
      if (matches) {
        tasks.set(doc.taskId, doc.taskName);
      }
    }
  });
  return Array.from(tasks.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
};
