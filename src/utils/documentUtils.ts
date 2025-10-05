import { Document, DocumentFilters } from '../types/documents';

export const filterDocuments = (documents: Document[], filters: DocumentFilters): Document[] => {
  return documents.filter(document => {
    // Search filter
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        document.title.toLowerCase().includes(searchLower) ||
        document.description.toLowerCase().includes(searchLower) ||
        document.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        document.author.toLowerCase().includes(searchLower);
      
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
      case 'lastModified':
      default:
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
    }
  });
};
