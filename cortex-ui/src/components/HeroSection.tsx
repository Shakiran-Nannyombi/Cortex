import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

export default function HeroSection() {
    const { isDark } = useTheme();

    return (
        <section className={`overflow-hidden ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
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

            {/* Dashboard Preview */}
            <div className="mx-auto -mt-16 max-w-7xl [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]">
                <div className="[perspective:1200px] [mask-image:linear-gradient(to_right,black_50%,transparent_100%)] -mr-16 pl-16 lg:-mr-56 lg:pl-56">
                    <div className="[transform:rotateX(20deg);]">
                        <div className={`lg:h-176 relative skew-x-[.36rad] rounded-2xl border overflow-hidden ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
                            }`}>
                            {/* Browser Header */}
                            <div className={`px-6 py-4 border-b flex items-center gap-3 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                                }`}>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <span className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                    cortex.app/dashboard
                                </span>
                            </div>

                            {/* Dashboard Content */}
                            <div className={`p-8 h-full ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                                <div className="grid grid-cols-12 gap-6 h-full">
                                    {/* Sidebar */}
                                    <div className={`col-span-3 space-y-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-lg`}>
                                        <div className={`h-3 rounded w-20 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                        <div className="space-y-3">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`h-2 rounded ${i === 1 ? 'bg-blue-600 w-24' : (isDark ? 'bg-gray-700' : 'bg-gray-200') + ' w-20'
                                                        }`}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Main Content */}
                                    <div className="col-span-9 space-y-4">
                                        {/* Search Bar */}
                                        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                                            }`}>
                                            <div className={`w-4 h-4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                            <div className={`h-2 rounded flex-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                        </div>

                                        {/* Document List */}
                                        <div className="space-y-3">
                                            {[1, 2, 3].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`p-4 rounded-lg border flex items-center gap-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                                                        }`}
                                                >
                                                    <div className={`w-5 h-5 rounded ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}></div>
                                                    <div className="flex-1 space-y-2">
                                                        <div className={`h-2 rounded w-32 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                                        <div className={`h-1.5 rounded w-24 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                                    </div>
                                                    <div className={`px-2 py-1 rounded text-xs font-medium ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                                                        }`}>
                                                        Ready
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Upload Zone */}
                                        <div className={`border-2 border-dashed rounded-lg p-6 text-center ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-300 bg-gray-50'
                                            }`}>
                                            <div className={`h-6 w-6 mx-auto mb-2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                            <div className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                                Drop files to upload
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
