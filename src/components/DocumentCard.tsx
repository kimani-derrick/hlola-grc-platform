'use client';

import { Document } from '../types/documents';
import { categoryIcons, statusConfig } from '../data/documents';
import { formatDate } from '../utils/dateUtils';

interface DocumentCardProps {
  document: Document;
  onClick: (document: Document) => void;
}

export default function DocumentCard({ document, onClick }: DocumentCardProps) {
  return (
    <div
      className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(document)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mr-4">
              {categoryIcons[document.category]}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{document.title}</h3>
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
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{document.description}</p>

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

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>v{document.version}</span>
            <span>{document.fileSize}</span>
            <span>{document.downloadCount} downloads</span>
          </div>
          <span>{formatDate(document.lastModified)}</span>
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
                className="text-[#26558e] hover:text-[#1e4470] text-sm font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(document);
                }}
              >
                View
              </button>
              <button
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
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
