'use client';

import { Document } from '../types/documents';
import { statusConfig } from '../data/documents';
import { formatDate } from '../utils/dateUtils';

interface DocumentTableProps {
  documents: Document[];
  onDocumentClick: (document: Document) => void;
}

export default function DocumentTable({ documents, onDocumentClick }: DocumentTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Modified
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Downloads
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((document) => (
              <tr
                key={document.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onDocumentClick(document)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-lg">
                        📄
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{document.title}</div>
                      <div className="text-sm text-gray-500">v{document.version} • {document.fileSize}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{document.category}</div>
                  {document.isTemplate && (
                    <div className="text-xs text-purple-600 font-medium">Template</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[document.status].bg} ${statusConfig[document.status].color}`}>
                    {statusConfig[document.status].label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {document.author}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(document.lastModified)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {document.downloadCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-[#26558e] hover:text-[#1e4470] mr-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDocumentClick(document);
                    }}
                  >
                    View
                  </button>
                  <button 
                    className="text-gray-600 hover:text-gray-900"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
