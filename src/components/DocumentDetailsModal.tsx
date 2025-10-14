'use client';

import { useState, useEffect } from 'react';
import { Document } from '../types/documents';
import { categoryIcons, statusConfig } from '../data/documents';
import { formatDate } from '../utils/dateUtils';
import { apiService } from '../services/api';

interface DocumentDetailsModalProps {
  document: Document | null;
  onClose: () => void;
}

// Component to preview text files
const TextFilePreview = ({ documentId, title }: { documentId: string; title: string }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await apiService.downloadDocument(documentId);
        
        if (response.ok) {
          const text = await response.text();
          setContent(text);
        } else {
          setError(`Failed to load file content: ${response.status} ${response.statusText}`);
        }
      } catch (err: any) {
        setError(err.message || 'Error loading file content');
        console.error('Error fetching file content:', err);
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchContent();
    }
  }, [documentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading file content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 mb-2">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <button 
          onClick={async () => {
            try {
              const response = await apiService.downloadDocument(documentId);
              if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', title || 'document');
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
              } else {
                alert('Failed to download file');
              }
            } catch (err: any) {
              alert(err.message || 'Failed to download file');
            }
          }}
          className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          Download File
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 font-mono text-sm text-green-400">
      <pre className="whitespace-pre-wrap">{content}</pre>
    </div>
  );
};

// File type icon mapper
const getFileIcon = (fileType: string) => {
  const icons: Record<string, React.ReactElement> = {
    pdf: (
      <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M15.5,15.5C15.5,16.61 14.61,17.5 13.5,17.5H11V19.5H10V14.5H13.5C14.61,14.5 15.5,15.39 15.5,16.5M13.5,16.5H11V15.5H13.5V16.5M10,11.5V9.5H13V11.5H10M8,11.5H5V9.5H8V11.5Z" />
      </svg>
    ),
    docx: (
      <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M15.5,17H14L12,13.2L10,17H8.5L11.5,12L8.5,7H10L12,10.8L14,7H15.5L12.5,12L15.5,17M13,9V3.5L18.5,9H13Z" />
      </svg>
    ),
    xlsx: (
      <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M15.5,17H14L12,13.2L10,17H8.5L11.5,12L8.5,7H10L12,10.8L14,7H15.5L12.5,12L15.5,17M13,9V3.5L18.5,9H13Z" />
      </svg>
    ),
    txt: (
      <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18.5,20H5.5V19H18.5V20M18.5,18H5.5V17H18.5V18M18.5,16H5.5V15H18.5V16M18.5,14H5.5V13H18.5V14M18.5,12H5.5V11H18.5V12M13,9V3.5L18.5,9H13Z" />
      </svg>
    ),
    zip: (
      <svg className="w-12 h-12 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14,17H12V15H14M14,13H12V11H14M14,9H12V7H14M16,17H14V15H16M16,13H14V11H16M16,9H14V7H16M12,17V19H14V17M12,7V5H14V7M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
      </svg>
    ),
    default: (
      <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
      </svg>
    )
  };
  return icons[fileType] || icons.default;
};

// Real document viewer content generator
const getDocumentPreview = (fileType: string, title: string, documentId: string) => {
  if (fileType === 'pdf') {
    return (
      <div className="bg-white h-full rounded-lg border-2 border-gray-200 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            {getFileIcon('pdf')}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Document Viewer</h3>
          <p className="text-gray-600 mb-4">This is a preview of your PDF document</p>
          <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto text-left">
            <h4 className="font-bold text-gray-900 mb-3">{title}</h4>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              PDF documents require a specialized viewer. Click the download button below to view the full document.
            </p>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button 
                onClick={async () => {
                  try {
                    const response = await apiService.downloadDocument(documentId);
                    if (response.ok) {
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', title || 'document.pdf');
                      link.style.display = 'none';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    } else {
                      alert('Failed to download file');
                    }
                  } catch (err: any) {
                    alert(err.message || 'Failed to download file');
                  }
                }}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (fileType === 'docx') {
    return (
      <div className="bg-white h-full rounded-lg border-2 border-gray-200 p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              {getFileIcon('docx')}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">Microsoft Word Document</p>
            </div>
          </div>
          
          <div className="prose max-w-none">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Executive Summary</h2>
            <p className="text-gray-700 mb-4">
              This document provides comprehensive coverage of compliance requirements and implementation guidelines
              for the specified regulatory framework. All procedures and policies outlined herein are designed to
              ensure full compliance and provide auditable evidence.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2. Scope and Objectives</h2>
            <p className="text-gray-700 mb-4">
              The scope of this documentation encompasses all relevant compliance activities, controls implementation,
              and evidence collection processes. Key objectives include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>Establish clear compliance procedures</li>
              <li>Document all control implementations</li>
              <li>Maintain comprehensive audit trails</li>
              <li>Ensure regulatory adherence</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3. Implementation Details</h2>
            <p className="text-gray-700 mb-4">
              Detailed implementation procedures and guidelines are provided to ensure consistent application
              across the organization. All stakeholders are required to follow these documented processes.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> In production, this would render the actual DOCX content using libraries like mammoth.js or docx-preview.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (fileType === 'xlsx') {
    return (
      <div className="bg-white h-full rounded-lg border-2 border-gray-200 p-6 overflow-auto">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3">
            {getFileIcon('xlsx')}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">Microsoft Excel Spreadsheet</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Control Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Owner</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Compliance %</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">001</td>
                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">Data Protection Policy</td>
                <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">Phillip Kisaka</td>
                <td className="px-4 py-3 text-sm text-gray-900">100%</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">002</td>
                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">Access Control</td>
                <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">In Progress</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">Security Team</td>
                <td className="px-4 py-3 text-sm text-gray-900">75%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">003</td>
                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">Incident Response</td>
                <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">Compliance Team</td>
                <td className="px-4 py-3 text-sm text-gray-900">90%</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs text-green-800">
            <strong>Note:</strong> In production, this would render the actual Excel content using libraries like SheetJS or exceljs.
          </p>
        </div>
      </div>
    );
  }
  
  if (fileType === 'txt') {
    return (
      <div className="bg-white h-full rounded-lg border-2 border-gray-200 p-6 overflow-auto">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
            {getFileIcon('txt')}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">Plain Text Document</p>
          </div>
        </div>
        
        <TextFilePreview documentId={documentId} title={title} />
      </div>
    );
  }
  
  // Default preview for other file types
  return (
    <div className="bg-gray-50 h-full rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          {getFileIcon(fileType)}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Preview Not Available</h3>
        <p className="text-gray-600 mb-4">File type: .{fileType}</p>
        <p className="text-sm text-gray-500">
          Preview is not available for this file type. Please download the file to view its contents.
        </p>
      </div>
    </div>
  );
};

export default function DocumentDetailsModal({ document, onClose }: DocumentDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'details' | 'history'>('preview');
  
  if (!document) return null;

  const fileType = document.fileType || 'pdf';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-7xl h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center flex-1 min-w-0">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl mr-4 shadow-sm flex-shrink-0">
              {document.isEvidence ? getFileIcon(fileType) : categoryIcons[document.category]}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold text-gray-900 truncate">{document.title}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-sm text-gray-600">{document.category}</span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">Version {document.version}</span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">{document.fileSize}</span>
                {document.isEvidence && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                      Evidence
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pt-4 border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'preview'
                ? 'bg-white text-[#26558e] border-t-2 border-x border-[#26558e] border-b-white -mb-px'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </div>
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'details'
                ? 'bg-white text-[#26558e] border-t-2 border-x border-[#26558e] border-b-white -mb-px'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Details
            </div>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'history'
                ? 'bg-white text-[#26558e] border-t-2 border-x border-[#26558e] border-b-white -mb-px'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'preview' && (
            <div className="h-full p-6 bg-gray-50">
              {getDocumentPreview(fileType, document.title, document.id)}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="h-full overflow-auto p-6 bg-white">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                      <p className="text-gray-700 leading-relaxed">{document.description}</p>
                    </div>

                    {document.isEvidence && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Evidence Linkage</h3>
                        <div className="space-y-3">
                          {document.frameworkName && (
                            <div className="flex items-start">
                              <svg className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                              <div>
                                <p className="text-xs font-medium text-gray-600">Framework</p>
                                <p className="text-sm text-gray-900 font-medium">{document.frameworkName}</p>
                              </div>
                            </div>
                          )}
                          {document.controlName && (
                            <div className="flex items-start">
                              <svg className="w-5 h-5 mr-2 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <p className="text-xs font-medium text-gray-600">Control</p>
                                <p className="text-sm text-gray-900 font-medium">{document.controlName}</p>
                              </div>
                            </div>
                          )}
                          {document.taskName && (
                            <div className="flex items-start">
                              <svg className="w-5 h-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              <div>
                                <p className="text-xs font-medium text-gray-600">Task</p>
                                <p className="text-sm text-gray-900 font-medium">{document.taskName}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {document.tags.map((tag) => (
                          <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {document.status === 'active' && document.approver && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-green-900 mb-2">Approval Status</h3>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-green-800">Approved by {document.approver}</p>
                            <p className="text-sm text-green-600">
                              on {document.approvalDate && formatDate(document.approvalDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Document Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[document.status].bg} ${statusConfig[document.status].color}`}>
                            {statusConfig[document.status].label}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm text-gray-600">File Type:</span>
                          <span className="text-sm text-gray-900 font-medium uppercase">.{fileType}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm text-gray-600">File Size:</span>
                          <span className="text-sm text-gray-900 font-medium">{document.fileSize}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm text-gray-600">Downloads:</span>
                          <span className="text-sm text-gray-900 font-medium">{document.downloadCount}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm text-gray-600">Author:</span>
                          <span className="text-sm text-gray-900 font-medium">{document.author}</span>
                        </div>
                        {document.uploadedDate && (
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-sm text-gray-600">Uploaded:</span>
                            <span className="text-sm text-gray-900 font-medium">{formatDate(document.uploadedDate)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm text-gray-600">Last Modified:</span>
                          <span className="text-sm text-gray-900 font-medium">{formatDate(document.lastModified)}</span>
                        </div>
                        {document.expiryDate && (
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-gray-600">Expires:</span>
                            <span className="text-sm text-gray-900 font-medium">{formatDate(document.expiryDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button className="w-full bg-[#26558e] text-white px-4 py-3 rounded-lg hover:bg-[#1e4470] transition-colors flex items-center justify-center gap-2 shadow-md font-medium">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Document
                      </button>
                      <button className="w-full border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share Document
                      </button>
                      <button className="w-full border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Print Document
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="h-full overflow-auto p-6 bg-white">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Document History</h3>
                
                <div className="space-y-4">
                  {/* Timeline items */}
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">Document Approved</h4>
                          <span className="text-sm text-gray-500">{document.approvalDate && formatDate(document.approvalDate)}</span>
                        </div>
                        <p className="text-sm text-gray-600">Document was approved by {document.approver || 'Administrator'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">Document Uploaded</h4>
                          <span className="text-sm text-gray-500">{formatDate(document.uploadedDate || document.lastModified)}</span>
                        </div>
                        <p className="text-sm text-gray-600">Document was uploaded by {document.author}</p>
                        <div className="mt-2 text-xs text-gray-500">
                          <span>Version {document.version}</span> • <span>{document.fileSize}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">Document Created</h4>
                          <span className="text-sm text-gray-500">{formatDate(document.lastModified)}</span>
                        </div>
                        <p className="text-sm text-gray-600">Document was created in the system</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>This document is securely stored and encrypted</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
