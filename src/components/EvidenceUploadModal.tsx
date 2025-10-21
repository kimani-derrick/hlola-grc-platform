'use client';

import { useState, useRef } from 'react';
import { apiService } from '../services/api';

interface EvidenceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  entityId?: string;
  onEvidenceUploaded: () => void;
}

export default function EvidenceUploadModal({ 
  isOpen, 
  onClose, 
  taskId, 
  entityId, 
  onEvidenceUploaded 
}: EvidenceUploadModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // New state for text evidence
  const [evidenceMode, setEvidenceMode] = useState<'file' | 'text'>('file');
  const [textContent, setTextContent] = useState('');
  const [evidenceCategory, setEvidenceCategory] = useState('');
  const [textTitle, setTextTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: require either file OR text content
    if (!selectedFile && !textContent.trim()) {
      setError('Please select a file to upload OR enter text content');
      return;
    }

    if (!entityId) {
      setError('No entity selected. Please select an entity first.');
      return;
    }

    // Additional validation for text mode
    if (evidenceMode === 'text' && !textTitle.trim()) {
      setError('Please enter a title for the text evidence');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      
      // Handle file upload
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
        formDataToSend.append('title', formData.title || selectedFile.name);
      }
      
      // Handle text evidence
      if (textContent.trim()) {
        const textFile = new File(
          [textContent], 
          `${textTitle || 'evidence'}.txt`,
          { type: 'text/plain' }
        );
        formDataToSend.append('file', textFile);
        formDataToSend.append('title', textTitle);
        
        // Add category as a tag if provided
        if (evidenceCategory) {
          const existingTags = formData.tags ? `${formData.tags}, ${evidenceCategory}` : evidenceCategory;
          formDataToSend.append('tags', existingTags);
        }
      }
      
      formDataToSend.append('entityId', entityId);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('documentType', 'evidence');
      formDataToSend.append('taskId', taskId);
      
      if (formData.tags && !textContent.trim()) {
        formDataToSend.append('tags', formData.tags);
      }

      const response = await apiService.uploadDocument(formDataToSend);
      
      if (response.success) {
        // Reset form
        setFormData({
          title: '',
          description: '',
          tags: ''
        });
        setSelectedFile(null);
        setTextContent('');
        setTextTitle('');
        setEvidenceCategory('');
        setEvidenceMode('file');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onEvidenceUploaded();
        onClose();
      } else {
        setError(response.error || 'Failed to upload evidence');
      }
    } catch (err) {
      setError('An error occurred while uploading the evidence');
      console.error('Error uploading evidence:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setEvidenceMode('file');
      // Clear text content when file is selected
      setTextContent('');
      setTextTitle('');
      setEvidenceCategory('');
      // Auto-fill title with filename if not already set
      if (!formData.title) {
        setFormData(prev => ({
          ...prev,
          title: file.name.replace(/\.[^/.]+$/, '') // Remove file extension
        }));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTextContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextContent(e.target.value);
    setEvidenceMode('text');
    // Clear file selection when text is entered
    if (e.target.value.trim()) {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleTextTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextTitle(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEvidenceCategory(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Upload Evidence</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">Upload File</h3>
              </div>
              
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                  Evidence File
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt,.csv,.zip,.rar"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Allowed types: PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG, TXT, CSV, ZIP, RAR
                </p>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter evidence title"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Text Evidence Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">Write Evidence</h3>
              </div>

              <div>
                <label htmlFor="textTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="textTitle"
                  value={textTitle}
                  onChange={handleTextTitleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter evidence title"
                />
              </div>

              <div>
                <label htmlFor="evidenceCategory" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="evidenceCategory"
                  value={evidenceCategory}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select category (optional)</option>
                  <option value="Policy Document">Policy Document</option>
                  <option value="Procedure">Procedure</option>
                  <option value="Compliance Report">Compliance Report</option>
                  <option value="Evidence Note">Evidence Note</option>
                  <option value="Audit Finding">Audit Finding</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="textContent" className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <textarea
                  id="textContent"
                  value={textContent}
                  onChange={handleTextContentChange}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your evidence content here..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be saved as a text file (.txt)
                </p>
              </div>
            </div>

            {/* Shared Fields */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter evidence description"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., compliance, audit, policy"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading || (!selectedFile && !textContent.trim())}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Evidence
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
