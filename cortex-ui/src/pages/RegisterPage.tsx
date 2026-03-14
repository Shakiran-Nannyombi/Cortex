import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { FileText, Mail, Lock, User, AtSign, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await register(email, username, password, fullName);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 ${
    isDark
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
  }`;

  const labelClass = `block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      {/* Left image panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{ backgroundImage: "url('/auth-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Dark blue overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-950/90 via-blue-900/80 to-indigo-900/80" />

        <Link to="/" className="relative flex items-center gap-2 w-fit">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Cortex</span>
        </Link>

        <div className="relative space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Start unlocking your <br />document intelligence.
            </h2>
            <p className="text-blue-100 text-lg">
              Create a free account and see what Cortex can discover in your documents.
            </p>
          </div>

          <div className="space-y-4">
            {[
              'Free account, no credit card required',
              'Process documents in seconds with AI',
              'Ask questions across your entire library',
              'Summarize, translate, and extract insights',
            ].map((text) => (
              <div key={text} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-200 shrink-0" />
                <span className="text-blue-100 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-blue-200 text-sm">
          © {new Date().getFullYear()} Cortex · Microsoft DevDays 2026 Hackathon
        </p>
      </div>

      {/* Right form panel */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center px-6 py-16 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex lg:hidden items-center gap-2 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Cortex</span>
          </Link>

          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Create your account
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              Free forever. No credit card required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className={labelClass}>Full Name</label>
              <div className="relative">
                <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`${inputClass} pl-10`}
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className={labelClass}>Username</label>
              <div className="relative">
                <AtSign className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className={`${inputClass} pl-10`}
                  placeholder="janedoe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>Email address</label>
              <div className="relative">
                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`${inputClass} pl-10`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>Password</label>
              <div className="relative">
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className={`${inputClass} pl-10`}
                  placeholder="Min. 8 characters"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 text-sm mt-2"
            >
              {loading ? 'Creating account...' : (
                <>
                  Create Free Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className={`mt-6 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-500 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
