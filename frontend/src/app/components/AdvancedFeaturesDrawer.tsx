'use client';

import React, { useState } from 'react';
import {
  TelemetryData,
  HazardReport,
  EvacRouteResult,
} from '@/types';
import {
  X,
  Activity,
  ShieldCheck,
  Navigation,
  Waves,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Car,
  Footprints,
  Truck,
  Bike,
  Droplet,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface AdvancedFeaturesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: TelemetryData | null;
  hazards: HazardReport[];
  floodSurge: number;
  setFloodSurge: (val: number) => void;
  evacRoute: EvacRouteResult | null;
  onPlotEvacRoute: (vehicleType: string) => Promise<void>;
  onSimulateHazardReport: (lat: number, lon: number, location: string) => Promise<void>;
  activeVehicle: string;
  setActiveVehicle: (v: string) => void;
  evacLoading: boolean;
}

export const AdvancedFeaturesDrawer: React.FC<AdvancedFeaturesDrawerProps> = ({
  isOpen,
  onClose,
  telemetry,
  hazards,
  floodSurge,
  setFloodSurge,
  evacRoute,
  onPlotEvacRoute,
  onSimulateHazardReport,
  activeVehicle,
  setActiveVehicle,
  evacLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'quorum' | 'evac' | 'flood'>('telemetry');
  const [simLoading, setSimLoading] = useState(false);

  if (!isOpen) return null;

  const forecastData = telemetry?.forecast_7d || [];

  const vehicles = [
    { id: 'walking', label: 'Walking', clearance: '15 cm', icon: Footprints },
    { id: 'two_wheeler', label: '2-Wheeler', clearance: '12 cm', icon: Bike },
    { id: 'sedan', label: 'Sedan', clearance: '22 cm', icon: Car },
    { id: 'heavy_rescue', label: 'Rescue Truck', clearance: '80 cm', icon: Truck },
  ];

  // Flood simulation calculations
  const inundatedAcreage = (floodSurge * 420.5).toFixed(0);
  const culvertSaturation = Math.min(100, Math.round((floodSurge / 4.0) * 100));
  const highwayStatus =
    floodSurge >= 3.5
      ? 'IMPASSABLE - Major Trunk Roads Submerged'
      : floodSurge >= 1.5
      ? 'RESTRICTED - Low-lying Culverts Breached'
      : 'OPEN - Standard Traffic Operating';

  const handleTriggerSimulation = async () => {
    setSimLoading(true);
    const baseLat = telemetry?.latitude || 32.7266;
    const baseLon = telemetry?.longitude || 74.8570;
    // Simulate report within 350m of base to trigger 500m quorum
    await onSimulateHazardReport(
      baseLat + 0.0025,
      baseLon + 0.0025,
      `${telemetry?.location?.split(',')[0] || 'Jammu'} Citizen Cluster`
    );
    setSimLoading(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#0d1322] border-l border-slate-800 shadow-2xl flex flex-col transition-transform select-none">
      {/* Drawer Header */}
      <div className="h-14 px-5 border-b border-slate-800 flex items-center justify-between bg-[#090d16]/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Activity size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Tactical Operations Deck</h2>
            <p className="text-[10px] text-slate-400 font-mono">High-Resolution MoES Analysis</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Close Drawer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1 p-2 bg-slate-900/90 border-b border-slate-800 shrink-0 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`py-2 px-1 rounded-lg text-center transition-all flex flex-col items-center gap-1 ${
            activeTab === 'telemetry'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp size={14} />
          <span className="text-[10px]">7D Forecast</span>
        </button>

        <button
          onClick={() => setActiveTab('quorum')}
          className={`py-2 px-1 rounded-lg text-center transition-all flex flex-col items-center gap-1 ${
            activeTab === 'quorum'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck size={14} />
          <span className="text-[10px]">Quorum</span>
        </button>

        <button
          onClick={() => setActiveTab('evac')}
          className={`py-2 px-1 rounded-lg text-center transition-all flex flex-col items-center gap-1 ${
            activeTab === 'evac'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Navigation size={14} />
          <span className="text-[10px]">Evac Corridors</span>
        </button>

        <button
          onClick={() => setActiveTab('flood')}
          className={`py-2 px-1 rounded-lg text-center transition-all flex flex-col items-center gap-1 ${
            activeTab === 'flood'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Waves size={14} />
          <span className="text-[10px]">3D Inundation</span>
        </button>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-slate-200">
        {/* TAB 1: TELEMETRY 7-DAY RECHARTS */}
        {activeTab === 'telemetry' && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  7-Day Temperature Range (°C)
                </h3>
                <span className="text-[10px] text-cyan-400 font-mono">Open-Meteo High-Res</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Dynamic gradient curve of diurnal Max/Min thermal oscillations with automatic domain padding.
              </p>
              <div className="h-52 w-full bg-slate-900/80 border border-slate-800 rounded-xl p-2 flex items-center justify-center">
                {forecastData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="tempMaxGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="tempMinGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} domain={['dataMin - 2', 'dataMax + 2']} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0d1322', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                        labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="max_temp" name="Max Temp (°C)" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#tempMaxGrad)" />
                      <Area type="monotone" dataKey="min_temp" name="Min Temp (°C)" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#tempMinGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <span className="text-xs font-mono text-slate-500">Awaiting NWP telemetry...</span>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Daily Precipitation Sum (mm)
                </h3>
                <span className="text-[10px] text-blue-400 font-mono">Cumulative mm/day</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Simulated precipitation bar volume for soil saturation & runoff modeling.
              </p>
              <div className="h-44 w-full bg-slate-900/80 border border-slate-800 rounded-xl p-2 flex items-center justify-center">
                {forecastData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0d1322', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                        labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="precip" name="Precipitation (mm)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <span className="text-xs font-mono text-slate-500">Awaiting precipitation telemetry...</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QUORUM ANTI-SPOOFING */}
        {activeTab === 'quorum' && (
          <div className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <ShieldCheck size={16} />
                <span>500m Haversine Anti-Spoofing Architecture</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Citizen hazard reports undergo automated spatial triangulation. Any report within a 0.5 km radius increments the consensus cluster quorum count, upgrading the node to <span className="text-emerald-400 font-bold">TRIANGULATED_QUORUM</span>.
              </p>
            </div>

            {/* Quorum Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] text-slate-400 block mb-1">Distance Delta Limit</span>
                <span className="text-base font-bold text-white">500 Meters (0.5 km)</span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] text-slate-400 block mb-1">Consensus Rule</span>
                <span className="text-base font-bold text-emerald-400">≥ 2 Geotagged Pins</span>
              </div>
            </div>

            {/* Interactive Hazard Simulation */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-3">
              <h4 className="text-xs font-bold text-white">Citizen Hazard Simulation Testbed</h4>
              <p className="text-[11px] text-slate-400">
                Trigger a simulated geocoded flood report near the current station to verify live Haversine spatial triangulation.
              </p>
              <button
                onClick={handleTriggerSimulation}
                disabled={simLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                <Upload size={14} />
                <span>{simLoading ? 'Triangulating Quorum...' : 'Simulate Citizen Hazard Report (500m)'}</span>
              </button>
            </div>

            {/* List of Verified Hazards */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Active Verified Choke Points ({hazards.length})
              </h4>
              {hazards.map((h) => {
                const isQuorum = h.status === 'TRIANGULATED_QUORUM';
                return (
                  <div key={h.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{h.hazard_type}</span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${
                          isQuorum ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {isQuorum ? `QUORUM (${h.quorum_count})` : 'UNVERIFIED'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
                      <span>{h.location}</span>
                      <span className="text-red-400 font-bold">{h.water_depth_cm} cm</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: CLEARANCE-AWARE EVAC CORRIDORS */}
        {activeTab === 'evac' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-1">
                Clearance-Aware Evacuation Routing
              </h3>
              <p className="text-[11px] text-slate-400 mb-3">
                Evaluates vehicle water clearance against active flood choke points to plot guaranteed dry detours to high ground.
              </p>
            </div>

            {/* Vehicle Selection */}
            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold block mb-2">
                Select Evacuation Transport Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                {vehicles.map((v) => {
                  const Icon = v.icon;
                  const active = activeVehicle === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setActiveVehicle(v.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                        active
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{v.label}</div>
                        <div className="text-[10px] font-mono text-cyan-400">Limit: {v.clearance}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Plot Route Button */}
            <button
              onClick={() => onPlotEvacRoute(activeVehicle)}
              disabled={evacLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 border border-emerald-500/40 transition-all active:scale-95 disabled:opacity-50"
            >
              <Navigation size={16} />
              <span>{evacLoading ? 'Calculating Safe Bypass...' : 'Plot Refuge Corridor on Map'}</span>
            </button>

            {/* Route Metrics Result */}
            {evacRoute && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Corridor Status:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      evacRoute.detour_required
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    {evacRoute.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Target Shelter:</span>
                  <span className="text-white font-semibold truncate max-w-[200px]">{evacRoute.shelter_name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Elevation Gain:</span>
                  <span className="text-emerald-400 font-bold">+{evacRoute.shelter_elevation_m}m (High Ground)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Total Distance:</span>
                  <span className="text-cyan-300 font-bold">{evacRoute.total_distance_km} km</span>
                </div>

                {evacRoute.impassable_hazards && evacRoute.impassable_hazards.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1">
                    <span className="text-amber-400 font-bold block">Impassable Choke Points Bypassed:</span>
                    {evacRoute.impassable_hazards.map((ih) => (
                      <div key={ih.id} className="text-slate-400 flex justify-between">
                        <span>• {ih.hazard_type}</span>
                        <span className="text-red-400">+{ih.deficit_cm} cm overflow</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: 3D FLOOD INUNDATION SIMULATOR */}
        {activeTab === 'flood' && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  3D DEM Terrain Inundation Simulator
                </h3>
                <span className="text-xs font-mono text-cyan-400 font-bold">{floodSurge.toFixed(1)}m Surge</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Simulate catastrophic river basin or storm surge ingress from 0.0m to 6.0m to compute road network saturation.
              </p>

              {/* Slider */}
              <div className="space-y-2 bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                <input
                  type="range"
                  min="0"
                  max="6"
                  step="0.1"
                  value={floodSurge}
                  onChange={(e) => setFloodSurge(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>0.0m (Baseline)</span>
                  <span>3.0m (Severe Surge)</span>
                  <span>6.0m (Catastrophic)</span>
                </div>
              </div>
            </div>

            {/* Real-time Inundation Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] text-slate-400 block mb-1">Culvert Saturation</span>
                <span className={`text-lg font-bold ${culvertSaturation > 70 ? 'text-red-400' : 'text-cyan-400'}`}>
                  {culvertSaturation}%
                </span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] text-slate-400 block mb-1">Submerged Acreage</span>
                <span className="text-lg font-bold text-amber-400">
                  {inundatedAcreage} Acres
                </span>
              </div>
            </div>

            {/* Highway Blockage Assessment */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Arterial Highway & Culvert Status
              </span>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    floodSurge >= 3.5 ? 'bg-red-500' : floodSurge >= 1.5 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
                <span>{highwayStatus}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
