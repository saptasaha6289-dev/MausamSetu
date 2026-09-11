'use client';

import React from 'react';
import { TelemetryData, PersonaType, LanguageCode } from '@/types';
import {
  Sprout,
  Anchor,
  Building2,
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  AlertTriangle,
  Radio,
  MapPin,
  ChevronDown,
  X,
  Compass,
} from 'lucide-react';

interface SidebarProps {
  telemetry: TelemetryData | null;
  persona: PersonaType;
  setPersona: (p: PersonaType) => void;
  language: LanguageCode;
  setLanguage: (l: LanguageCode) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onOpenSosModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  telemetry,
  persona,
  setPersona,
  language,
  setLanguage,
  mobileOpen,
  setMobileOpen,
  onOpenSosModal,
}) => {
  const personas: { id: PersonaType; label: string; sub: string; icon: any }[] = [
    { id: 'kisan', label: 'Kisan', sub: 'Agro-Met Advisory', icon: Sprout },
    { id: 'maritime', label: 'Maritime', sub: 'Port & Sea Warning', icon: Anchor },
    { id: 'urban', label: 'Urban', sub: 'Civil Inundation', icon: Building2 },
  ];

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  ];

  const content = (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4 text-slate-200">
      {/* Mobile Close Button */}
      <div className="lg:hidden flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Compass className="text-cyan-400" size={18} />
          <span className="font-bold text-sm text-white">Observatory Deck</span>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      {/* Persona Switcher */}
      <div>
        <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2 block">
          Mission Persona Mode
        </label>
        <div className="grid grid-cols-3 gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {personas.map((p) => {
            const Icon = p.icon;
            const active = persona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPersona(p.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                  active
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon size={16} className={active ? 'text-cyan-400' : 'text-slate-400'} />
                <span className="text-xs font-semibold mt-1">{p.label}</span>
                <span className="text-[9px] text-slate-400 hidden sm:block truncate">{p.sub.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Language Selector */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Advisory Language
          </label>
          <span className="text-[10px] text-cyan-400 font-mono">Bilingual MoES</span>
        </div>
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="w-full appearance-none bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-medium focus:outline-none focus:border-cyan-500 transition-colors pr-8 cursor-pointer"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code} className="bg-slate-900 text-slate-200">
                {l.native} ({l.label})
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Live Observatory Telemetry Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Active Observatory Station
          </span>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE HIGH-RES
          </span>
        </div>

        {/* Station Location Header */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-sm">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-cyan-400 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-bold text-white truncate">
                {telemetry?.location || 'Awaiting Target...'}
              </h3>
              <p className="text-[10px] font-mono text-slate-400">
                {telemetry ? `${telemetry.latitude.toFixed(4)}° N, ${telemetry.longitude.toFixed(4)}° E` : '--'}
              </p>
            </div>
          </div>
        </div>

        {/* 2x2 Telemetry Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Temperature */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Surface Temp</span>
              <Thermometer size={14} className="text-amber-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-white">
                {telemetry ? telemetry.temp.toFixed(1) : '--'}
              </span>
              <span className="text-xs text-slate-400 font-semibold">°C</span>
            </div>
            <div className="text-[9px] text-slate-400 mt-1 flex justify-between">
              <span>High: {telemetry?.forecast_7d?.[0] ? `${telemetry.forecast_7d[0].max_temp.toFixed(0)}°` : '--'}</span>
              <span>Low: {telemetry?.forecast_7d?.[0] ? `${telemetry.forecast_7d[0].min_temp.toFixed(0)}°` : '--'}</span>
            </div>
          </div>

          {/* Humidity */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Relative RH</span>
              <Droplets size={14} className="text-blue-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-white">
                {telemetry ? telemetry.humidity.toFixed(0) : '--'}
              </span>
              <span className="text-xs text-slate-400 font-semibold">%</span>
            </div>
            <div className="text-[9px] text-slate-400 mt-1 truncate">
              Vapor Deficit: {telemetry ? (telemetry.humidity > 70 ? 'Saturated' : 'Optimal') : '--'}
            </div>
          </div>

          {/* Wind */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Wind Velocity</span>
              <Wind size={14} className="text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-white">
                {telemetry ? telemetry.wind.toFixed(1) : '--'}
              </span>
              <span className="text-xs text-slate-400 font-semibold">km/h</span>
            </div>
            <div className="text-[9px] text-cyan-400/90 mt-1 truncate font-mono">
              {telemetry ? `Beaufort Scale ${Math.min(12, Math.round(telemetry.wind / 3.0))}` : 'NWP Live'}
            </div>
          </div>

          {/* Precipitation */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Precipitation</span>
              <CloudRain size={14} className="text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-white">
                {telemetry ? telemetry.precip.toFixed(1) : '--'}
              </span>
              <span className="text-xs text-slate-400 font-semibold">mm</span>
            </div>
            <div className="text-[9px] text-emerald-400 mt-1 font-semibold truncate">
              {telemetry ? (telemetry.precip > 0 ? 'Active Shower' : 'No Rain Falling') : '--'}
            </div>
          </div>
        </div>
      </div>

      {/* Panchayat SOS Trigger Button */}
      <div className="pt-2 mt-auto">
        <button
          onClick={onOpenSosModal}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-red-900/40 border border-red-500/40 transition-all active:scale-[0.98]"
        >
          <Radio size={16} className="animate-pulse" />
          <span>BROADCAST PANCHAYAT SOS</span>
        </button>
        <p className="text-[9px] text-center text-slate-400 mt-1.5 font-mono">
          Multi-channel SDRF / NDRF Dispatch Simulation
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-80 bg-[#0d1322] border-r border-slate-800 h-full shrink-0 select-none z-20">
        {content}
      </aside>

      {/* Mobile Slide-Over Panel */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer Content */}
          <div className="relative w-80 max-w-[85vw] bg-[#0d1322] border-r border-slate-800 h-full z-10 shadow-2xl flex flex-col">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
