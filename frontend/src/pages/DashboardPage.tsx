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
import type { Document } from '../types';

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
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => analyticsApi.dashboard().then((r) => r.data),
  });

  if (isLoading) {
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
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Workspaces',
      value: data?.total_workspaces ?? 0,
      icon: FolderOpen,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Tags',
      value: data?.total_tags ?? 0,
      icon: Tags,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Storage Used',
      value: formatBytes(data?.total_storage_bytes ?? 0),
      icon: HardDrive,
      color: 'bg-orange-50 text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
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
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Processing Status
          </h2>
          <div className="space-y-3">
            {Object.entries(data?.status_breakdown ?? {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusIcon status={status} />
                  <span className="text-sm text-gray-700 capitalize">{status}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
            {Object.keys(data?.status_breakdown ?? {}).length === 0 && (
              <p className="text-sm text-gray-400">No documents yet</p>
            )}
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Documents
          </h2>
          <div className="space-y-3">
            {(data?.recent_documents ?? []).map((doc: Document) => (
              <div key={doc.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <StatusIcon status={doc.status} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                  {formatBytes(doc.file_size)}
                </span>
              </div>
            ))}
            {(data?.recent_documents ?? []).length === 0 && (
              <p className="text-sm text-gray-400">No documents yet</p>
            )}
          </div>
        </div>
      </div>

      {/* File Type Breakdown */}
      {Object.keys(data?.type_breakdown ?? {}).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">File Types</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(data?.type_breakdown ?? {}).map(([type, count]) => (
              <div key={type} className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-gray-900">{count}</p>
                <p className="text-xs text-gray-500 truncate">{type.split('/')[1] || type}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
