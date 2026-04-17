'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Database, Menu, X, MessageSquare, Clock, Table as TableIcon, Code, FileText, Type, Plus, Paperclip, Image as ImageIcon, Printer, Copy } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useFirebase } from '../../lib/firebase-context';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  queriedDatabase?: boolean;
  attachments?: string[];
}

interface AIModel {
  id: string;
  name: string;
}

type ResponseFormat = 'natural' | 'table' | 'json' | 'md';

// Helper component for printable table
const TableWrapper = ({ children }: { children: React.ReactNode }) => {
  const tableRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!tableRef.current) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const tableHtml = tableRef.current.innerHTML;
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('');
        } catch (e) {
          return '';
        }
      })
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Table - UMKM Perikanan</title>
          <style>
            ${styles}
            body { padding: 20px; font-family: sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
            th { background-color: #f8fafc; font-weight: bold; }
            img { max-width: 100px; height: auto; border-radius: 4px; }
            .no-print { display: none; }
          </style>
        </head>
        <body>
          <h2 style="margin-bottom: 20px; color: #1e40af;">Data Table Export</h2>
          ${tableHtml}
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="relative group my-4">
      <div className="absolute right-2 -top-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm text-[10px] font-bold text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all"
        >
          <Printer className="w-3 h-3" />
          PRINT TABLE
        </button>
      </div>
      <div ref={tableRef} className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          {children}
        </table>
      </div>
    </div>
  );
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [responseFormat, setResponseFormat] = useState<ResponseFormat>('natural');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages: rtdbMessages, isConfigured: isFirebaseConfigured, path: rtdbPath, setPath: setRtdbPath } = useFirebase();

  const suggestedQueries = [
    "List all tables",
    "Show data from users table",
    "Apa pesan terbaru di RTDB?",
    "Ada berapa data di path RTDB saat ini?",
    "Tampilkan data dari fish_products"
  ];

  const formatOptions: { id: ResponseFormat, label: string, icon: any }[] = [
    { id: 'natural', label: 'Natural', icon: Type },
    { id: 'table', label: 'Table', icon: TableIcon },
    { id: 'json', label: 'JSON', icon: Code },
    { id: 'md', label: 'MD', icon: FileText },
  ];

  useEffect(() => {
    fetchModels();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const fetchModels = async () => {
    try {
      const res = await fetch('/api/chat');
      const data = await res.json();
      if (data.success) {
        setModels(data.models);
        setSelectedModel(data.models[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch models');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async (e?: React.FormEvent, text?: string) => {
    e?.preventDefault();
    const content = text || input;
    if (!content.trim() || isLoading) return;

    const userMsg: Message = { 
      role: 'user', 
      content,
      attachments: attachments.map(f => f.name)
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          model: selectedModel,
          responseFormat: responseFormat,
          currentRtdbPath: rtdbPath,
          currentRtdbData: rtdbMessages,
          conversationHistory: messages.map(({ role, content }) => ({ role, content }))
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.reply,
          queriedDatabase: data.queriedDatabase
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'system',
          content: `Error: ${data.error}`
        }]);
      }
    } catch (error: any) {
      setMessages(prev => [...prev, {
        role: 'system',
        content: `Network Error: ${error.message}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-gray-900">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-gray-800">
              <Database className="w-5 h-5 text-blue-600" />
              <span>RTDB Data</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-gray-100 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 py-3 border-b bg-gray-50/50">
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Database Path
                </label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={rtdbPath}
                    onChange={(e) => setRtdbPath(e.target.value)}
                    placeholder="e.g. messages, sensors/data"
                    className="w-full text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                  <Database className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5">
                {['messages', 'iot_sensors', 'sensor_readings', 'logs'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setRtdbPath(p)}
                    className={cn(
                      "text-[10px] px-2 py-1 rounded-md border transition-all",
                      rtdbPath === p 
                        ? "bg-blue-50 border-blue-200 text-blue-600 font-medium" 
                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!isFirebaseConfigured ? (
              <div className="text-center py-10 px-4">
                <div className="bg-yellow-50 text-yellow-600 p-3 rounded-lg text-xs font-medium border border-yellow-100 mb-2">
                  Firebase Not Configured
                </div>
                <p className="text-xs text-gray-500">Add credentials to .env.local to see RTDB messages.</p>
              </div>
            ) : rtdbMessages.length === 0 ? (
              <div className="text-center py-10 px-4">
                <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No RTDB messages found.</p>
              </div>
            ) : (
              rtdbMessages.map((msg) => (
                <div key={msg.id} className="bg-white border rounded-xl p-3 shadow-sm hover:border-blue-200 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-blue-600 truncate max-w-[100px]">
                      {msg.user || msg.sender || 'System'}
                    </span>
                    <div className="flex items-center gap-1 text-[9px] text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : 'Recent'}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 break-words leading-relaxed">
                    {msg.text || msg.message || (typeof msg.value === 'string' ? msg.value : JSON.stringify(msg.value || msg))}
                  </p>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t bg-gray-50">
            <div className="text-xs text-gray-600">
              {rtdbMessages.length} Items found
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="p-4 bg-white border-b flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <div className="bg-blue-600 p-2 rounded-lg shadow-blue-200 shadow-lg">
              <Bot className="text-white w-5 h-5" />
            </div>
            <h1 className="font-bold text-lg hidden sm:block tracking-tight">{process.env.NEXT_PUBLIC_APP_NAME || 'AI Assistant'}</h1>
          </div>

          <div className="flex items-center gap-4">
            <select 
              className="text-sm bg-gray-100 border-none rounded-md px-3 py-2 outline-none cursor-pointer hover:bg-gray-200 transition-colors font-medium text-gray-700"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {models.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="bg-blue-100 p-6 rounded-full shadow-inner">
                <Database className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Database AI Assistant</h2>
              <p className="text-gray-500 max-w-sm">Ask me anything about your UMKM Perikanan data or Realtime Database.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg pt-6">
                {suggestedQueries.map(q => (
                  <button key={q} onClick={() => sendMessage(undefined, q)} className="text-left text-sm p-4 bg-white border border-gray-200 rounded-2xl hover:bg-blue-50 hover:border-blue-200 hover:shadow-md transition-all">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={cn("flex w-full gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-sm", msg.role === 'user' ? "bg-blue-600 text-white" : msg.role === 'assistant' ? "bg-gray-800 text-white" : "bg-red-500 text-white")}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={cn(
                "max-w-[85%] p-5 rounded-2xl shadow-sm border border-transparent transition-all",
                msg.role === 'user' 
                  ? "bg-blue-600 text-white rounded-tr-none shadow-blue-100" 
                  : "bg-white text-gray-800 border-gray-100 rounded-tl-none"
              )}>
                {msg.queriedDatabase && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-500 mb-3 bg-blue-50 w-fit px-2 py-0.5 rounded-full border border-blue-100">
                    <Database className="w-3 h-3" />
                    DATABASE QUERIED
                  </div>
                )}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {msg.attachments.map((at, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 bg-black/5 rounded-lg text-[10px] font-bold text-gray-500 border border-black/5">
                        <Paperclip className="w-3.5 h-3.5" />
                        {at}
                      </div>
                    ))}
                  </div>
                )}
                <div className={cn(
                  "prose prose-sm max-w-full prose-p:leading-relaxed prose-headings:font-bold prose-headings:tracking-tight",
                  msg.role === 'user' ? "prose-invert" : ""
                )}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <div className="rounded-xl overflow-hidden my-4 border border-gray-800 shadow-xl group/code relative">
                            <div className="absolute right-3 top-3 opacity-0 group-hover/code:opacity-100 transition-opacity">
                              <button 
                                onClick={() => navigator.clipboard.writeText(String(children))}
                                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-all"
                                title="Copy code"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <SyntaxHighlighter
                              {...props}
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              customStyle={{
                                margin: 0,
                                padding: '1.25rem',
                                borderRadius: '0.75rem',
                                fontSize: '0.85rem',
                                backgroundColor: '#1e1e1e',
                              }}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <code 
                            {...props} 
                            className={cn(
                              "px-1.5 py-0.5 rounded-md font-mono text-[0.9em]",
                              msg.role === 'user' ? "bg-blue-700 text-blue-50" : "bg-gray-100 text-blue-600"
                            )}
                          >
                            {children}
                          </code>
                        );
                      },
                      table({ children }) {
                        return <TableWrapper>{children}</TableWrapper>;
                      },
                      thead({ children }) {
                        return <thead className="bg-gray-50 text-gray-700 uppercase text-[10px] font-bold tracking-widest">{children}</thead>;
                      },
                      th({ children }) {
                        return <th className="px-4 py-3 text-left border-b border-gray-200">{children}</th>;
                      },
                      td({ node, children, ...props }: any) {
                        const content = String(children);
                        const isImageUrl = /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(content) || content.startsWith('data:image/');
                        
                        if (isImageUrl) {
                          return (
                            <td {...props} className="px-4 py-3 border-b border-gray-100 align-middle">
                              <div className="flex justify-center">
                                <img 
                                  src={content} 
                                  alt="Cell content" 
                                  className="max-w-[80px] h-auto rounded-lg shadow-sm hover:scale-[2.5] transition-transform duration-200 cursor-zoom-in border border-gray-100 bg-white"
                                />
                              </div>
                            </td>
                          );
                        }
                        return <td {...props} className="px-4 py-3 border-b border-gray-100 align-middle text-gray-600">{children}</td>;
                      },
                      tr({ children }) {
                        return <tr className="hover:bg-blue-50/30 transition-colors duration-150">{children}</tr>;
                      }
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-gray-200 flex items-center justify-center">
                <Bot className="w-5 h-5 text-gray-400" />
              </div>
              <div className="bg-white border border-gray-100 p-5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm font-medium text-gray-500 tracking-tight">AI is generating {responseFormat} response...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Unified Input Footer */}
        <footer className="p-4 md:p-6 bg-white border-t">
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 animate-in zoom-in duration-200">
                {attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl pl-3 pr-1 py-1.5 text-xs font-medium">
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <button onClick={() => removeAttachment(idx)} className="p-1 hover:bg-blue-100 rounded-full text-blue-400 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-gray-50 rounded-3xl p-2.5 shadow-sm border border-gray-200 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500/50 transition-all duration-300">
              <form onSubmit={sendMessage} className="flex flex-col">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your database query..."
                  className="w-full bg-transparent border-none resize-none px-4 py-3 focus:ring-0 outline-none text-[15px] min-h-[50px] max-h-48 text-gray-700 placeholder:text-gray-400"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                
                <div className="flex items-center justify-between mt-2 px-2 pb-1">
                  <div className="flex items-center gap-1.5">
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2.5 text-gray-500 hover:bg-white hover:text-blue-600 rounded-2xl transition-all shadow-none hover:shadow-sm border border-transparent hover:border-gray-100"
                      title="Attach file"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    <input 
                      type="file" 
                      multiple 
                      ref={fileInputRef} 
                      onChange={handleFileAttach} 
                      className="hidden" 
                    />
                    
                    <div className="h-5 w-px bg-gray-300 mx-1" />
                    
                    {/* Integrated Format Selector */}
                    <div className="flex items-center gap-1">
                      {formatOptions.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setResponseFormat(opt.id)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200",
                            responseFormat === opt.id 
                              ? "bg-white text-blue-600 shadow-md border-gray-100 ring-1 ring-black/5" 
                              : "text-gray-400 hover:text-gray-600 hover:bg-white/50 border border-transparent"
                          )}
                        >
                          <opt.icon className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={(!input.trim() && attachments.length === 0) || isLoading} 
                    className="p-2.5 bg-blue-600 text-white rounded-2xl disabled:opacity-30 disabled:grayscale transition-all hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>
              </form>
            </div>
            <p className="text-[10px] text-center text-gray-400 font-medium uppercase tracking-tight">
              Selected: <span className="text-blue-500 font-bold">{responseFormat} Mode</span> • AI-Powered Insights
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
