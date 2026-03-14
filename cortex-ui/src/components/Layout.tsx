import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  FileText,
  FolderOpen,
  Search,
  BarChart3,
  Tags,
  LogOut,
  X,
  Key,
  Settings,
  Sun,
  Moon,
} from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/documents', icon: FileText, label: 'Documents' },
    { path: '/workspaces', icon: FolderOpen, label: 'Workspaces' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/tags', icon: Tags, label: 'Tags' },
    { path: '/api-keys', icon: Key, label: 'API Keys' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-blue-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 border-r transform transition-all duration-300 lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            } ${isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-white border-gray-200'}`}
        >
          <div className="h-full flex flex-col">
            <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-blue-800' : 'border-gray-200'}`}>
              <Link to="/" className="flex items-center gap-2">
                <FileText className="w-8 h-8 text-blue-600" />
                <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Cortex</span>
              </Link>
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg transition-colors ${isDark ? 'text-blue-400 hover:bg-blue-800/50' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                        ? (isDark ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-700')
                        : (isDark ? 'text-blue-100/60 hover:bg-blue-800/30 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className={`p-4 border-t ${isDark ? 'border-blue-800' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="truncate">
                  <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {user?.full_name || user?.username}
                  </p>
                  <p className={`text-xs truncate ${isDark ? 'text-blue-100/60' : 'text-gray-500'}`}>{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          <main id="main-content" className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
