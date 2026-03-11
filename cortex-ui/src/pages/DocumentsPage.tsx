import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import { documentsApi } from '../api/endpoints';
import {
  Upload,
  FileText,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Document } from '../types';

function StatusBadge({ status }: { status: Document['status'] }) {
  const config = {
    completed: { icon: CheckCircle2, bg: 'bg-green-100 text-green-700', label: 'Completed' },
    processing: { icon: Loader2, bg: 'bg-blue-100 text-blue-700', label: 'Processing' },
    failed: { icon: AlertCircle, bg: 'bg-red-100 text-red-700', label: 'Failed' },
    pending: { icon: Clock, bg: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
  };
  const c = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.bg}`}>
      <c.icon className={`w-3 h-3 ${status === 'processing' ? 'animate-spin' : ''}`} />
      {c.label}
    </span>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function DocumentsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['documents', page],
    queryFn: () => documentsApi.list({ page, per_page: 20 }).then((r) => r.data),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);
      return documentsApi.upload(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Document uploaded!');
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Upload failed');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => documentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setSelectedDoc(null);
      toast.success('Document deleted');
    },
  });

  const reprocessMutation = useMutation({
    mutationFn: (id: string) => documentsApi.reprocess(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Reprocessing started');
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => uploadMutation.mutate(file));
    },
    [uploadMutation]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
      </div>

      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive
          ? 'border-blue-400 bg-blue-50'
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="text-sm text-gray-600">
          {isDragActive
            ? 'Drop files here...'
            : 'Drag & drop files here, or click to browse'}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          PDF, DOCX, TXT, PNG, JPG, GIF (max 50MB)
        </p>
      </div>

      {/* Document List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {(data?.documents ?? []).length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No documents yet. Upload your first document above.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {data?.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-4 flex items-center gap-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedDoc?.id === doc.id ? 'bg-blue-50' : ''
                      }`}
                    onClick={() => setSelectedDoc(selectedDoc?.id === doc.id ? null : doc)}
                  >
                    <FileText className="w-8 h-8 text-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {doc.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatBytes(doc.file_size)} • {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={doc.status} />
                      {doc.tags.length > 0 && (
                        <div className="hidden sm:flex gap-1">
                          {doc.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag.id}
                              className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600"
                              style={{ borderLeft: `3px solid ${tag.color}` }}
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Document Detail */}
          {selectedDoc && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedDoc.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedDoc.filename} • {formatBytes(selectedDoc.file_size)} • {selectedDoc.mime_type}
                  </p>
                </div>
                <div className="flex gap-2">
                  {selectedDoc.status === 'failed' && (
                    <button
                      onClick={() => reprocessMutation.mutate(selectedDoc.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Reprocess"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMutation.mutate(selectedDoc.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {selectedDoc.content_preview && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Content Preview</p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{selectedDoc.content_preview}</p>
                </div>
              )}
              {selectedDoc.error_message && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg">
                  <p className="text-xs text-red-500 mb-1">Error</p>
                  <p className="text-sm text-red-700">{selectedDoc.error_message}</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {(data?.pages ?? 0) > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Page {data?.page} of {data?.pages} ({data?.total} documents)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= (data?.pages ?? 1)}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
