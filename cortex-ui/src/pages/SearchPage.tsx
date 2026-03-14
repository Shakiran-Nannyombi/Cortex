import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '../api/endpoints';
import { Search, FileText, Loader2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import type { Document } from '../types';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function SearchPage() {
  const { isDark } = useTheme();
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: () => searchApi.search({ q: searchTerm }).then((r) => r.data),
    enabled: !!searchTerm,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(query.trim());
  };

  return (
    <div className="space-y-6">
      <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Search Documents</h1>

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-blue-400/60' : 'text-gray-400'}`} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search document content, titles, filenames..."
            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
              isDark ? 'bg-blue-900/40 border-blue-800 text-white placeholder-blue-400/30' : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={!query.trim()}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          Search
        </button>
      </form>

      {isLoading || isFetching ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : searchTerm && data ? (
        <div>
          <p className={`text-sm mb-4 ${isDark ? 'text-blue-100/40' : 'text-gray-500'}`}>
            Found {data.total} result{data.total !== 1 ? 's' : ''} for "{data.query}"
          </p>
          {data.documents.length === 0 ? (
            <div className={`text-center py-12 ${isDark ? 'text-blue-100/40' : 'text-gray-400'}`}>
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No documents match your search</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.documents.map((doc: Document) => (
                <div
                  key={doc.id}
                  className={`rounded-xl border p-4 transition-colors duration-300 ${isDark ? 'bg-blue-900/40 border-blue-800' : 'bg-white border-gray-200'}`}
                >
                  <div className="flex items-start gap-3">
                    <FileText className={`w-6 h-6 mt-0.5 ${isDark ? 'text-blue-400/60' : 'text-gray-400'}`} />
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{doc.title}</h3>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-blue-100/60' : 'text-gray-500'}`}>
                        {doc.filename} • {formatBytes(doc.file_size)} •{' '}
                        {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                      {doc.content_preview && (
                        <p className={`text-sm mt-2 line-clamp-2 ${isDark ? 'text-blue-100/80' : 'text-gray-600'}`}>
                          {doc.content_preview}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        !searchTerm && (
          <div className={`text-center py-16 ${isDark ? 'text-blue-100/40' : 'text-gray-400'}`}>
            <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Enter a search term to find documents</p>
            <p className="text-sm mt-1">Search by content, title, or filename</p>
          </div>
        )
      )}
    </div>
  );
}
