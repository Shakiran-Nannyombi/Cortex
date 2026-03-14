import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { 
    Sparkles, 
    LineChart, 
    PieChart, 
    Activity, 
    Brain, 
    FileText, 
    ChevronRight,
    ChevronLeft,
    Globe,
    Cpu,
    Search
} from 'lucide-react';

const BackgroundAnimation = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Scanning Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]">
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-blue-500/10 to-transparent h-40 animate-scan"></div>
        </div>

        {/* Floating Intelligence Nodes */}
        <div className="absolute top-1/4 left-10 opacity-20 animate-float" style={{ animationDelay: '0s' }}>
            <Brain className="w-12 h-12 text-blue-500" />
        </div>
        <div className="absolute top-1/3 right-20 opacity-10 animate-float" style={{ animationDelay: '2s' }}>
            <FileText className="w-16 h-16 text-blue-400" />
        </div>
        <div className="absolute bottom-1/4 left-1/4 opacity-15 animate-float" style={{ animationDelay: '4s' }}>
            <Sparkles className="w-10 h-10 text-blue-300" />
        </div>
        <div className="absolute top-1/2 right-1/4 opacity-10 animate-pulse-slow">
            <Globe className="w-24 h-24 text-blue-600" />
        </div>
        <div className="absolute bottom-20 right-1/3 opacity-5 animate-float" style={{ animationDelay: '1s' }}>
            <Cpu className="w-20 h-20 text-blue-500" />
        </div>

        {/* Subtle Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px]"></div>
    </div>
);

const aiFeatures = [
    { 
        title: 'Intelligent Document Summarization', 
        icon: Sparkles,
        description: 'AI condenses complex documents into clear, actionable insights in seconds.'
    },
    { 
        title: 'Cross-Document Querying', 
        icon: Search,
        description: 'Ask questions across your entire document library at once.'
    },
    { 
        title: 'Automatic Entity Extraction', 
        icon: Activity,
        description: 'Identify companies, people, terms, and key data automatically.'
    },
    { 
        title: 'Multi-language Translation', 
        icon: Globe,
        description: 'Translate and understand documents across 40+ languages instantly.'
    },
];

function FeatureMockup({ activeIndex, isDark }: { activeIndex: number, isDark: boolean }) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="space-y-6"
            >
                {activeIndex === 0 && (
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div className={`flex-1 p-4 rounded-2xl rounded-tl-none ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                <p className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Summary generated:</p>
                                <div className={`h-2 rounded w-full mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                <div className={`h-2 rounded w-5/6 mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                <div className={`h-2 rounded w-4/5 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                            </div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <div className={`text-xs px-3 py-1 rounded-full ${isDark ? 'bg-green-900/40 text-green-400' : 'bg-green-100 text-green-700'}`}>✓ 3 key points extracted</div>
                            <div className={`text-xs px-3 py-1 rounded-full ${isDark ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>12 pages summarized</div>
                        </div>
                    </div>
                )}
                {activeIndex === 1 && (
                    <div className="space-y-4">
                        <div className={`p-4 rounded-xl border ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                            <div className="flex items-center gap-2 mb-3">
                                <Search className="w-4 h-4 text-blue-600" />
                                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Searching across 12 docs...</p>
                            </div>
                            <div className="space-y-3">
                                {['Annual Report 2024', 'Q3 Analysis.pdf'].map((doc, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{doc}</span>
                                        <div className={`h-1.5 rounded flex-1 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                        <span className="text-[10px] text-blue-500 font-bold">94%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {activeIndex === 2 && (
                    <div className="space-y-4">
                        <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Entities Found</p>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Organization', value: 'Cortex Inc.', color: 'blue' },
                                { label: 'Founder', value: 'J. Smith', color: 'purple' },
                                { label: 'Deal Size', value: '$4.2M', color: 'green' },
                                { label: 'Currency', value: 'USD', color: 'amber' }
                            ].map(tag => (
                                <div key={tag.label} className={`p-3 rounded-lg border text-center ${
                                    isDark ? `border-${tag.color}-500/30 bg-${tag.color}-500/10` : `border-${tag.color}-200 bg-${tag.color}-50`
                                }`}>
                                    <p className={`text-[10px] font-bold uppercase mb-1 ${isDark ? `text-${tag.color}-400` : `text-${tag.color}-600`}`}>{tag.label}</p>
                                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{tag.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {activeIndex === 3 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-6">
                            <div className="text-center">
                                <div className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold mb-1">EN</div>
                                <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Source</p>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <ChevronRight className="w-5 h-5 text-blue-400" />
                                <span className={`text-[9px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>AI</span>
                            </div>
                            <div className="text-center">
                                <div className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-bold mb-1">FR</div>
                                <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Target</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className={`h-2 rounded w-full ${isDark ? 'bg-purple-900/40' : 'bg-purple-100'}`}></div>
                            <div className={`h-2 rounded w-5/6 ${isDark ? 'bg-purple-900/40' : 'bg-purple-100'}`}></div>
                            <div className={`h-2 rounded w-3/4 ${isDark ? 'bg-purple-900/40' : 'bg-purple-100'}`}></div>
                        </div>
                        <div className={`text-xs text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>40+ languages supported</div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}

export default function HeroSection() {
    const { isDark } = useTheme();
    const [activeIndex, setActiveIndex] = useState(0);

    const sectionRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startCycle = () => {
        if (intervalRef.current) return;
        intervalRef.current = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % aiFeatures.length);
        }, 2800);
    };

    const stopCycle = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    startCycle();
                } else {
                    stopCycle();
                }
            },
            { threshold: 0.3 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => {
            observer.disconnect();
            stopCycle();
        };
    }, []);

    return (
        <section className={`relative ${isDark ? 'bg-blue-950' : 'bg-white'}`} style={{ overflowX: 'clip' }}>
            <BackgroundAnimation />
            
            <div className="relative mx-auto max-w-5xl px-6 py-28 lg:py-24">
                <div className="relative z-10 mx-auto max-w-2xl text-center">
                    <h1
                        className={`text-balance text-4xl font-semibold md:text-5xl lg:text-6xl mb-6 ${isDark ? 'text-white' : 'text-gray-900'
                            }`}
                    >
                        Document Intelligence Reimagined
                    </h1>
                    <p
                        className={`mx-auto mb-8 max-w-2xl text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}
                    >
                        Upload, organize, and search your documents with advanced OCR and AI-powered insights. Cortex transforms how you manage information.
                    </p>
                    <Link
                        to="/register"
                        className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg duration-150"
                    >
                        Start Building
                    </Link>
                </div>
            </div>

            {/* Screen 1: Document Management */}
            <div className="mx-auto -mt-16 max-w-7xl mask-b-gradient">
                <div className="perspective-distant mask-r-gradient -mr-16 pl-16 lg:-mr-56 lg:pl-56">
                    <div className="rotate-x-20">
                        <div className={`lg:h-176 relative skew-x-[.36rad] rounded-2xl border overflow-hidden transition-all duration-500 hover:scale-[1.01] ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
                            }`}>
                            {/* Browser Header */}
                            <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                                }`}>
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${isDark ? 'bg-gray-900 text-gray-500' : 'bg-white text-gray-500'}`}>
                                        cortex.app/dashboard
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-24 h-1.5 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                </div>
                            </div>

                            {/* Dashboard Content */}
                            <div className={`p-8 h-full ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                                <div className="grid grid-cols-12 gap-6 h-full">
                                    {/* Sidebar */}
                                    <div className={`col-span-3 space-y-6 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} p-6 rounded-xl`}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                                <FileText className="w-4 h-4 text-white" />
                                            </div>
                                            <div className={`h-3 rounded w-20 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                        </div>
                                        <div className="space-y-4">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-md ${i === 1 ? 'bg-blue-600' : (isDark ? 'bg-gray-700' : 'bg-gray-200')}`}></div>
                                                    <div className={`h-2 rounded ${i === 1 ? 'bg-blue-600/50 w-24' : (isDark ? 'bg-gray-700' : 'bg-gray-200') + ' w-20'}`}></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Main Content */}
                                    <div className="col-span-9 space-y-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="space-y-1">
                                                <div className={`h-4 w-32 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                                <div className={`h-2 w-48 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
                                            </div>
                                            <div className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">Upload New</div>
                                        </div>

                                        {/* Document List */}
                                        <div className="space-y-4">
                                            {[1, 2, 3].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`p-4 rounded-xl border flex items-center gap-4 transition-all hover:translate-x-1 ${isDark ? 'bg-gray-800 border-gray-700 border-l-4 border-l-blue-600' : 'bg-gray-50 border-gray-200 border-l-4 border-l-blue-500'
                                                        }`}
                                                >
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-blue-600/20' : 'bg-blue-100'}`}>
                                                        <FileText className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        <div className={`h-2.5 rounded w-48 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                                        <div className={`h-1.5 rounded w-32 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                                    </div>
                                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                                                        }`}>
                                                        Processed
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Screen 2: AI Workspace */}
            <div ref={sectionRef} className={`py-24 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Interrogate Your Knowledge
                            </h2>
                            <p className={`text-lg mb-10 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Don't just store documents. Chat with them. Our AI extracts insights, summarizes complex files, and answers your most critical questions.
                            </p>
                            
                            <div className="relative space-y-3">
                                {aiFeatures.map((feature, index) => {
                                    const Icon = feature.icon;
                                    const isActive = activeIndex === index;
                                    return (
                                        <motion.div
                                            key={feature.title}
                                            className="flex items-start gap-4 py-3 px-4 rounded-xl cursor-pointer"
                                            animate={{
                                                backgroundColor: isActive
                                                    ? (isDark ? 'rgba(37,99,235,0.12)' : 'rgba(239,246,255,1)')
                                                    : 'transparent',
                                                opacity: isActive ? 1 : 0.45,
                                            }}
                                            transition={{ duration: 0.3 }}
                                            onClick={() => { stopCycle(); setActiveIndex(index); }}
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300",
                                                isActive ? "bg-blue-600 text-white" : (isDark ? "bg-gray-800 text-blue-400" : "bg-blue-100 text-blue-600")
                                            )}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className={cn(
                                                    "text-lg font-semibold transition-colors duration-300 block",
                                                    isActive ? (isDark ? "text-white" : "text-gray-900") : "text-gray-400"
                                                )}>
                                                    {feature.title}
                                                </span>
                                                {isActive && (
                                                    <motion.p
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                                                    >
                                                        {feature.description}
                                                    </motion.p>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Mobile dot indicators */}
                            <div className="flex gap-2 mt-6 lg:hidden">
                                {aiFeatures.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { stopCycle(); setActiveIndex(i); }}
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            activeIndex === i ? 'bg-blue-600 w-6' : (isDark ? 'bg-gray-600 w-2' : 'bg-gray-300 w-2')
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <motion.div 
                                className={`rounded-2xl border shadow-2xl overflow-hidden ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}
                                animate={{ y: activeIndex * -4 }}
                                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                            >
                                <div className={`px-4 py-3 border-b flex items-center justify-between ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-blue-600" />
                                        <span className="text-xs font-bold text-blue-600 uppercase tracking-tighter">AI Assistant</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {aiFeatures.map((_, i) => (
                                            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'bg-blue-600' : (isDark ? 'bg-gray-600' : 'bg-gray-300')}`} />
                                        ))}
                                    </div>
                                </div>
                                <div className="p-8 min-h-[320px] flex flex-col justify-center">
                                    <FeatureMockup activeIndex={activeIndex} isDark={isDark} />
                                </div>
                            </motion.div>

                            {/* Mobile Arrows */}
                            <div className="flex justify-between mt-4 lg:hidden">
                                <button 
                                    onClick={() => { stopCycle(); setActiveIndex(prev => Math.max(0, prev - 1)); }}
                                    disabled={activeIndex === 0}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                        activeIndex === 0
                                            ? (isDark ? 'text-gray-700' : 'text-gray-300')
                                            : 'text-blue-600 bg-blue-600/10'
                                    )}
                                >
                                    <ChevronLeft className="w-4 h-4" /> Prev
                                </button>
                                <button 
                                    onClick={() => { stopCycle(); setActiveIndex(prev => Math.min(aiFeatures.length - 1, prev + 1)); }}
                                    disabled={activeIndex === aiFeatures.length - 1}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                        activeIndex === aiFeatures.length - 1
                                            ? (isDark ? 'text-gray-700' : 'text-gray-300')
                                            : 'text-blue-600 bg-blue-600/10'
                                    )}
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-600/10 rounded-full blur-[100px] -z-10"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Screen 3: Insights & Analytics */}
            <div className="mx-auto mt-24 max-w-7xl px-6 pb-24">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1 relative">
                        <div className={`rounded-2xl border shadow-2xl overflow-hidden ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
                            <div className={`px-4 py-3 border-b flex items-center justify-between ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center gap-2">
                                    <LineChart className="w-4 h-4 text-green-600" />
                                    <span className="text-xs font-bold text-green-600 uppercase tracking-tighter">Analytics</span>
                                </div>
                            </div>
                            <div className="p-8 grid grid-cols-2 gap-6">
                                <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <Activity className="w-4 h-4 text-blue-600" />
                                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">+12%</span>
                                    </div>
                                    <div className={`h-6 w-16 mb-2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                    <div className={`h-1.5 w-full rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                                </div>
                                <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <PieChart className="w-4 h-4 text-purple-600" />
                                        <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">84%</span>
                                    </div>
                                    <div className={`h-6 w-16 mb-2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                    <div className={`h-1.5 w-full rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                                </div>
                                <div className={`col-span-2 p-6 rounded-xl border flex flex-col items-center ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                                    <div className="flex gap-2 w-full items-end h-24 mb-4">
                                        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                            <div key={i} className="flex-1 bg-blue-600 rounded-t-sm transition-all hover:bg-blue-400" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                    <div className={`h-2 w-1/2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                </div>
                            </div>
                        </div>
                         <div className="absolute -top-6 -left-6 w-32 h-32 bg-green-600/10 rounded-full blur-3xl -z-10"></div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Uncover Global Trends
                        </h2>
                        <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Track your entire document lifecycle. From processing speeds to storage distribution, get the visibility you need to optimize your workflows and team efficiency.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { title: 'Speed', icon: Activity, color: 'text-blue-500' },
                                { title: 'Accuracy', icon: Brain, color: 'text-purple-500' },
                            ].map((stat) => (
                                <div key={stat.title} className="space-y-2">
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.title}</h4>
                                    <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Real-time tracking of critical metrics.</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
