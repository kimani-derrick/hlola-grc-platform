'use client';

import { Document } from '../types/documents';
import { categoryIcons, statusConfig } from '../data/documents';
import { formatDate } from '../utils/dateUtils';

interface DocumentCardProps {
  document: Document;
  onClick: (document: Document) => void;
}

const evidenceTypeIcons: Record<string, string> = {
  'policy': '📋',
  'procedure': '📝',
  'screenshot': '📸',
  'certificate': '🏅',
  'audit-report': '📊',
  'training-record': '🎓',
  'assessment': '✅',
  'other': '📄'
};

const evidenceTypeBadgeColors: Record<string, { bg: string, text: string }> = {
  'policy': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'procedure': { bg: 'bg-green-100', text: 'text-green-700' },
  'screenshot': { bg: 'bg-purple-100', text: 'text-purple-700' },
  'certificate': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  'audit-report': { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  'training-record': { bg: 'bg-pink-100', text: 'text-pink-700' },
  'assessment': { bg: 'bg-teal-100', text: 'text-teal-700' },
  'other': { bg: 'bg-gray-100', text: 'text-gray-700' }
};

export default function DocumentCard({ document, onClick }: DocumentCardProps) {
  return (
    <div
      className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onClick(document)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-12 h-12 ${document.isEvidence ? 'bg-gradient-to-br from-blue-100 to-indigo-100' : 'bg-blue-100'} rounded-xl flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform`}>
              {document.isEvidence && document.evidenceType ? evidenceTypeIcons[document.evidenceType] : categoryIcons[document.category]}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-[#26558e] transition-colors">{document.title}</h3>
              <p className="text-sm text-gray-500">{document.category}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[document.status].bg} ${statusConfig[document.status].color}`}>
              {statusConfig[document.status].label}
            </span>
            {document.isTemplate && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                Template
              </span>
            )}
            {document.isEvidence && document.evidenceType && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${evidenceTypeBadgeColors[document.evidenceType].bg} ${evidenceTypeBadgeColors[document.evidenceType].text}`}>
                Evidence
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{document.description}</p>

        {/* Evidence Metadata */}
        {document.isEvidence && (
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            {document.frameworkName && (
              <div className="flex items-center text-xs text-gray-700 mb-1">
                <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="font-medium">Framework:</span>
                <span className="ml-1 truncate">{document.frameworkName}</span>
              </div>
            )}
            {document.controlName && (
              <div className="flex items-center text-xs text-gray-700 mb-1">
                <svg className="w-4 h-4 mr-1 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Control:</span>
                <span className="ml-1 truncate">{document.controlName}</span>
              </div>
            )}
            {document.taskName && (
              <div className="flex items-center text-xs text-gray-700">
                <svg className="w-4 h-4 mr-1 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-medium">Task:</span>
                <span className="ml-1 truncate">{document.taskName}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {document.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              {tag}
            </span>
          ))}
          {document.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              +{document.tags.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <div className="flex items-center gap-4">
            <span>v{document.version}</span>
            <span>{document.fileSize}</span>
            <span>{document.downloadCount} downloads</span>
          </div>
          <span>{formatDate(document.uploadedDate || document.lastModified)}</span>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <span>By {document.author}</span>
              {document.approver && (
                <span className="ml-2">• Approved by {document.approver}</span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                className="text-[#26558e] hover:text-[#1e4470] text-sm font-medium transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(document);
                }}
              >
                View
              </button>
              <button
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
