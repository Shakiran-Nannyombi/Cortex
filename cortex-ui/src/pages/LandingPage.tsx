import { Link, useNavigate } from 'react-router-dom';
import { FileText, Zap, Shield, BarChart3, Search, Lock } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

export default function LandingPage() {
    const { isDark } = useTheme();
    const { demoLogin } = useAuth();
    const navigate = useNavigate();

    const handleDemoLogin = async () => {
        await demoLogin();
        navigate('/dashboard');
    };
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
            {/* Hero Section */}
            <HeroSection />

            {/* Features Section */}
            <section id="features" className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className={`text-4xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Powerful Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className={`p-6 rounded-xl border transition-shadow hover:shadow-lg ${isDark
                                    ? 'bg-gray-800 border-gray-700 hover:shadow-blue-900/20'
                                    : 'bg-white border-gray-200 hover:shadow-gray-200'
                                    }`}
                            >
                                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                                <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {feature.title}
                                </h3>
                                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="why" className={`py-20 ${isDark ? 'bg-linear-to-r from-blue-900 to-indigo-900' : 'bg-linear-to-r from-blue-600 to-indigo-600'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h2 className="text-4xl font-bold mb-6">Why Choose Cortex?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <div>
                            <div className="text-4xl font-bold mb-2">99.9%</div>
                            <p className={isDark ? 'text-blue-200' : 'text-blue-100'}>Uptime SLA</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">1M+</div>
                            <p className={isDark ? 'text-blue-200' : 'text-blue-100'}>Documents Processed</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">24/7</div>
                            <p className={isDark ? 'text-blue-200' : 'text-blue-100'}>Support Available</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="pricing" className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Ready to get started?
                    </h2>
                    <p className={`text-xl mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Join thousands of users who trust Cortex for their document management.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/register"
                            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg"
                        >
                            Create Free Account
                        </Link>
                        <button
                            onClick={handleDemoLogin}
                            className={`inline-block px-8 py-3 rounded-lg font-medium text-lg transition-colors ${isDark
                                ? 'bg-gray-700 text-white hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                                }`}
                        >
                            View Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
