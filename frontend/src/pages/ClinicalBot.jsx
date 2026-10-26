import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  ShieldCheck, 
  User, 
  Bot, 
  RotateCcw
} from 'lucide-react';
import { sendChatMessage } from '../services/api';

export default function ClinicalBot() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "### OpenHealth Local Clinical Intelligence\n\nHello! I am your **Virtual Clinical Assistant**, operating entirely on OpenHealth's verified local medical knowledge base.\n\nYou can consult me regarding **clinical lab benchmarks**, **disease warning signs**, **lifestyle interventions**, or **imaging explanations** across our 6 supported pathologies.\n\nHow may I assist your clinical inquiry today?"
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const query = inputQuery.trim();
    if (!query) return;

    // Add user message
    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await sendChatMessage(query);
      setMessages([...newMessages, { sender: 'bot', text: res.reply }]);
    } catch (err) {
      setMessages([...newMessages, { 
        sender: 'bot', 
        text: "Error communicating with local clinical engine: " + err.message 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (q) => {
    setInputQuery(q);
  };

  const formatBotText = (text) => {
    // Render markdown headings, bold, bullet points cleanly
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-base font-bold text-sky-300 mt-2 mb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={idx} className="font-bold text-white mt-1.5">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-300 text-xs leading-relaxed my-0.5">
            {line.replace(/^[•\-]\s*/, '')}
          </li>
        );
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-2 border-sky-500 pl-3 italic text-slate-400 text-[11px] my-2">
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      return <p key={idx} className="text-xs text-slate-300 leading-relaxed my-1">{line}</p>;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Offline Clinical Knowledge Base
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Medical AI Assistant
          </h1>
          <p className="text-sm text-slate-400">
            Instantaneous evidence-based answers with zero external cloud dependencies.
          </p>
        </div>

        <button
          onClick={() => setMessages([{
            sender: 'bot',
            text: "Chat history cleared. How may I assist your clinical inquiry today?"
          }])}
          className="btn-secondary text-xs w-fit"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Quick Question Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-slate-400">Suggested Inquiries:</span>
        {[
          "What are the diagnostic benchmarks for diabetes & HbA1c?",
          "How can I protect renal function & creatinine?",
          "What are the DASH diet rules for high blood pressure?",
          "What are the emergency signs of stroke (BE-FAST)?",
          "Explain how Brain MRI classifies Glioma vs Meningioma"
        ].map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickQuestion(q)}
            className="preset-chip text-[11px]"
          >
            {q.split('?')[0].replace('What are the ', '').replace('Explain how ', '')}?
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="glass-panel p-6 flex flex-col h-[520px]">
        {/* Messages Thread */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'bot' && (
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white rounded-br-none shadow-md shadow-sky-600/20'
                    : 'bg-slate-900/90 border border-white/10 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                {m.sender === 'user' ? (
                  <p className="text-sm font-medium">{m.text}</p>
                ) : (
                  <div>{formatBotText(m.text)}</div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300 flex-shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                <span>Consulting local clinical intelligence knowledge base...</span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Query Input Bar */}
        <form onSubmit={handleSend} className="mt-4 pt-3 border-t border-white/10 flex gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Type your healthcare, biomarker, or diagnostic inquiry here..."
            className="form-input text-sm"
          />
          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="btn-primary px-5 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send Query</span>
          </button>
        </form>
      </div>

      <div className="text-center text-[11px] text-slate-500">
        Local clinical Q&A database &bull; Zero external API / Gemini keys required &bull; Formatted for educational & triage research
      </div>
    </div>
  );
}

