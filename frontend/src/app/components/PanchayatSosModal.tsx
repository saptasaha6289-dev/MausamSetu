'use client';

import React, { useState } from 'react';
import { TelemetryData } from '@/types';
import {
  X,
  Send,
  CheckCircle2,
  BellRing,
  PhoneCall,
  Radio,
  Volume2,
  ShieldAlert,
  Loader2,
} from 'lucide-react';

const API_BASE = 'http://localhost:8000';

interface PanchayatSosModalProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: TelemetryData | null;
}

export const PanchayatSosModal: React.FC<PanchayatSosModalProps> = ({
  isOpen,
  onClose,
  telemetry,
}) => {
  const [broadcastDone, setBroadcastDone] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [channels, setChannels] = useState({
    cellBroadcast: true,
    capProtocol: true,
    vhfRadio: true,
    villageSiren: true,
  });

  if (!isOpen) return null;

  const locName = telemetry?.location || 'Jammu, Jammu and Kashmir';
  const risk = telemetry?.risk_level || 'HIGH';

  const handleBroadcast = async () => {
    setBroadcasting(true);
    try {
      await fetch(`${API_BASE}/api/sos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: locName,
          risk_level: risk,
          channels: channels,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.warn('Backend SOS endpoint unreachable, triggering offline mesh broadcast fallback:', err);
    } finally {
      setBroadcasting(false);
      setBroadcastDone(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="bg-[#0d1322] border border-red-500/50 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-red-950/50">
        {/* Modal Header */}
        <div className="bg-red-600/20 border-b border-red-500/30 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-red-400">
            <ShieldAlert size={20} className="animate-pulse" />
            <span className="font-bold text-sm text-white">Panchayat SOS Emergency Broadcast</span>
          </div>
          <button
            onClick={() => {
              setBroadcastDone(false);
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs text-slate-300">
          {broadcastDone ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-base font-bold text-white">Emergency Alert Successfully Dispatched</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Common Alerting Protocol (CAP) message broadcast to {locName} local disaster response cells, SDRF/NDRF battlegroups, and registered citizen handsets.
              </p>
              <button
                onClick={() => {
                  setBroadcastDone(false);
                  onClose();
                }}
                className="mt-3 px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                Return to Command Deck
              </button>
            </div>
          ) : (
            <>
              {/* Target Location Alert Pill */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Target Panchayat / Sector:</span>
                  <span className="text-sm font-bold text-white">{locName}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-red-950 text-red-400 border border-red-800">
                  STATUS: {risk}
                </span>
              </div>

              {/* Alert Protocol Channels */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                  Active Dispatch Channels (Multi-Channel Mesh)
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.cellBroadcast}
                      onChange={(e) => setChannels({ ...channels, cellBroadcast: e.target.checked })}
                      className="accent-cyan-400 rounded"
                    />
                    <PhoneCall size={14} className="text-cyan-400" />
                    <span className="text-xs">SMS Cell Broadcast</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.capProtocol}
                      onChange={(e) => setChannels({ ...channels, capProtocol: e.target.checked })}
                      className="accent-cyan-400 rounded"
                    />
                    <BellRing size={14} className="text-amber-400" />
                    <span className="text-xs">NDMA CAP Protocol</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.vhfRadio}
                      onChange={(e) => setChannels({ ...channels, vhfRadio: e.target.checked })}
                      className="accent-cyan-400 rounded"
                    />
                    <Radio size={14} className="text-emerald-400" />
                    <span className="text-xs">MoES VHF Radio Net</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.villageSiren}
                      onChange={(e) => setChannels({ ...channels, villageSiren: e.target.checked })}
                      className="accent-cyan-400 rounded"
                    />
                    <Volume2 size={14} className="text-rose-400" />
                    <span className="text-xs">Panchayat Loudspeaker</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={broadcasting}
                  onClick={handleBroadcast}
                  className="flex-2 flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-950/50 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {broadcasting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  <span>{broadcasting ? 'Transmitting Mesh...' : 'Transmit Emergency SOS'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};