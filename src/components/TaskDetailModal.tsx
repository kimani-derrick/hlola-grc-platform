'use client';

import { useState, useEffect } from 'react';
import { formatDate } from '../utils/dateUtils';
import { apiService } from '../services/api';
import EvidenceUploadModal from './EvidenceUploadModal';
import { useAuth } from '../context/AuthContext';
import { useEntity } from '../context/EntityContext';

interface Comment {
  id: string;
  content: string;
  commentType: 'general' | 'update' | 'question' | 'resolution' | 'note';
  isInternal: boolean;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Document {
  id: string;
  name: string;
  description: string;
  document_type: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  is_evidence: boolean;
  created_at: string;
  uploaded_by: string;
  uploader_first_name: string;
  uploader_last_name: string;
}

interface TaskDetailModalProps {
  task: {
    id: string;
    title: string;
    description: string;
    type: 'system' | 'manual';
    status: 'completed' | 'in-progress' | 'not-started' | 'overdue' | 'pending';
    progress: number;
    assignee?: string;
    dueDate?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onTaskCompleted?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'not-started':
      return 'bg-gray-100 text-gray-800';
    case 'overdue':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getProgressColor = (progress: number) => {
  if (progress === 100) return 'bg-green-500';
  if (progress >= 50) return 'bg-blue-500';
  if (progress > 0) return 'bg-yellow-500';
  return 'bg-gray-300';
};

export default function TaskDetailModal({ task, isOpen, onClose, onTaskCompleted }: TaskDetailModalProps) {
  const { user } = useAuth();
  const { selectedEntity } = useEntity();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [evidence, setEvidence] = useState<Document[]>([]);
  const [evidenceLoading, setEvidenceLoading] = useState(false);
  const [evidenceError, setEvidenceError] = useState<string | null>(null);
  const [isEvidenceUploadOpen, setIsEvidenceUploadOpen] = useState(false);

  // Fetch comments when modal opens
  useEffect(() => {
    const fetchComments = async () => {
      if (!isOpen || !task?.id) return;
      
      setCommentsLoading(true);
      setCommentsError(null);
      
      try {
        const response = await apiService.getCommentsByTask(task.id);
        
        if (response.success && response.data) {
          setComments(response.data);
        } else {
          setCommentsError(response.error || 'Failed to load comments');
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        setCommentsError('Failed to load comments');
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [isOpen, task?.id]);

  // Fetch evidence when modal opens
  useEffect(() => {
    const fetchEvidence = async () => {
      if (!isOpen || !task?.id) return;
      
      setEvidenceLoading(true);
      setEvidenceError(null);
      
      try {
        const response = await apiService.getDocumentsByTask(task.id);
        
        if (response.success && response.data) {
          setEvidence(response.data);
        } else {
          setEvidenceError(response.error || 'Failed to fetch evidence');
        }
      } catch (error) {
        console.error('Error fetching evidence:', error);
        setEvidenceError('Failed to fetch evidence');
      } finally {
        setEvidenceLoading(false);
      }
    };

    fetchEvidence();
  }, [isOpen, task?.id]);

  const handleAddComment = async () => {
    if (!comment.trim() || submittingComment) return;

    setSubmittingComment(true);
    
    try {
      const response = await apiService.createComment({
        taskId: task.id,
        content: comment.trim(),
        commentType: 'general'
      });

      if (response.success) {
        setComment('');
        // Small delay to ensure comment is saved
        setTimeout(async () => {
          // Refresh comments
          const commentsResponse = await apiService.getCommentsByTask(task.id);
          if (commentsResponse.success && commentsResponse.data) {
            setComments(commentsResponse.data);
          }
        }, 100);
      } else {
        console.error('Failed to add comment:', response.error);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleEvidenceUploaded = () => {
    // Refresh evidence list
    const fetchEvidence = async () => {
      try {
        const response = await apiService.getDocumentsByTask(task.id);
        if (response.success && response.data) {
          setEvidence(response.data);
        }
      } catch (error) {
        console.error('Error refreshing evidence:', error);
      }
    };
    fetchEvidence();
  };

  const handleCompleteTask = async () => {
    try {
      const response = await apiService.updateTaskStatus(task.id, 'completed');
      if (response.success) {
        // Call the callback to refresh parent component
        if (onTaskCompleted) {
          onTaskCompleted();
        }
        // Close modal
        onClose();
      } else {
        console.error('Failed to complete task:', response.error);
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const getCommentTypeColor = (commentType: string) => {
    switch (commentType) {
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'question':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolution':
        return 'bg-green-100 text-green-800';
      case 'note':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCommentTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Unknown time';
    }
    
    // The server sends UTC time, but we need to account for the 3-hour timezone difference
    // Kenya is UTC+3, so the server time is already 3 hours behind Kenya time
    // We need to compare the server time directly with current time since both are in local timezone
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    // Debug logging to help troubleshoot
    console.log('Time calculation debug:', {
      serverTime: dateString,
      serverTimeLocal: date.toString(),
      localNow: now.toString(),
      diffInSeconds,
      diffInMinutes,
      diffInHours
    });
    
    // More precise time calculation
    if (diffInSeconds < 10) return 'Just now';
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return formatDate(dateString);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
                <p className="text-sm text-gray-500 font-mono">Task ID: {task.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(task.status)}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
            <p className="text-gray-700">{task.description}</p>
          </div>

          {/* Progress and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Completion {task.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-gradient-to-r from-blue-300 to-blue-600" style={{ width: `${task.progress}%` }}></div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Due Date</h3>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0v1a2 2 0 002 2h4a2 2 0 002-2V7m-6 0h6m-6 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                </svg>
                <span className="text-gray-700">{task.dueDate ? formatDate(task.dueDate) : 'No due date set'}</span>
              </div>
            </div>
          </div>

          {/* Assignment and Source */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Assigned To</h3>
              {task.assignee ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-semibold text-lg">
                      {task.assignee.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{task.assignee}</p>
                    <p className="text-sm text-gray-500">Compliance Officer</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Unassigned</p>
                    <p className="text-sm text-gray-400">No one assigned to this task</p>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Source</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                System Generated
              </span>
            </div>
          </div>

          {/* Task Evidence */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">
                  Task Evidence {evidenceLoading ? '(Loading...)' : `(${evidence.length})`}
                </h3>
              </div>
              <button 
                onClick={() => setIsEvidenceUploadOpen(true)}
                disabled={!selectedEntity?.id && !user?.entityId}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Evidence
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Upload evidence files to document completion of this task.
              {(!selectedEntity?.id && !user?.entityId) && (
                <span className="text-red-500 block mt-1">
                  ⚠️ No entity selected. Please select an entity first.
                </span>
              )}
            </p>
            
            {/* Evidence List */}
            {evidenceLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span className="ml-2 text-gray-600">Loading evidence...</span>
              </div>
            ) : evidenceError ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{evidenceError}</p>
              </div>
            ) : evidence.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No evidence uploaded yet</p>
                <p className="text-sm">Upload files to document task completion</p>
              </div>
            ) : (
              <div className="space-y-3">
                {evidence.map((doc) => (
                  <div key={doc.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          {doc.description || 'No description'} • 
                          {(doc.file_size / 1024).toFixed(1)} KB • 
                          Uploaded by {doc.uploader_first_name} {doc.uploader_last_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </span>
                      <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Complete Task Button */}
            {evidence.length > 0 && task.status !== 'completed' && (
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleCompleteTask}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Complete Task
                </button>
              </div>
            )}
          </div>

          {/* Comments & Updates */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Comments & Updates</h3>
            </div>
            
            {/* Add Comment */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold text-sm">U</span>
                </div>
                <div className="flex-1 relative">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment or update..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none pr-24"
                    rows={3}
                    disabled={submittingComment}
                  />
                  <button 
                    onClick={handleAddComment}
                    disabled={!comment.trim() || submittingComment}
                    className="absolute bottom-2 right-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingComment ? (
                      <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                    {submittingComment ? 'Adding...' : 'Add Comment'}
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Loading State */}
            {commentsLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading comments...</span>
              </div>
            )}

            {/* Comments Error State */}
            {commentsError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-800">{commentsError}</span>
                </div>
              </div>
            )}

            {/* Existing Comments */}
            {!commentsLoading && !commentsError && (
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>No comments yet. Be the first to add one!</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {comment.author.firstName?.[0]}{comment.author.lastName?.[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {comment.author.firstName} {comment.author.lastName}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatCommentTime(comment.createdAt)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCommentTypeColor(comment.commentType)}`}>
                            {comment.commentType}
                          </span>
                          {comment.isInternal && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              Internal
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Evidence Upload Modal */}
      {(selectedEntity?.id || user?.entityId) && (
        <EvidenceUploadModal
          isOpen={isEvidenceUploadOpen}
          onClose={() => setIsEvidenceUploadOpen(false)}
          taskId={task.id}
          entityId={selectedEntity?.id || user?.entityId} // Use selected entity or user's entity
          onEvidenceUploaded={handleEvidenceUploaded}
        />
      )}
    </div>
  );
}
