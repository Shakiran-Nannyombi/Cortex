import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import { documentsApi } from '../api/endpoints';
import { useTheme } from '../hooks/useTheme';
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
import { useTheme } from '../hooks/useTheme';
import type { Document } from '../types';

function StatusBadge({ status }: { status: Document['status'] }) {
  const { isDark } = useTheme();
  const config = {
    completed: {
      icon: CheckCircle2,
      bg: isDark ? 'bg-green-600/20 text-green-400 border-green-800' : 'bg-green-100 text-green-700 border-green-200',
      label: 'Completed'
    },
    processing: {
      icon: Loader2,
      bg: isDark ? 'bg-blue-600/20 text-blue-400 border-blue-800' : 'bg-blue-100 text-blue-700 border-blue-200',
      label: 'Processing'
    },
    failed: {
      icon: AlertCircle,
      bg: isDark ? 'bg-red-600/20 text-red-400 border-red-800' : 'bg-red-100 text-red-700 border-red-200',
      label: 'Failed'
    },
    pending: {
      icon: Clock,
      bg: isDark ? 'bg-yellow-600/20 text-yellow-400 border-yellow-800' : 'bg-yellow-100 text-yellow-700 border-yellow-200',
      label: 'Pending'
    },
  };
  const c = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${c.bg}`}>
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
  const { isDark } = useTheme();
  const queryClient = useQueryClient();
  const { isDark } = useTheme();
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
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Documents</h1>
      </div>

      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive
          ? (isDark ? 'border-blue-500 bg-blue-900/40' : 'border-blue-400 bg-blue-50')
          : (isDark ? 'border-blue-800 hover:border-blue-500 hover:bg-blue-900/20' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50')
          }`}
      >
        <input {...getInputProps()} />
        <Upload className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-blue-400/60' : 'text-gray-400'}`} />
        <p className={`text-sm ${isDark ? 'text-blue-100/60' : 'text-gray-600'}`}>
          {isDragActive
            ? 'Drop files here...'
            : 'Drag & drop files here, or click to browse'}
        </p>
        <p className={`text-xs mt-1 ${isDark ? 'text-blue-100/40' : 'text-gray-400'}`}>
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
          <div className={`rounded-xl border overflow-hidden transition-colors duration-300 ${isDark ? 'bg-blue-900/40 border-blue-800' : 'bg-white border-gray-200'}`}>
            {(data?.documents ?? []).length === 0 ? (
              <div className={`p-8 text-center ${isDark ? 'text-blue-100/40' : 'text-gray-400'}`}>
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No documents yet. Upload your first document above.</p>
              </div>
            ) : (
              <div className={`divide-y ${isDark ? 'divide-blue-800' : 'divide-gray-100'}`}>
                {data?.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-4 flex items-center gap-4 cursor-pointer transition-colors ${
                      selectedDoc?.id === doc.id
                        ? (isDark ? 'bg-blue-600/20' : 'bg-blue-50')
                        : (isDark ? 'hover:bg-blue-800/20' : 'hover:bg-gray-50')
                    }`}
                    onClick={() => setSelectedDoc(selectedDoc?.id === doc.id ? null : doc)}
                  >
                    <FileText className={`w-8 h-8 shrink-0 ${isDark ? 'text-blue-400/60' : 'text-gray-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {doc.title}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-blue-100/60' : 'text-gray-500'}`}>
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
                              className={`px-2 py-0.5 text-xs rounded-full border ${isDark ? 'bg-blue-800/40 text-blue-100/60 border-blue-700' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
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
            <div className={`rounded-xl border p-5 transition-colors duration-300 ${isDark ? 'bg-blue-900/40 border-blue-800' : 'bg-white border-gray-200'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedDoc.title}</h3>
                  <p className={`text-sm mt-1 ${isDark ? 'text-blue-200/40' : 'text-gray-500'}`}>
                    {selectedDoc.filename} • {formatBytes(selectedDoc.file_size)} • {selectedDoc.mime_type}
                  </p>
                </div>
                <div className="flex gap-2">
                  {selectedDoc.status === 'failed' && (
                    <button
                      onClick={() => reprocessMutation.mutate(selectedDoc.id)}
                      className={`p-2 rounded-lg transition-colors ${isDark ? 'text-blue-400 hover:bg-blue-800/60' : 'text-blue-600 hover:bg-blue-50'}`}
                      title="Reprocess"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMutation.mutate(selectedDoc.id)}
                    className={`p-2 rounded-lg transition-colors ${isDark ? 'text-red-400 hover:bg-red-900/40' : 'text-red-600 hover:bg-red-50'}`}
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {selectedDoc.content_preview && (
                <div className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-blue-950/40' : 'bg-gray-50'}`}>
                  <p className={`text-xs mb-1 ${isDark ? 'text-blue-200/40' : 'text-gray-500'}`}>Content Preview</p>
                  <p className={`text-sm whitespace-pre-line ${isDark ? 'text-blue-100/80' : 'text-gray-700'}`}>{selectedDoc.content_preview}</p>
                </div>
              )}
              {selectedDoc.error_message && (
                <div className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-red-900/20 border border-red-900/50' : 'bg-red-50'}`}>
                  <p className={`text-xs mb-1 ${isDark ? 'text-red-400' : 'text-red-500'}`}>Error</p>
                  <p className={`text-sm ${isDark ? 'text-red-200/80' : 'text-red-700'}`}>{selectedDoc.error_message}</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {(data?.pages ?? 0) > 1 && (
            <div className="flex items-center justify-between">
              <p className={`text-sm ${isDark ? 'text-blue-100/40' : 'text-gray-500'}`}>
                Page {data?.page} of {data?.pages} ({data?.total} documents)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`p-2 border rounded-lg disabled:opacity-50 transition-colors ${
                    isDark ? 'border-blue-800 text-blue-400 hover:bg-blue-800/40' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= (data?.pages ?? 1)}
                  className={`p-2 border rounded-lg disabled:opacity-50 transition-colors ${
                    isDark ? 'border-blue-800 text-blue-400 hover:bg-blue-800/40' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
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
