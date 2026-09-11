'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, PersonaType, LanguageCode, TelemetryData } from '@/types';
import {
  Send,
  Sparkles,
  Bot,
  User,
  MapPin,
  RefreshCw,
  Sprout,
  Anchor,
  Building2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface ChatConsoleProps {
  messages: ChatMessage[];
  onSendMessage: (query: string) => Promise<void>;
  loading: boolean;
  activePersona: PersonaType;
  activeLanguage: LanguageCode;
  telemetry: TelemetryData | null;
}

export const ChatConsole: React.FC<ChatConsoleProps> = ({
  messages,
  onSendMessage,
  loading,
  activePersona,
  activeLanguage,
  telemetry,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { text: 'Jammu weather', label: 'Jammu Weather', icon: '📍' },
    { text: 'Kharif crop spraying in Punjab', label: 'Punjab Agro Spray', icon: '🌾' },
    { text: 'Paradip port sea conditions', label: 'Paradip Port Swells', icon: '⚓' },
    { text: 'Mumbai underpass waterlogging', label: 'Mumbai Flooding', icon: '🏙️' },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput('');
    onSendMessage(q);
  };

  const getPersonaBadge = (p?: PersonaType) => {
    switch (p) {
      case 'kisan':
        return { label: 'Kisan Agro-Met', icon: Sprout, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' };
      case 'maritime':
        return { label: 'Maritime Port Warning', icon: Anchor, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800' };
      case 'urban':
        return { label: 'Urban Civil Resilience', icon: Building2, color: 'text-indigo-400 bg-indigo-950/60 border-indigo-800' };
      default:
        return { label: 'Meteorological Agent', icon: Bot, color: 'text-blue-400 bg-blue-950/60 border-blue-800' };
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#090d16] relative">
      {/* Top Banner / Quick Prompts */}
      <div className="px-4 py-2.5 bg-[#0d1322]/80 border-b border-slate-800/80 backdrop-blur-md flex items-center gap-2 overflow-x-auto select-none shrink-0">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 whitespace-nowrap flex items-center gap-1">
          <Sparkles size={12} className="text-cyan-400" /> Tactical Inquiries:
        </span>
        <div className="flex items-center gap-1.5">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(qp.text)}
              disabled={loading}
              className="text-xs whitespace-nowrap bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 px-2.5 py-1 rounded-full flex items-center gap-1 transition-all disabled:opacity-50 active:scale-95"
            >
              <span>{qp.icon}</span>
              <span>{qp.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 max-w-md mx-auto text-slate-400">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3 shadow-inner">
              <Bot size={28} />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">MausamSetu Tactical Autonomous Agent</h3>
            <p className="text-xs leading-relaxed text-slate-400 mb-4">
              Autonomous natural language entity extraction, OpenStreetMap Nominatim spatial resolution, and Open-Meteo high-resolution atmospheric telemetry.
            </p>
            <div className="text-[11px] text-cyan-400 font-mono bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 w-full text-left">
              Try query: <button onClick={() => onSendMessage('Jammu weather')} className="underline text-cyan-300 font-bold hover:text-white">"Jammu weather"</button> to pin coordinates (32.7266, 74.8570) and load live telemetry cards.
            </div>
          </div>
        ) : (
          messages.map((m) => {
            const isAgent = m.sender === 'agent';
            const personaInfo = getPersonaBadge(m.persona);
            const PersonaIcon = personaInfo.icon;

            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isAgent ? 'justify-start' : 'justify-end'}`}
              >
                {isAgent && (
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Bot size={18} />
                  </div>
                )}

                <div className={`max-w-[85%] md:max-w-[75%] space-y-2`}>
                  {/* Sender & Persona Pill */}
                  <div className={`flex items-center gap-2 text-[10px] font-mono text-slate-400 ${isAgent ? 'justify-start' : 'justify-end'}`}>
                    {isAgent ? (
                      <span className={`px-2 py-0.5 rounded-full border text-[9px] font-semibold flex items-center gap-1 ${personaInfo.color}`}>
                        <PersonaIcon size={10} />
                        {personaInfo.label}
                      </span>
                    ) : (
                      <span className="text-slate-400">Field Officer</span>
                    )}
                    <span>{m.timestamp}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line shadow-md border ${
                      isAgent
                        ? 'bg-[#0d1322] border-slate-800 text-slate-100'
                        : 'bg-cyan-600 border-cyan-500 text-white'
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Telemetry Snapshot Chip if available */}
                  {isAgent && m.telemetry && (
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-[11px] font-mono text-slate-300">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin size={13} className="text-cyan-400 shrink-0" />
                        <span className="truncate font-semibold">{m.telemetry.location}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 text-slate-400">
                        <span className="text-amber-300 font-bold">{m.telemetry.temp.toFixed(1)}°C</span>
                        <span className="text-cyan-300">{m.telemetry.wind.toFixed(1)} km/h</span>
                        <span className="text-blue-300">{m.telemetry.precip.toFixed(1)} mm</span>
                      </div>
                    </div>
                  )}
                </div>

                {!isAgent && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User size={18} />
                  </div>
                )}
              </div>
            );
          })
        )}

        {loading && (
          <div className="flex gap-3 justify-start items-center text-slate-400 text-xs font-mono">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <RefreshCw size={16} className="animate-spin" />
            </div>
            <div className="bg-[#0d1322] border border-slate-800 rounded-2xl px-4 py-2.5 text-slate-300 flex items-center gap-2">
              <span>Resolving geocoding & fetching Open-Meteo telemetry...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-[#0d1322] border-t border-slate-800 flex items-center gap-2 select-none shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for panchayat advisory or type 'Jammu weather'..."
          disabled={loading}
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 text-slate-100 text-xs rounded-xl px-4 py-3 focus:outline-none placeholder-slate-400 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 px-4 py-3 rounded-xl font-semibold flex items-center justify-center transition-all active:scale-95 shadow-sm shadow-cyan-500/30"
          aria-label="Send Meteorological Query"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
