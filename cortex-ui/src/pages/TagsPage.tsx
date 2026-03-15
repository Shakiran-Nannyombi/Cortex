import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagsApi } from '../api/endpoints';
import { Tags, Plus, Trash2, Edit3, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../hooks/useTheme';

const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#F97316', '#6366F1', '#14B8A6',
];

const MOCK_TAGS = {
  tags: [
    { id: '1', name: 'Important', color: '#EF4444', user_id: '1', created_at: new Date().toISOString() },
    { id: '2', name: 'Review', color: '#F59E0B', user_id: '1', created_at: new Date().toISOString() },
    { id: '3', name: 'Archive', color: '#10B981', user_id: '1', created_at: new Date().toISOString() },
    { id: '4', name: 'Finance', color: '#3B82F6', user_id: '1', created_at: new Date().toISOString() },
    { id: '5', name: 'Legal', color: '#8B5CF6', user_id: '1', created_at: new Date().toISOString() },
  ],
};

export default function TagsPage() {
  const { isDark } = useTheme();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const isDemo = localStorage.getItem('access_token') === 'demo-mock-token';

  const { data: apiData, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsApi.list().then((r) => r.data),
    enabled: !isDemo,
  });

  const data = isDemo ? MOCK_TAGS : apiData;

  const createMutation = useMutation({
    mutationFn: () => tagsApi.create({ name, color }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setShowCreate(false);
      setName('');
      setColor(COLORS[0]);
      toast.success('Tag created!');
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Failed');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; color?: string } }) =>
      tagsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      setEditingTag(null);
      setName('');
      toast.success('Tag updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tagsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Tag deleted');
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
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Tags</h1>
        <button
          onClick={() => {
            if (isDemo) { toast('Demo mode — create is disabled'); return; }
            setShowCreate(true);
            setName('');
            setColor(COLORS[0]);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> New Tag
        </button>
      </div>

      {/* Create/Edit Form */}
      {(showCreate || editingTag) && (
        <div className={`rounded-xl border p-5 transition-colors duration-300 ${isDark ? 'bg-blue-900/40 border-blue-800' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {editingTag ? 'Edit Tag' : 'Create Tag'}
            </h3>
            <button
              onClick={() => {
                setShowCreate(false);
                setEditingTag(null);
              }}
              className={`p-1 transition-colors ${isDark ? 'text-blue-400/60 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingTag) {
                updateMutation.mutate({ id: editingTag, data: { name, color } });
              } else {
                createMutation.mutate();
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-blue-100/60' : 'text-gray-700'}`}>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${isDark ? 'bg-blue-900/40 border-blue-800 text-white placeholder-blue-400/30' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                placeholder="e.g., Important, Review, Archive"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-blue-100/60' : 'text-gray-700'}`}>Color</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${color === c ? (isDark ? 'border-white scale-110' : 'border-gray-900 scale-110') : 'border-transparent'
                      }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              {editingTag ? 'Update' : 'Create'}
            </button>
          </form>
        </div>
      )}

      {/* Tags List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {(data?.tags ?? []).map((tag) => (
          <div
            key={tag.id}
            className={`rounded-xl border p-4 flex items-center justify-between transition-colors duration-300 ${isDark ? 'bg-blue-900/40 border-blue-800' : 'bg-white border-gray-200'}`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ backgroundColor: tag.color }}
              />
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{tag.name}</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  setEditingTag(tag.id);
                  setName(tag.name);
                  setColor(tag.color);
                  setShowCreate(false);
                }}
                className={`p-1.5 transition-colors ${isDark ? 'text-blue-400/40 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'}`}
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteMutation.mutate(tag.id)}
                className={`p-1.5 transition-colors ${isDark ? 'text-blue-400/40 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(data?.tags ?? []).length === 0 && !showCreate && (
        <div className={`text-center py-12 ${isDark ? 'text-blue-100/40' : 'text-gray-400'}`}>
          <Tags className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No tags yet. Create one to organize your documents.</p>
        </div>
      )}
    </div>
  );
}
