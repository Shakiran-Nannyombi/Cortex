import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';
import { CheckCircle2, X, Zap, Shield, Globe } from 'lucide-react';
import Footer from '../components/Footer';

const plans = [
    {
        name: 'Starter',
        price: { monthly: 0, annual: 0 },
        description: 'Perfect for individuals and small experiments.',
        cta: 'Get Started Free',
        ctaTo: '/register',
        highlighted: false,
        features: [
            '50 document uploads / month',
            '100MB storage',
            'Basic OCR processing',
            'Full-text search',
            'AI summarization (10/month)',
            '1 workspace',
            'Community support',
        ],
        notIncluded: [
            'Cross-document querying',
            'Entity extraction',
            'API access',
            'Custom branding',
        ],
    },
    {
        name: 'Pro',
        price: { monthly: 29, annual: 23 },
        description: 'For growing teams that need serious intelligence.',
        cta: 'Start Free Trial',
        ctaTo: '/register',
        highlighted: true,
        features: [
            '1,000 document uploads / month',
            '10GB storage',
            'Advanced OCR + handwriting',
            'Full-text search',
            'Unlimited AI summarization',
            'Cross-document querying',
            'Automatic entity extraction',
            'Multi-language translation (20 languages)',
            '10 workspaces',
            'API access (10k calls/month)',
            'Priority email support',
        ],
        notIncluded: [
            'Custom data retention',
            'SAML SSO',
        ],
    },
    {
        name: 'Enterprise',
        price: { monthly: null, annual: null },
        description: 'Tailored for large organizations with custom needs.',
        cta: 'Contact Sales',
        ctaTo: '/about',
        highlighted: false,
        features: [
            'Unlimited document uploads',
            'Unlimited storage',
            'All Pro features',
            'Multi-language translation (40+ languages)',
            'Unlimited workspaces',
            'Unlimited API access',
            'Custom entity extraction models',
            'SAML SSO & SCIM provisioning',
            'Custom data retention policies',
            'Dedicated success manager',
            'SLA guarantees (99.9%)',
            'On-premise deployment option',
        ],
        notIncluded: [],
    },
];

const faqs = [
    {
        q: 'Can I switch plans at any time?',
        a: 'Absolutely. You can upgrade or downgrade your plan at any time. Upgrades take effect immediately, and downgrades apply at the end of your billing period.',
    },
    {
        q: 'What happens if I exceed my upload limit?',
        a: 'We\'ll notify you when you reach 80% of your limit. You can upgrade your plan or purchase additional credits at any time.',
    },
    {
        q: 'Is my data secure?',
        a: 'Yes. All documents are encrypted at rest with AES-256 and in transit with TLS 1.2+. We are SOC 2 Type II compliant and GDPR ready.',
    },
    {
        q: 'Do you offer a free trial for Pro?',
        a: 'Yes! Pro comes with a 14-day free trial. No credit card required to start.',
    },
    {
        q: 'Is there an annual discount?',
        a: 'Yes — you save roughly 20% when you pay annually compared to monthly billing.',
    },
];

export default function PricingPage() {
    const { isDark } = useTheme();

    return (
        <div className={isDark ? 'dark' : ''}>
            <div className={isDark ? 'bg-gray-950' : 'bg-white'}>
                {/* Hero */}
                <section className={`relative pt-28 pb-16 overflow-hidden ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />
                    <div className="relative max-w-4xl mx-auto px-6 text-center">
                        <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Simple, transparent pricing
                        </h1>
                        <p className={`text-xl mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Start free. Scale as you grow. No hidden fees, ever.
                        </p>
                    </div>
                </section>

                {/* Plans */}
                <section className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            {plans.map((plan) => (
                                <div
                                    key={plan.name}
                                    className={`rounded-2xl border p-8 relative transition-shadow ${
                                        plan.highlighted
                                            ? 'border-blue-500 shadow-2xl shadow-blue-500/20 ' + (isDark ? 'bg-gray-800' : 'bg-white')
                                            : (isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200')
                                    }`}
                                >
                                    {plan.highlighted && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-full tracking-wider uppercase">
                                            Most Popular
                                        </div>
                                    )}
                                    <div className="mb-6">
                                        <h2 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h2>
                                        <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{plan.description}</p>
                                        <div className="flex items-end gap-2">
                                            {plan.price.monthly === null ? (
                                                <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Custom</span>
                                            ) : plan.price.monthly === 0 ? (
                                                <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Free</span>
                                            ) : (
                                                <>
                                                    <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>${plan.price.monthly}</span>
                                                    <span className={`mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>/month</span>
                                                </>
                                            )}
                                        </div>
                                        {plan.price.annual !== null && plan.price.annual > 0 && (
                                            <p className="text-sm text-blue-500 mt-1">
                                                ${plan.price.annual}/mo billed annually
                                            </p>
                                        )}
                                    </div>

                                    <Link
                                        to={plan.ctaTo}
                                        className={`w-full block text-center py-3 rounded-xl font-semibold transition-colors mb-8 ${
                                            plan.highlighted
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : (isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200')
                                        }`}
                                    >
                                        {plan.cta}
                                    </Link>

                                    <div className="space-y-3">
                                        {plan.features.map((f) => (
                                            <div key={f} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{f}</span>
                                            </div>
                                        ))}
                                        {plan.notIncluded.map((f) => (
                                            <div key={f} className="flex items-start gap-3 opacity-40">
                                                <X className="w-5 h-5 shrink-0 mt-0.5" />
                                                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Trust Strip */}
                <section className={`py-16 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
                    <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                        {[
                            { icon: Shield, title: 'SOC 2 Compliant', sub: 'Enterprise-grade security and privacy.' },
                            { icon: Zap, title: '14-day Free Trial', sub: 'No credit card required to get started.' },
                            { icon: Globe, title: '99.9% Uptime SLA', sub: 'Guaranteed reliability for your team.' },
                        ].map((item) => (
                            <div key={item.title}>
                                <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center mx-auto mb-3">
                                    <item.icon className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.sub}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQ */}
                <section className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    <div className="max-w-3xl mx-auto px-6">
                        <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-6">
                            {faqs.map((faq) => (
                                <div key={faq.q} className={`p-6 rounded-2xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                    <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{faq.q}</h3>
                                    <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}
