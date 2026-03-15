import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspacesApi, foldersApi } from '../api/endpoints';
import {
  FolderOpen,
  Plus,
  Trash2,
  Folder,
  Loader2,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../hooks/useTheme';
import type { Workspace, Folder as FolderType } from '../types';

const MOCK_WORKSPACES = {
  workspaces: [
    { id: '1', name: 'Reports', description: 'Financial and business reports', user_id: '1', document_count: 7, folder_count: 2, created_at: new Date(Date.now() - 604800000).toISOString(), updated_at: new Date().toISOString() },
    { id: '2', name: 'Contracts', description: 'Legal contracts and agreements', user_id: '1', document_count: 3, folder_count: 1, created_at: new Date(Date.now() - 1209600000).toISOString(), updated_at: new Date().toISOString() },
    { id: '3', name: 'Research', description: 'Research papers and notes', user_id: '1', document_count: 2, folder_count: 0, created_at: new Date(Date.now() - 2592000000).toISOString(), updated_at: new Date().toISOString() },
  ],
};

const MOCK_FOLDERS: Record<string, { folders: FolderType[] }> = {
  '1': {
    folders: [
      { id: '1', name: 'Q1 Reports', workspace_id: '1', parent_id: null, document_count: 4, children_count: 0, created_at: new Date().toISOString() },
      { id: '2', name: 'Q2 Reports', workspace_id: '1', parent_id: null, document_count: 3, children_count: 0, created_at: new Date().toISOString() },
    ]
  },
  '2': {
    folders: [
      { id: '3', name: 'Active Contracts', workspace_id: '2', parent_id: null, document_count: 3, children_count: 0, created_at: new Date().toISOString() },
    ]
  },
  '3': { folders: [] },
};

function CreateModal({
  title,
  onClose,
  onSubmit,
  fields,
}: {
  title: string;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => void;
  fields: { name: string; label: string; required?: boolean }[];
}) {
  const { isDark } = useTheme();
  const [values, setValues] = useState<Record<string, string>>({});

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-all">
      <div className={`rounded-xl p-6 w-full max-w-md border transition-all duration-300 ${isDark ? 'bg-blue-950 border-blue-800' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
          <button onClick={onClose} className={`p-1 transition-colors ${isDark ? 'text-blue-400/60 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(values);
          }}
          className="space-y-4"
        >
          {fields.map((field) => (
            <div key={field.name}>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-blue-100/60' : 'text-gray-700'}`}>
                {field.label}
              </label>
              <input
                value={values[field.name] || ''}
                onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                required={field.required}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${isDark ? 'bg-blue-900/40 border-blue-800 text-white placeholder-blue-400/30' : 'bg-white border-gray-300 text-gray-900'
                  }`}
              />
            </div>
          ))}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-sm border rounded-lg transition-colors ${isDark ? 'border-blue-800 text-blue-400 hover:bg-blue-800/40' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function WorkspacesPage() {
  const { isDark } = useTheme();
  const queryClient = useQueryClient();
  const [showCreateWs, setShowCreateWs] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState<string | null>(null);
  const [selectedWs, setSelectedWs] = useState<Workspace | null>(null);
  const isDemo = localStorage.getItem('access_token') === 'demo-mock-token';

  const { data: wsData, isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () => workspacesApi.list().then((r) => r.data),
    enabled: !isDemo,
  });

  const { data: foldersData } = useQuery({
    queryKey: ['folders', selectedWs?.id],
    queryFn: () =>
      selectedWs
        ? foldersApi.list({ workspace_id: selectedWs.id }).then((r) => r.data)
        : Promise.resolve({ folders: [] }),
    enabled: !!selectedWs && !isDemo,
  });

  const effectiveWsData = isDemo ? MOCK_WORKSPACES : wsData;
  const effectiveFoldersData = isDemo && selectedWs ? MOCK_FOLDERS[selectedWs.id] ?? { folders: [] } : foldersData;

  const createWsMutation = useMutation({
    mutationFn: (data: Record<string, string>) =>
      workspacesApi.create({ name: data.name, description: data.description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setShowCreateWs(false);
      toast.success('Workspace created!');
    },
    onError: () => toast.error('Failed to create workspace'),
  });

  const deleteWsMutation = useMutation({
    mutationFn: (id: string) => workspacesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setSelectedWs(null);
      toast.success('Workspace deleted');
    },
  });

  const createFolderMutation = useMutation({
    mutationFn: (data: Record<string, string>) =>
      foldersApi.create({ name: data.name, workspace_id: data.workspace_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setShowCreateFolder(null);
      toast.success('Folder created!');
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: (id: string) => foldersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Folder deleted');
    },
  });

  if (!isDemo && isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Workspaces</h1>
        <button
          onClick={() => isDemo ? toast('Demo mode — create is disabled') : setShowCreateWs(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> New Workspace
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(effectiveWsData?.workspaces ?? []).map((ws) => (
          <div
            key={ws.id}
            className={`rounded-xl border p-5 cursor-pointer transition-all duration-300 hover:shadow-md ${selectedWs?.id === ws.id
              ? (isDark ? 'border-blue-500 ring-4 ring-blue-500/10 bg-blue-900/40' : 'border-blue-500 ring-2 ring-blue-100 bg-white')
              : (isDark ? 'border-blue-800 bg-blue-900/20 hover:bg-blue-800/20' : 'border-gray-200 bg-white hover:bg-gray-50')
              }`}
            onClick={() => setSelectedWs(selectedWs?.id === ws.id ? null : ws)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <FolderOpen className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{ws.name}</h3>
                  {ws.description && (
                    <p className={`text-sm mt-0.5 ${isDark ? 'text-blue-100/60' : 'text-gray-500'}`}>{ws.description}</p>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isDemo) { toast('Demo mode — delete is disabled'); return; }
                  deleteWsMutation.mutate(ws.id);
                }}
                className={`p-1 transition-colors ${isDark ? 'text-blue-400/40 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className={`mt-3 flex gap-4 text-xs ${isDark ? 'text-blue-100/40' : 'text-gray-500'}`}>
              <span>{ws.document_count} docs</span>
              <span>{ws.folder_count} folders</span>
            </div>
          </div>
        ))}

        {(effectiveWsData?.workspaces ?? []).length === 0 && (
          <div className={`col-span-full text-center py-12 ${isDark ? 'text-blue-100/40' : 'text-gray-400'}`}>
            <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No workspaces yet. Create one to get started.</p>
          </div>
        )}
      </div>

      {/* Folders within selected workspace */}
      {selectedWs && (
        <div className={`rounded-xl border p-5 transition-colors duration-300 ${isDark ? 'bg-blue-900/40 border-blue-800' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Folders in {selectedWs.name}
            </h2>
            <button
              onClick={() => isDemo ? toast('Demo mode — create is disabled') : setShowCreateFolder(selectedWs.id)}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg transition-colors ${isDark ? 'text-blue-400 border-blue-800 hover:bg-blue-800/40' : 'text-blue-600 border-blue-200 hover:bg-blue-50'
                }`}
            >
              <Plus className="w-4 h-4" /> New Folder
            </button>
          </div>
          {(effectiveFoldersData?.folders ?? []).length === 0 ? (
            <p className={`text-sm ${isDark ? 'text-blue-100/40' : 'text-gray-400'}`}>No folders in this workspace</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {effectiveFoldersData?.folders.map((folder: FolderType) => (
                <div
                  key={folder.id}
                  className={`flex items-center justify-between rounded-lg p-3 transition-colors ${isDark ? 'bg-blue-800/20' : 'bg-gray-50'}`}
                >
                  <div className="flex items-center gap-2">
                    <Folder className={`w-5 h-5 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{folder.name}</p>
                      <p className={`text-xs ${isDark ? 'text-blue-100/60' : 'text-gray-500'}`}>{folder.document_count} docs</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { if (isDemo) { toast('Demo mode — delete is disabled'); return; } deleteFolderMutation.mutate(folder.id); }}
                    className={`p-1 transition-colors ${isDark ? 'text-blue-400/40 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showCreateWs && (
        <CreateModal
          title="New Workspace"
          onClose={() => setShowCreateWs(false)}
          onSubmit={(data) => createWsMutation.mutate(data)}
          fields={[
            { name: 'name', label: 'Name', required: true },
            { name: 'description', label: 'Description' },
          ]}
        />
      )}

      {showCreateFolder && (
        <CreateModal
          title="New Folder"
          onClose={() => setShowCreateFolder(null)}
          onSubmit={(data) =>
            createFolderMutation.mutate({
              ...data,
              workspace_id: showCreateFolder,
            })
          }
          fields={[{ name: 'name', label: 'Folder Name', required: true }]}
        />
      )}
    </div>
  );
}
