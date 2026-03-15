import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import toast from 'react-hot-toast';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { isDark } = useTheme();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const token = localStorage.getItem('access_token');
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const apiUrl = import.meta.env.VITE_API_URL || 'https://cortex-nboq.onrender.com';

            let data;
            try {
                const response = await fetch(`${apiUrl}/api/chat/message`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ message: input }),
                });

                if (!response.ok) throw new Error('API error');
                data = await response.json();
            } catch {
                // Smart fallback responses when backend is unavailable
                const q = input.toLowerCase();
                let reply = '';

                if (q.includes('what') && (q.includes('cortex') || q.includes('app') || q.includes('this'))) {
                    reply = 'Cortex is an AI-powered document management platform. You can upload documents (PDF, Word, images), extract text with OCR, search across all your files, and chat with your documents using AI.';
                } else if (q.includes('how') && q.includes('use')) {
                    reply = 'To use Cortex: 1) Create an account or try the demo. 2) Create a workspace. 3) Upload documents. 4) Use search to find content. 5) Chat with the AI to get insights from your documents.';
                } else if (q.includes('feature') || q.includes('can it') || q.includes('what can')) {
                    reply = 'Cortex features: OCR text extraction, full-text search, AI chat, document organization with workspaces and folders, tags, analytics, and API access.';
                } else if (q.includes('demo') || q.includes('try')) {
                    reply = 'You can try the demo by clicking "View Demo" on the home page. It logs you in automatically with sample documents and workspaces pre-loaded.';
                } else if (q.includes('price') || q.includes('cost') || q.includes('free')) {
                    reply = 'Cortex is currently free to use. Create an account to get started with full access to all features.';
                } else if (q.includes('ocr') || q.includes('extract') || q.includes('scan')) {
                    reply = 'Cortex uses OCR (Optical Character Recognition) to extract text from PDFs, images, and scanned documents, making them fully searchable.';
                } else if (q.includes('search')) {
                    reply = 'Cortex has full-text search across all your documents. Just type keywords in the search bar to find content across all your files instantly.';
                } else if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
                    reply = 'Hi! I\'m the Cortex assistant. Ask me anything about the app - features, how to use it, or what it can do for you.';
                } else {
                    reply = 'I can help you with questions about Cortex features, how to upload documents, search, OCR, or the demo account. What would you like to know?';
                }

                data = { message: reply };
            }
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.message,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            toast.error('Failed to send message');
            setMessages((prev) => prev.slice(0, -1));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Chatbot Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-300 z-40 ${isDark
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                title="Open Chatbot"
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <MessageCircle className="w-6 h-6" />
                )}
            </button>

            {/* Chatbot Window */}
            {isOpen && (
                <div
                    className={`fixed bottom-24 right-2 left-2 sm:left-auto sm:right-6 sm:w-96 max-h-[70vh] rounded-xl shadow-2xl flex flex-col z-40 transition-all duration-300 ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
                        }`}
                >
                    {/* Header */}
                    <div
                        className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-blue-600" />
                            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Cortex Assistant
                            </h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className={`p-1 rounded hover:bg-gray-200 ${isDark ? 'hover:bg-gray-700' : ''}`}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        className={`flex-1 overflow-y-auto p-4 space-y-3 ${isDark ? 'bg-gray-900' : 'bg-white'
                            }`}
                    >
                        {messages.length === 0 && (
                            <div className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                <p>Hi! I'm your Cortex assistant.</p>
                                <p>Ask me anything about your documents or the app.</p>
                            </div>
                        )}
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : isDark
                                            ? 'bg-gray-800 text-gray-100 rounded-bl-none'
                                            : 'bg-gray-100 text-gray-900 rounded-bl-none'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div
                                    className={`px-3 py-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'
                                        }`}
                                >
                                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={sendMessage}
                        className={`p-3 border-t flex gap-2 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                            }`}
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            disabled={loading}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm outline-none ${isDark
                                ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500'
                                : 'bg-white text-gray-900 placeholder-gray-400 border border-gray-200 focus:ring-2 focus:ring-blue-500'
                                }`}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
