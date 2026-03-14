import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { FileText, Github, Twitter, Linkedin, Mail, ArrowUpRight } from 'lucide-react';

export default function Footer() {
    const { isDark } = useTheme();
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: 'Product',
            links: [
                { label: 'Features', href: '#features' },
                { label: 'Security', href: '#why' },
                { label: 'API Reference', href: '/api-keys' },
                { label: 'Enterprise', href: '/register' },
            ],
        },
        {
            title: 'Resources',
            links: [
                { label: 'Documentation', href: '#' },
                { label: 'Help Center', href: '#' },
                { label: 'Community', href: '#' },
                { label: 'Changelog', href: '#' },
            ],
        },
        {
            title: 'Legal',
            links: [
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
                { label: 'Cookie Policy', href: '#' },
                { label: 'GDPR', href: '#' },
            ],
        },
    ];

    return (
        <footer className={`relative border-t transition-colors duration-300 ${
            isDark ? 'bg-blue-950 border-gray-800' : 'bg-gray-50 border-gray-200'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-6 group">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center transition-transform group-hover:scale-110">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Cortex
                            </span>
                        </Link>
                        <p className={`text-base max-w-xs mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Document intelligence reimagined. Empowering teams to transform documents into actionable knowledge with AI.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Twitter, href: '#', label: 'Twitter' },
                                { icon: Github, href: '#', label: 'GitHub' },
                                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                                { icon: Mail, href: '#', label: 'Email' },
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    className={`p-2 rounded-lg transition-colors ${
                                        isDark 
                                        ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                                        : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'
                                    }`}
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Sections */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className={`text-sm font-bold uppercase tracking-wider mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {section.title}
                            </h3>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className={`text-sm flex items-center group transition-colors ${
                                                isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
                                            }`}
                                        >
                                            {link.label}
                                            <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 -translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 ${
                    isDark ? 'border-gray-800' : 'border-gray-200'
                }`}>
                    <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        &copy; {currentYear} Cortex. All rights reserved. Built with precision for intelligent teams.
                    </p>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                System Status: Operational
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Subtle background glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-blue-600/5 blur-[100px] pointer-events-none -z-10" />
        </footer>
    );
}
