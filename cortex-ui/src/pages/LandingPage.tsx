import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { FileText, Zap, Shield, BarChart3, Search, Lock, Moon, Sun } from 'lucide-react';

export default function LandingPage() {
    const { isDark, toggleTheme } = useTheme();
    const features = [
        {
            icon: FileText,
            title: 'Document Processing',
            description: 'Upload and process documents with advanced OCR technology',
        },
        {
            icon: Search,
            title: 'Full-Text Search',
            description: 'Search across all your documents instantly',
        },
        {
            icon: BarChart3,
            title: 'Analytics',
            description: 'Track your document processing and storage usage',
        },
        {
            icon: Shield,
            title: 'Secure',
            description: 'Enterprise-grade security for your documents',
        },
        {
            icon: Zap,
            title: 'Fast',
            description: 'Lightning-fast processing and retrieval',
        },
        {
            icon: Lock,
            title: 'Private',
            description: 'Your data is yours. Complete privacy guaranteed',
        },
    ];

    return (
        <div className={isDark ? 'dark' : ''}>
            <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
                {/* Navigation */}
                <nav className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-sm border-b`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileText className="w-8 h-8 text-blue-600" />
                            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Cortex</span>
                        </div>
                        <div className="flex gap-4 items-center">
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                title={isDark ? 'Light mode' : 'Dark mode'}
                            >
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <Link
                                to="/login"
                                className={`px-4 py-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium`}
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h1 className={`text-5xl md:text-6xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
                        Document Processing Made Simple
                    </h1>
                    <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-2xl mx-auto`}>
                        Upload, organize, and search your documents with powerful OCR technology.
                        Cortex makes document management effortless.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/register"
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg"
                        >
                            Start Free Trial
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium text-lg"
                        >
                            Sign In
                        </Link>
                    </div>
                </section>

                {/* Features Section */}
                <section className={`${isDark ? 'bg-gray-800' : 'bg-white'} py-20`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className={`text-4xl font-bold text-center ${isDark ? 'text-white' : 'text-gray-900'} mb-12`}>
                            Powerful Features
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature) => (
                                <div key={feature.title} className={`p-6 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 hover:shadow-lg hover:shadow-gray-900' : 'border-gray-200 hover:shadow-lg'} transition-shadow`}>
                                    <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                                    <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                                        {feature.title}
                                    </h3>
                                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                        <h2 className="text-4xl font-bold mb-6">Why Choose Cortex?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                            <div>
                                <div className="text-4xl font-bold mb-2">99.9%</div>
                                <p className="text-blue-100">Uptime SLA</p>
                            </div>
                            <div>
                                <div className="text-4xl font-bold mb-2">1M+</div>
                                <p className="text-blue-100">Documents Processed</p>
                            </div>
                            <div>
                                <div className="text-4xl font-bold mb-2">24/7</div>
                                <p className="text-blue-100">Support Available</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
                        Ready to get started?
                    </h2>
                    <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
                        Join thousands of users who trust Cortex for their document management.
                    </p>
                    <Link
                        to="/register"
                        className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg"
                    >
                        Create Free Account
                    </Link>
                </section>

                {/* Footer */}
                <footer className={`${isDark ? 'bg-gray-900 text-gray-500' : 'bg-gray-900 text-gray-400'} py-8`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p>&copy; 2024 Cortex. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
