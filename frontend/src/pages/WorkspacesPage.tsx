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
import type { Workspace, Folder as FolderType } from '../types';

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
  const [values, setValues] = useState<Record<string, string>>({});

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                value={values[field.name] || ''}
                onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                required={field.required}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          ))}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
  const queryClient = useQueryClient();
  const [showCreateWs, setShowCreateWs] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState<string | null>(null);
  const [selectedWs, setSelectedWs] = useState<Workspace | null>(null);

  const { data: wsData, isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () => workspacesApi.list().then((r) => r.data),
  });

  const { data: foldersData } = useQuery({
    queryKey: ['folders', selectedWs?.id],
    queryFn: () =>
      selectedWs
        ? foldersApi.list({ workspace_id: selectedWs.id }).then((r) => r.data)
        : Promise.resolve({ folders: [] }),
    enabled: !!selectedWs,
  });

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Workspaces</h1>
        <button
          onClick={() => setShowCreateWs(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> New Workspace
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(wsData?.workspaces ?? []).map((ws) => (
          <div
            key={ws.id}
            className={`bg-white rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md ${
              selectedWs?.id === ws.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'
            }`}
            onClick={() => setSelectedWs(selectedWs?.id === ws.id ? null : ws)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <FolderOpen className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">{ws.name}</h3>
                  {ws.description && (
                    <p className="text-sm text-gray-500 mt-0.5">{ws.description}</p>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteWsMutation.mutate(ws.id);
                }}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 flex gap-4 text-xs text-gray-500">
              <span>{ws.document_count} docs</span>
              <span>{ws.folder_count} folders</span>
            </div>
          </div>
        ))}

        {(wsData?.workspaces ?? []).length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400">
            <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No workspaces yet. Create one to get started.</p>
          </div>
        )}
      </div>

      {/* Folders within selected workspace */}
      {selectedWs && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Folders in {selectedWs.name}
            </h2>
            <button
              onClick={() => setShowCreateFolder(selectedWs.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
            >
              <Plus className="w-4 h-4" /> New Folder
            </button>
          </div>
          {(foldersData?.folders ?? []).length === 0 ? (
            <p className="text-sm text-gray-400">No folders in this workspace</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {foldersData?.folders.map((folder: FolderType) => (
                <div
                  key={folder.id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2">
                    <Folder className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{folder.name}</p>
                      <p className="text-xs text-gray-500">{folder.document_count} docs</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteFolderMutation.mutate(folder.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
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
