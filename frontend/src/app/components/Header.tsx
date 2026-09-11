'use client';

import React from 'react';
import { ViewMode } from '@/types';
import {
  Waves,
  Shield,
  Sliders,
  Menu,
  X,
  Radio,
  Map,
  MessageSquare,
  Columns,
} from 'lucide-react';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  drawerOpen,
  setDrawerOpen,
  mobileSidebarOpen,
  setMobileSidebarOpen,
  riskLevel,
}) => {
  const getRiskBadgeColor = () => {
    switch (riskLevel) {
      case 'SEVERE':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'MODERATE':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <header className="h-14 bg-[#0d1322] border-b border-slate-800 px-3 md:px-5 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Left: Branding */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger toggle */}
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="lg:hidden p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Toggle Live Telemetry Sidebar"
          aria-label="Toggle Live Telemetry Sidebar"
        >
          {mobileSidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/20">
            <Waves size={19} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-white text-base md:text-lg">
                MausamSetu
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-semibold tracking-wider">
                MoES
              </span>
            </div>
            <p className="hidden sm:block text-[10px] text-slate-400 tracking-tight font-medium">
              Autonomous Meteorological Agent & Tactical GIS Deck • AtmosIQ
            </p>
          </div>
        </div>
      </div>

      {/* Center: Viewport Mode Switcher */}
      <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-1 text-xs">
        <button
          onClick={() => setViewMode('chat')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
            viewMode === 'chat'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare size={13} />
          <span className="hidden sm:inline">Chat Only</span>
        </button>

        <button
          onClick={() => setViewMode('split')}
          className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
            viewMode === 'split'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Columns size={13} />
          <span>Split GIS</span>
        </button>

        <button
          onClick={() => setViewMode('map')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
            viewMode === 'map'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Map size={13} />
          <span className="hidden sm:inline">Full Map</span>
        </button>
      </div>

      {/* Right: Tactical Status & Drawer Trigger */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Risk Pill */}
        <div
          className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-mono font-semibold ${getRiskBadgeColor()}`}
        >
          <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
          <span>IMD {riskLevel}</span>
        </div>

        {/* Tactical Ops Button */}
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
            drawerOpen
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
              : 'bg-slate-800/90 text-cyan-400 border-cyan-500/30 hover:bg-slate-800 hover:border-cyan-500/60'
          }`}
        >
          <Sliders size={14} />
          <span className="hidden sm:inline">Tactical Ops</span>
        </button>
      </div>
    </header>
  );
};
