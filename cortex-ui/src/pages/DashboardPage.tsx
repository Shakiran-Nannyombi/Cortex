import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/endpoints';
import {
  FileText,
  FolderOpen,
  Tags,
  HardDrive,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import type { Document } from '../types';

const MOCK_DASHBOARD = {
  total_documents: 12,
  total_workspaces: 3,
  total_tags: 8,
  total_storage_bytes: 24_500_000,
  status_breakdown: { completed: 10, processing: 1, pending: 1 },
  type_breakdown: { 'application/pdf': 7, 'image/png': 3, 'text/plain': 2 },
  recent_documents: [
    { id: '1', title: 'Financial Report Q1.pdf', filename: 'report.pdf', file_size: 2_400_000, mime_type: 'application/pdf', status: 'completed' as const, page_count: 12, content_preview: '', content_text: '', error_message: '', user_id: '1', workspace_id: '1', folder_id: null, tags: [], created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date().toISOString(), processed_at: new Date().toISOString() },
    { id: '2', title: 'Annual Report 2025.pdf', filename: 'annual.pdf', file_size: 5_100_000, mime_type: 'application/pdf', status: 'completed' as const, page_count: 48, content_preview: '', content_text: '', error_message: '', user_id: '1', workspace_id: '1', folder_id: null, tags: [], created_at: new Date(Date.now() - 172800000).toISOString(), updated_at: new Date().toISOString(), processed_at: new Date().toISOString() },
    { id: '3', title: 'Contract Draft.docx', filename: 'contract.docx', file_size: 890_000, mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', status: 'processing' as const, page_count: 6, content_preview: '', content_text: '', error_message: '', user_id: '1', workspace_id: '2', folder_id: null, tags: [], created_at: new Date(Date.now() - 3600000).toISOString(), updated_at: new Date().toISOString(), processed_at: null },
  ],
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case 'processing':
      return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    case 'failed':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Clock className="w-4 h-4 text-yellow-500" />;
  }
}

export default function DashboardPage() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const isDemo = localStorage.getItem('access_token') === 'demo-mock-token';

  const { data: apiData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => analyticsApi.dashboard().then((r) => r.data),
    enabled: !isDemo,
  });

  const data = isDemo ? MOCK_DASHBOARD : apiData;

  if (!isDemo && isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Documents',
      value: data?.total_documents ?? 0,
      icon: FileText,
      color: isDark ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Workspaces',
      value: data?.total_workspaces ?? 0,
      icon: FolderOpen,
      color: isDark ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Tags',
      value: data?.total_tags ?? 0,
      icon: Tags,
      color: isDark ? 'bg-green-600/20 text-green-400' : 'bg-green-50 text-green-600',
    },
    {
      label: 'Storage Used',
      value: formatBytes(data?.total_storage_bytes ?? 0),
      icon: HardDrive,
      color: isDark ? 'bg-orange-600/20 text-orange-400' : 'bg-orange-50 text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl border p-5 transition-colors duration-300 ${isDark ? 'bg-blue-900/40 border-blue-800' : 'bg-white border-gray-200'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-blue-100/60' : 'text-gray-500'}`}>{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Breakdown & Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className={`rounded-xl border p-5 transition-colors duration-300 ${isDark ? 'bg-blue-900/40 border-blue-800' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Processing Status
          </h2>
          <div className="space-y-3">
            {Object.entries(data?.status_breakdown ?? {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusIcon status={status} />
                  <span className={`text-sm capitalize ${isDark ? 'text-blue-100/60' : 'text-gray-700'}`}>{status}</span>
                </div>
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{count}</span>
              </div>
            ))}
            {Object.keys(data?.status_breakdown ?? {}).length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500">No documents yet</p>
            )}
          </div>
        </div>

        {/* Recent Documents */}
        <div className={`rounded-xl border p-5 transition-colors duration-300 ${isDark ? 'bg-blue-900/40 border-blue-800' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Recent Documents
          </h2>
          <div className="space-y-3">
            {(data?.recent_documents ?? []).map((doc: Document) => (
              <div key={doc.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <StatusIcon status={doc.status} />
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {doc.title}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-blue-100/60' : 'text-gray-500'}`}>
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-2 whitespace-nowrap">
                  {formatBytes(doc.file_size)}
                </span>
              </div>
            ))}
            {(data?.recent_documents ?? []).length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500">No documents yet</p>
            )}
          </div>
        </div>
      </div>

      {/* File Type Breakdown */}
      {Object.keys(data?.type_breakdown ?? {}).length > 0 && (
        <div className={`rounded-xl border p-5 transition-colors duration-300 ${isDark ? 'bg-blue-900/40 border-blue-800' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>File Types</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(data?.type_breakdown ?? {}).map(([type, count]) => (
              <div key={type} className={`rounded-lg p-3 text-center ${isDark ? 'bg-blue-800/20' : 'bg-gray-50'}`}>
                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{count}</p>
                <p className={`text-xs truncate ${isDark ? 'text-blue-100/60' : 'text-gray-500'}`}>{type.split('/')[1] || type}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
