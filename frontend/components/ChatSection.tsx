'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Source {
  sourceUrl: string;
  documentId: string;
}

interface Message {
  role: 'user' | 'bot';
  text: string;
  sources?: Source[];
  isError?: boolean;
}

export const ChatSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hello! I am your document assistant. Ask me anything about your uploaded files.' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = { role: 'user', text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage.text }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'bot', text: data.answer, sources: data.sources },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'bot', text: 'Sorry, I encountered an issue processing your request.', isError: true },
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Error connecting to the server. Please check your connection.', isError: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col h-full bg-background relative border-r border-border/40 w-full overflow-hidden">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-xl p-4 border-b border-border/40 flex justify-between items-center shrink-0 h-16 sticky top-0 z-10">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2 tracking-tight">
            <div className="p-1.5 bg-primary rounded-lg text-primary-foreground">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            AI Assistant
          </h2>
        </div>
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1.5 pl-1.5 hover:bg-emerald-500/15 transition-colors">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Active
        </Badge>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

              {/* Avatar */}
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border shadow-sm ${msg.role === 'user'
                ? 'bg-primary border-primary text-primary-foreground'
                : 'bg-muted border-border text-foreground'
                }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-2">
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm break-words ${msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                    : msg.isError
                      ? 'bg-destructive/10 text-destructive border border-destructive/20 rounded-tl-none'
                      : 'bg-card border border-border text-card-foreground rounded-tl-none'
                    }`}
                >
                  {msg.isError && <AlertCircle className="w-4 h-4 inline-block mr-2 -mt-0.5" />}
                  {msg.text}
                </div>

                {/* Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 ml-1">
                    {msg.sources.map((source, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-md border border-border text-xs text-muted-foreground hover:bg-muted/80 transition-colors cursor-default" title={source.sourceUrl}>
                        <FileText className="w-3 h-3" />
                        <span className="max-w-[150px] truncate">{source.sourceUrl.split('/').pop()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-1 duration-300">
            <div className="flex gap-3 max-w-[85%]">
              <div className="shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border shadow-sm">
                <Bot className="w-4 h-4 text-foreground" />
              </div>
              <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background/80 backdrop-blur-md border-t border-border/40 shrink-0 sticky bottom-0 z-10">
        <div className="relative flex items-center shadow-sm rounded-xl bg-muted/50 border border-border focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
          <Input
            placeholder="Ask a question about your documents..."
            className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground h-12 pr-12 text-foreground"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-1.5 h-9 w-9 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-sm transition-all hover:scale-105 disabled:hover:scale-100 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-center text-muted-foreground mt-2 font-medium">
          AI can make mistakes. Please verify important information.
        </p>
      </div>
    </section>
  );
};
