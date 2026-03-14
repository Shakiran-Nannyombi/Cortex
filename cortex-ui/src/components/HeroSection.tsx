import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, FileText, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'Solution', href: '#solution' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
];

export default function HeroSection() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isDark, toggleTheme } = useTheme();

    return (
        <div>
            {/* Navigation */}
            <header>
                <nav
                    data-state={menuOpen ? 'active' : ''}
                    className={`group sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-all ${isDark
                        ? 'bg-blue-950/80 border-blue-900/50 shadow-2xl shadow-black/50'
                        : 'bg-blue-600/80 border-blue-500/50 shadow-lg shadow-blue-900/20'
                        }`}
                >
                    <div className="px-6">
                        <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                            {/* Logo */}
                            <div className="flex w-full justify-between lg:w-auto">
                                <Link to="/" aria-label="home" className="flex items-center space-x-2">
                                    <FileText className="w-6 h-6 text-white" />
                                    <span className="text-xl font-bold text-white">
                                        Cortex
                                    </span>
                                </Link>

                                {/* Mobile Menu Button */}
                                <div className="flex items-center gap-2 lg:hidden">
                                    <button
                                        onClick={toggleTheme}
                                        className={`p-2 rounded-lg transition-colors backdrop-blur-sm ${isDark ? 'bg-gray-900/50 text-yellow-400 hover:bg-gray-800/50' : 'bg-white/50 text-gray-700 hover:bg-gray-100/50'
                                            }`}
                                    >
                                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                    </button>
                                    <button
                                        onClick={() => setMenuOpen(!menuOpen)}
                                        aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
                                        className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5"
                                    >
                                        <Menu
                                            className={`group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200 ${isDark ? 'text-gray-300' : 'text-gray-900'
                                                }`}
                                        />
                                        <X
                                            className={`group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200 ${isDark ? 'text-gray-300' : 'text-gray-900'
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div
                                className={`group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 backdrop-blur-sm md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none ${isDark
                                    ? 'bg-gray-900/50 border-gray-800/50 dark:shadow-none dark:lg:bg-transparent'
                                    : 'bg-white/50 border-gray-200/50'
                                    }`}
                            >
                                <div className="lg:pr-4">
                                    <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                                        {menuItems.map((item, index) => (
                                            <li key={index}>
                                                <a
                                                    href={item.href}
                                                    className="block duration-150 text-blue-50 hover:text-white"
                                                >
                                                    {item.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Auth Buttons */}
                                <div className={`flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6 ${isDark ? 'lg:border-gray-800/50' : 'lg:border-gray-200/50'}`}>
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 rounded-lg text-sm font-medium duration-150 text-center border backdrop-blur-sm border-white/20 text-white hover:bg-white/10"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium duration-150"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            </div>

                            {/* Desktop Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className={`hidden lg:block p-2 rounded-lg transition-colors backdrop-blur-sm ${isDark ? 'bg-gray-900/50 text-yellow-400 hover:bg-gray-800/50' : 'bg-white/50 text-gray-700 hover:bg-gray-100/50'
                                    }`}
                            >
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            <main>
                {/* Glow effects removed as requested */}

                {/* Hero Section */}
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
                                <div className={`lg:h-[44rem] relative skew-x-[.36rad] rounded-2xl border overflow-hidden ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
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

                {/* Partners Section */}
                <section className={`relative z-10 py-16 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                    <div className="m-auto max-w-5xl px-6">
                        <h2 className={`text-center text-lg font-medium mb-12 ${isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            Trusted by teams worldwide for intelligent document management
                        </h2>
                        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-12">
                            {['Acme', 'Quantum', 'Echo', 'Apex', 'Pulse', 'Nexus'].map((company) => (
                                <div
                                    key={company}
                                    className={`h-8 px-4 rounded-lg flex items-center font-medium text-sm ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    {company}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
