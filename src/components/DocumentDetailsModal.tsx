'use client';

import { Document } from '../types/documents';
import { categoryIcons, statusConfig } from '../data/documents';
import { formatDate } from '../utils/dateUtils';

interface DocumentDetailsModalProps {
  document: Document | null;
  onClose: () => void;
}

export default function DocumentDetailsModal({ document, onClose }: DocumentDetailsModalProps) {
  if (!document) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-3xl mr-4">
                {categoryIcons[document.category]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{document.title}</h2>
                <p className="text-gray-600">{document.category} • Version {document.version}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700">{document.description}</p>
              </div>

              <div className="mb-6">
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
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Approval Information</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
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
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Document Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[document.status].bg} ${statusConfig[document.status].color}`}>
                      {statusConfig[document.status].label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">File Size:</span>
                    <span className="text-gray-900">{document.fileSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Downloads:</span>
                    <span className="text-gray-900">{document.downloadCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Author:</span>
                    <span className="text-gray-900">{document.author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Modified:</span>
                    <span className="text-gray-900">{formatDate(document.lastModified)}</span>
                  </div>
                  {document.expiryDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expires:</span>
                      <span className="text-gray-900">{formatDate(document.expiryDate)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button className="w-full bg-[#26558e] text-white px-4 py-2 rounded-lg hover:bg-[#1e4470] transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </button>
                <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit
                </button>
                <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Duplicate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
