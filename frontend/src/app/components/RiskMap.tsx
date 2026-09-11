'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { TelemetryData, HazardReport, EvacRouteResult } from '@/types';
import {
  Layers,
  CloudRain,
  Wind,
  Flame,
  Compass,
  Crosshair,
  Home,
} from 'lucide-react';

interface RiskMapProps {
  telemetry: TelemetryData | null;
  hazards: HazardReport[];
  floodSurge: number;
  evacRoute: EvacRouteResult | null;
}

// Coordinate extraction with fallback safeguards
function getValidCoords(telemetry: TelemetryData | null): [number, number] {
  const fallbackLat = 32.7266;
  const fallbackLon = 74.8570;

  if (!telemetry) return [fallbackLat, fallbackLon];

  const parsedLat = Number(telemetry.latitude);
  const parsedLon = Number(telemetry.longitude);

  const isValidLat = !isNaN(parsedLat) && isFinite(parsedLat) && parsedLat >= -90 && parsedLat <= 90;
  const isValidLon = !isNaN(parsedLon) && isFinite(parsedLon) && parsedLon >= -180 && parsedLon <= 180;

  return [
    isValidLat ? parsedLat : fallbackLat,
    isValidLon ? parsedLon : fallbackLon,
  ];
}

// Smooth flyTo controller with strict NaN guards
function FlyToController({ coords }: { coords: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (!coords || !Array.isArray(coords) || coords.length < 2) return;

    const lat = Number(coords[0]);
    const lon = Number(coords[1]);

    // Strict numerical check: must be real numbers and within Earth coordinate bounds
    if (
      Number.isFinite(lat) &&
      !Number.isNaN(lat) &&
      Number.isFinite(lon) &&
      !Number.isNaN(lon) &&
      lat >= -90 &&
      lat <= 90 &&
      lon >= -180 &&
      lon <= 180
    ) {
      try {
        const zoomLevel = typeof map.getZoom === 'function' ? map.getZoom() || 12 : 12;
        map.flyTo([lat, lon], zoomLevel, {
          duration: 1.5,
          easeLinearity: 0.25,
        });
      } catch (err) {
        console.warn('Map flyTo bypassed invalid state:', err);
      }
    }
  }, [coords, map]);

  return null;
  
}


export const RiskMap: React.FC<RiskMapProps> = ({
  telemetry,
  hazards = [],
  floodSurge = 0,
  evacRoute,
}) => {
  const [activeOverlay, setActiveOverlay] = useState<'radar' | 'wind' | 'heatmap' | 'none'>('radar');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  

 const fallbackLat = 32.7266;
  const fallbackLon = 74.8570;
  const lat = Number.isFinite(Number(telemetry?.latitude)) ? Number(telemetry?.latitude) : fallbackLat;
  const lon = Number.isFinite(Number(telemetry?.longitude)) ? Number(telemetry?.longitude) : fallbackLon;
  const center: [number, number] = [lat, lon];

  if (!mounted) {
    return (
      <div className="w-full h-full bg-[#060911] flex items-center justify-center text-cyan-400 font-mono text-xs">
        <div className="flex flex-col items-center gap-2">
          <Crosshair className="animate-spin" size={24} />
          <span>INITIALIZING TACTICAL GIS CORE...</span>
        </div>
      </div>
    );
  }

  // Custom DivIcons
  const stationIcon = L.divIcon({
    className: 'custom-station-pin',
    html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(6, 182, 212, 0.2); border: 2px solid #06b6d4; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 18px; height: 18px; border-radius: 50%; background: #06b6d4; border: 2px solid #090d16; box-shadow: 0 0 10px #06b6d4; display: flex; align-items: center; justify-content: center;">
          <div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  const shelterIcon = L.divIcon({
    className: 'custom-shelter-pin',
    html: `
      <div style="width: 34px; height: 34px; border-radius: 8px; background: #10b981; border: 2px solid #090d16; box-shadow: 0 0 12px #10b981; display: flex; align-items: center; justify-content: center; color: #090d16; font-weight: bold;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });

  const getHazardIcon = (severity: string, isQuorum: boolean) => {
    const bg = severity === 'RED' ? '#ef4444' : severity === 'ORANGE' ? '#f97316' : '#eab308';
    return L.divIcon({
      className: 'custom-hazard-pin',
      html: `
        <div style="position: relative; width: 26px; height: 26px; border-radius: 50%; background: ${bg}; border: 2px solid #090d16; box-shadow: 0 0 8px ${bg}; display: flex; align-items: center; justify-content: center; color: #ffffff;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          ${isQuorum ? `<div style="position: absolute; top: -3px; right: -3px; width: 8px; height: 8px; border-radius: 50%; background: #10b981; border: 1.5px solid #090d16;"></div>` : ''}
        </div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });
  };

  return (
    <div className="relative w-full h-full bg-[#060911] overflow-hidden select-none">
      {/* CSS Override: Strips Leaflet's watermark and attribution banner */}
      <style jsx global>{`
        .leaflet-control-attribution {
          display: none !important;
        }
      `}</style>

      {/* Top-Right Floating Atmospheric Switcher (Mobile & Desktop Responsive) */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-[1000] flex items-center bg-[#0d1322]/95 border border-slate-800 rounded-xl p-1 shadow-2xl backdrop-blur-md">
        <button
          onClick={() => setActiveOverlay('radar')}
          className={`flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeOverlay === 'radar'
              ? 'bg-blue-600/30 text-blue-400 border border-blue-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Precipitation Radar Overlay"
        >
          <CloudRain size={14} />
          <span className="hidden md:inline">Rain Radar</span>
        </button>

        <button
          onClick={() => setActiveOverlay('wind')}
          className={`flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeOverlay === 'wind'
              ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Wind Flow Velocity Overlay"
        >
          <Wind size={14} />
          <span className="hidden md:inline">Wind Flow</span>
        </button>

        <button
          onClick={() => setActiveOverlay('heatmap')}
          className={`flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeOverlay === 'heatmap'
              ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Surface Thermal Gradient Heatmap"
        >
          <Flame size={14} />
          <span className="hidden md:inline">Heatmap</span>
        </button>

        <button
          onClick={() => setActiveOverlay(activeOverlay === 'none' ? 'radar' : 'none')}
          className={`flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeOverlay === 'none'
              ? 'bg-slate-700 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle atmospheric overlays"
        >
          <Layers size={14} />
          <span className="hidden md:inline">Layers</span>
        </button>
      </div>

      {/* Floating Tactical Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-[#0d1322]/90 border border-slate-800 rounded-xl p-2.5 shadow-xl backdrop-blur-md text-[10px] font-mono text-slate-300 space-y-1.5 hidden sm:block">
        <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
          <Compass size={13} className="text-cyan-400" />
          <span>GIS TACTICAL MATRIX</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-cyan-200" />
          <span>Active Station ({telemetry?.location?.split(',')[0] || 'Jammu'})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 border border-orange-300" />
          <span>Community Choke Point (Quorum)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
          <span>Safe Elevated Refuge Center</span>
        </div>
        {floodSurge > 0 && (
          <div className="flex items-center gap-2 text-cyan-300 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
            <span>3D DEM Surge Ring (+{floodSurge.toFixed(1)}m)</span>
          </div>
        )}
      </div>

      {/* Map Canvas */}
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        attributionControl={false}
        className="w-full h-full z-0 touch-auto"
      >
        <FlyToController coords={center} />

        {/* CARTO Dark Tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />

        {/* Atmospheric Layers */}
        {activeOverlay === 'radar' && (
          <Circle
            center={center}
            radius={28000}
            pathOptions={{
              color: '#3b82f6',
              fillColor: '#2563eb',
              fillOpacity: 0.14,
              weight: 1.5,
              dashArray: '4, 8',
            }}
          />
        )}

        {activeOverlay === 'wind' && (
          <Circle
            center={center}
            radius={36000}
            pathOptions={{
              color: '#06b6d4',
              fillColor: '#0891b2',
              fillOpacity: 0.12,
              weight: 1.5,
              dashArray: '6, 12',
            }}
          />
        )}

        {activeOverlay === 'heatmap' && (
          <Circle
            center={center}
            radius={32000}
            pathOptions={{
              color: '#f59e0b',
              fillColor: '#d97706',
              fillOpacity: 0.15,
              weight: 1.5,
            }}
          />
        )}

        {/* Microclimate Halos */}
        {telemetry && Number(telemetry.temp) > 35 && (
          <Circle
            center={center}
            radius={6500}
            pathOptions={{
              color: '#ef4444',
              fillColor: '#dc2626',
              fillOpacity: 0.22,
              weight: 2,
            }}
          />
        )}

        {telemetry && Number(telemetry.precip) > 0 && (
          <Circle
            center={center}
            radius={Math.min(12000, 3000 + Number(telemetry.precip) * 800)}
            pathOptions={{
              color: '#38bdf8',
              fillColor: '#0284c7',
              fillOpacity: 0.25,
              weight: 2,
              dashArray: '3, 6',
            }}
          />
        )}

        {telemetry && Number(telemetry.wind) > 0 && (
          <Circle
            center={center}
            radius={Math.min(15000, 2000 + Number(telemetry.wind) * 350)}
            pathOptions={{
              color: '#06b6d4',
              fillColor: '#06b6d4',
              fillOpacity: 0.08,
              weight: 1,
            }}
          />
        )}

        {/* 3D DEM Surge Simulation Rings */}
        {floodSurge > 0 && (
          <>
            <Circle
              center={center}
              radius={floodSurge * 1400}
              pathOptions={{
                color: '#60a5fa',
                fillColor: '#1d4ed8',
                fillOpacity: Math.min(0.55, 0.15 + (floodSurge / 6.0) * 0.4),
                weight: 3,
                dashArray: '5, 5',
              }}
            />
            <Circle
              center={center}
              radius={floodSurge * 750}
              pathOptions={{
                color: '#93c5fd',
                fillColor: '#3b82f6',
                fillOpacity: 0.3,
                weight: 2,
              }}
            />
          </>
        )}

        {/* Observatory Station Pin */}
        <Marker position={center} icon={stationIcon}>
          <Popup>
            <div className="p-1 text-xs space-y-1 font-sans">
              <div className="font-bold text-cyan-400 flex items-center gap-1">
                <span>Observatory Station:</span>
                <span>{telemetry?.location || 'Jammu'}</span>
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                Coords: {lat.toFixed(4)}°N, {lon.toFixed(4)}°E
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                Surface Temp: <span className="text-amber-300 font-bold">{telemetry?.temp !== undefined ? `${Number(telemetry.temp).toFixed(1)}°C` : '--'}</span>
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                Relative Humidity: <span className="text-blue-300 font-bold">{telemetry?.humidity !== undefined ? `${Number(telemetry.humidity).toFixed(0)}%` : '--'}</span>
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                Precipitation: <span className="text-cyan-300 font-bold">{telemetry?.precip !== undefined ? `${Number(telemetry.precip).toFixed(1)} mm` : '--'}</span>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Community Hazard Markers */}
        {hazards.map((h) => {
          const isQuorum = h.status === 'TRIANGULATED_QUORUM';
          const hLat = Number(h.lat);
          const hLon = Number(h.lon);

          if (isNaN(hLat) || isNaN(hLon)) return null;

          return (
            <Marker
              key={h.id}
              position={[hLat, hLon]}
              icon={getHazardIcon(h.severity, isQuorum)}
            >
              <Popup>
                <div className="p-1 text-xs space-y-1.5 font-sans">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-amber-400">{h.hazard_type}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                        isQuorum ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-yellow-950 text-yellow-400 border border-yellow-800'
                      }`}
                    >
                      {isQuorum ? 'TRIANGULATED QUORUM' : 'UNVERIFIED'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Location: <span className="text-slate-100 font-medium">{h.location}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono">
                    Water Depth: <span className="text-red-400 font-bold">{h.water_depth_cm} cm</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Anti-Spoofing Consensus: {h.quorum_count || 1} citizen reports within 500m
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Evacuation Route Polyline & Elevated Shelter Marker */}
        {evacRoute?.waypoints && evacRoute.waypoints.length > 0 && (
          <>
            <Polyline
              positions={evacRoute.waypoints}
              pathOptions={{
                color: evacRoute.detour_required ? '#f59e0b' : '#10b981',
                weight: 5,
                opacity: 0.9,
                dashArray: '8, 8',
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />

            {evacRoute.waypoints.length > 1 && (
              <Marker
                position={evacRoute.waypoints[evacRoute.waypoints.length - 1]}
                icon={shelterIcon}
              >
                <Popup>
                  <div className="p-1 text-xs space-y-1 font-sans">
                    <div className="font-bold text-emerald-400 flex items-center gap-1">
                      <Home size={14} />
                      <span>{evacRoute.shelter_name}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      Elevation: +{evacRoute.shelter_elevation_m}m AMSL (High Ground)
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      Vehicle Clearance: {evacRoute.clearance_cm} cm ({evacRoute.vehicle_type})
                    </div>
                    <div className="text-[11px] text-emerald-400 font-mono font-bold">
                      Route Status: {evacRoute.status}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}
          </>
        )}
      </MapContainer>
    </div>
  );
};