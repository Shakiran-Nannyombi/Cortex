import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';
import { 
    FileText, Search, Brain, Globe, Activity, Sparkles, 
    Shield, Zap, BarChart3, Lock, Tags, FolderOpen
} from 'lucide-react';
import Footer from '../components/Footer';

const allFeatures = [
    {
        icon: FileText,
        title: 'Smart Document Processing',
        description: 'Upload PDFs, Word docs, images, and more. Our OCR engine extracts every word with industry-leading accuracy, even from scanned pages.',
        color: 'blue',
    },
    {
        icon: Brain,
        title: 'Intelligent Summarization',
        description: 'AI condenses lengthy documents into crisp, structured summaries — highlighting the key findings, obligations, and action items.',
        color: 'purple',
    },
    {
        icon: Search,
        title: 'Cross-Document Querying',
        description: 'Ask a question in plain English and get precise answers drawn from your entire document library in milliseconds.',
        color: 'blue',
    },
    {
        icon: Activity,
        title: 'Automatic Entity Extraction',
        description: 'Automatically surface names, dates, monetary values, organizations, and custom entities across thousands of documents.',
        color: 'green',
    },
    {
        icon: Globe,
        title: 'Multi-language Translation',
        description: 'Translate and understand documents across 40+ languages instantly, without leaving your workspace.',
        color: 'amber',
    },
    {
        icon: BarChart3,
        title: 'Analytics & Insights',
        description: 'Track processing volumes, storage usage, and query patterns with real-time dashboards that give your team full visibility.',
        color: 'blue',
    },
    {
        icon: FolderOpen,
        title: 'Workspaces & Collaboration',
        description: 'Organize documents into dedicated workspaces per team, project, or client. Share securely with granular access controls.',
        color: 'purple',
    },
    {
        icon: Tags,
        title: 'Smart Tagging',
        description: 'Manually tag documents or let AI suggest relevant labels automatically based on content, helping you find anything instantly.',
        color: 'green',
    },
    {
        icon: Shield,
        title: 'Enterprise-Grade Security',
        description: 'AES-256 encryption at rest, TLS in transit, SOC 2 compliant infrastructure, and role-based access — your data is locked down.',
        color: 'red',
    },
    {
        icon: Lock,
        title: 'API Access',
        description: 'Integrate Cortex into your existing tools. Our REST API lets you build custom pipelines, trigger workflows, and pull insights programmatically.',
        color: 'amber',
    },
    {
        icon: Sparkles,
        title: 'AI Chat Interface',
        description: 'Interact with your documents through a conversational AI assistant. Ask follow-ups, request rewrites, or drill into specific sections.',
        color: 'purple',
    },
    {
        icon: Zap,
        title: 'Lightning-Fast Processing',
        description: 'Documents are processed within seconds of upload. No queues, no delays — your team stays productive.',
        color: 'blue',
    },
];

const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

export default function FeaturesPage() {
    const { isDark } = useTheme();

    return (
        <div className={isDark ? 'dark' : ''}>
            <div className={isDark ? 'bg-blue-950' : 'bg-white'}>
                {/* Hero */}
                <section className={`relative pt-28 pb-20 overflow-hidden ${isDark ? 'bg-blue-950' : 'bg-white'}`}>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
                    <div className="relative max-w-4xl mx-auto px-6 text-center">
                        <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Powerful features, built for teams
                        </h1>
                        <p className={`text-xl max-w-2xl mx-auto mb-10 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Cortex brings AI-powered document intelligence to every corner of your workflow — from ingestion to insights.
                        </p>
                        <Link
                            to="/register"
                            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg transition-colors"
                        >
                            Get Started Free
                        </Link>
                    </div>
                </section>

                {/* Features Grid */}
                <section className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {allFeatures.map((feature) => (
                                <div
                                    key={feature.title}
                                    className={`p-8 rounded-2xl border transition-all hover:shadow-xl hover:-translate-y-1 ${
                                        isDark ? 'bg-gray-800 border-gray-700 hover:shadow-blue-900/20' : 'bg-white border-gray-200 hover:shadow-gray-200'
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${colorMap[feature.color]}`}>
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {feature.title}
                                    </h3>
                                    <p className={`text-base leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className={`py-24 text-center ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
                    <div className="max-w-2xl mx-auto px-6">
                        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Ready to see it in action?
                        </h2>
                        <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Start with a free account. No credit card required.
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Link to="/register" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg transition-colors">
                                Create Free Account
                            </Link>
                            <Link to="/pricing" className={`px-8 py-3 rounded-lg font-medium text-lg border transition-colors ${isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                                View Pricing
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}
