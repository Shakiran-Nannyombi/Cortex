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
  Menu,
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
      {/* Mobile top bar */}
      <header className={`lg:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-30 transition-colors duration-300 ${isDark ? 'bg-blue-950 border-blue-800' : 'bg-white border-gray-200'
        }`}>
        <Link to="/dashboard" className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Cortex</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(true)}
          className={`p-2 rounded-lg transition-colors ${isDark ? 'text-blue-100/60 hover:bg-blue-800/30' : 'text-gray-500 hover:bg-gray-100'
            }`}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Dropdown Menu Overlay */}
        {sidebarOpen && (
          <div className={`fixed inset-0 z-50 lg:hidden flex flex-col transition-all duration-300 ${isDark ? 'bg-blue-950/95 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md'
            }`}>
            <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'border-blue-800' : 'border-gray-200'}`}>
              <Link to="/dashboard" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Cortex</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'text-blue-100/60 hover:bg-blue-800/30' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-6 space-y-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-medium transition-all ${isActive
                      ? (isDark ? 'bg-blue-600/20 text-blue-400 shadow-sm border border-blue-500/20' : 'bg-blue-50 text-blue-700 border border-blue-100')
                      : (isDark ? 'text-blue-100/60 hover:bg-blue-800/30 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')
                      }`}
                  >
                    <item.icon className="w-6 h-6" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className={`p-6 border-t ${isDark ? 'border-blue-800' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${isDark ? 'bg-blue-900/50' : 'bg-gray-100'}`}>
                    <Settings className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {user?.full_name || user?.username}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-blue-100/60' : 'text-gray-500'}`}>{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg transition-all ${isDark ? 'bg-blue-800/50 text-yellow-400' : 'bg-gray-100 text-gray-500'
                    }`}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/10 text-red-600 rounded-xl font-semibold hover:bg-red-600 hover:text-white transition-all"
              >
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </div>
          </div>
        )}

        {/* Desktop Sidebar (Always static on LG) */}
        <aside
          className={`hidden lg:flex flex-col w-64 border-r transition-all duration-300 ${isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-white border-gray-200'}`}
        >
          <div className="h-full flex flex-col">
            <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-blue-800' : 'border-gray-200'}`}>
              <Link to="/dashboard" className="flex items-center gap-2">
                <FileText className="w-8 h-8 text-blue-600" />
                <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Cortex</span>
              </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
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
                <div className="truncate min-w-0 flex-1 mr-2">
                  <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {user?.full_name || user?.username}
                  </p>
                  <p className={`text-xs truncate ${isDark ? 'text-blue-100/60' : 'text-gray-500'}`}>{user?.email}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleTheme}
                    className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-blue-400 hover:bg-blue-800/50' : 'text-gray-500 hover:bg-gray-100'}`}
                    title={isDark ? 'Light Mode' : 'Dark Mode'}
                  >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
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
