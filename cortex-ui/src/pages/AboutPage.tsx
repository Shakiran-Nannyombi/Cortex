import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';
import { 
    FileText, Users, Target, Heart, 
    Mail
} from 'lucide-react';
import Footer from '../components/Footer';

const values = [
    {
        icon: Target,
        title: 'Clarity Over Complexity',
        description: 'We believe powerful tools should be simple to use. We obsess over reducing friction so your team can focus on what matters.',
    },
    {
        icon: Heart,
        title: 'Customer-First',
        description: 'Every feature we ship is driven by real user feedback. We build in the open, listen deeply, and iterate fast.',
    },
    {
        icon: FileText,
        title: 'Documents as Data',
        description: 'We see documents not as static files, but as rich, untapped sources of business intelligence. Our mission is to unlock them.',
    },
    {
        icon: Users,
        title: 'Built for Teams',
        description: 'Great document intelligence isn\'t a solo sport. Cortex is built from the ground up to empower collaboration at every scale.',
    },
];

const milestones = [
    { year: 'The Inspiration', event: 'Cortex was born out of Microsoft DevDays 2026 — a hackathon that challenged builders to create tools that make AI genuinely useful in everyday work.' },
    { year: 'The Problem', event: 'We noticed that teams waste hours hunting through PDFs, reports, and documents for answers that should be instant. We set out to fix that.' },
    { year: 'The Build', event: 'In the span of the hackathon, we designed and built Cortex from scratch — OCR processing, AI summarization, cross-document querying, and a clean dashboard.' },
    { year: 'The Vision', event: 'Cortex is a prototype today, but the vision is clear: a world where documents are as easy to query as a conversation.' },
];

export default function AboutPage() {
    const { isDark } = useTheme();

    return (
        <div className={isDark ? 'dark' : ''}>
            <div className={isDark ? 'bg-gray-950' : 'bg-white'}>
                {/* Hero */}
                <section className={`relative pt-28 pb-20 overflow-hidden ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
                    <div className="relative max-w-4xl mx-auto px-6 text-center">
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium mb-6 ${isDark ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : 'border-blue-500/30 bg-blue-500/10 text-blue-600'}`}>
                            🏆 Microsoft DevDays 2026 Hackathon Project
                        </div>
                        <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Built to make documents actionable
                        </h1>
                        <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Cortex is a hackathon project inspired by Microsoft DevDays 2026. We set out to solve one problem: finding answers inside documents should never require reading the whole thing.
                        </p>
                    </div>
                </section>


                {/* Values */}
                <section className={`py-24 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            What we stand for
                        </h2>
                        <p className={`text-center mb-14 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Our values guide every decision we make.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {values.map((v) => (
                                <div key={v.title} className={`p-8 rounded-2xl border flex gap-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center shrink-0">
                                        <v.icon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{v.title}</h3>
                                        <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{v.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Timeline */}
                <section className={`py-24 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    <div className="max-w-3xl mx-auto px-6">
                        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-14 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Our story
                        </h2>
                        <div className="relative border-l-2 border-blue-600/30 pl-10 space-y-12">
                            {milestones.map((m) => (
                                <div key={m.year} className="relative">
                                    <div className="absolute -left-[3.15rem] w-5 h-5 rounded-full bg-blue-600 border-4 border-blue-600/20 top-1" />
                                    <div className="text-blue-600 font-bold text-sm mb-1">{m.year}</div>
                                    <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{m.event}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className={`py-24 text-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    <div className="max-w-2xl mx-auto px-6">
                        <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                        <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Want to learn more?
                        </h2>
                        <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Cortex was built during Microsoft DevDays 2026. We'd love to hear your thoughts.
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <a href="mailto:hello@cortex.app" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg transition-colors">
                                Get in Touch
                            </a>
                            <Link to="/register" className={`px-8 py-3 rounded-lg font-medium text-lg border transition-colors ${isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                                Try Cortex Free
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}
