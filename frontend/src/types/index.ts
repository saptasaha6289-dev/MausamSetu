export type PersonaType = 'kisan' | 'maritime' | 'urban';
export type LanguageCode = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr' | 'gu' | 'pa';
export type ViewMode = 'chat' | 'split' | 'map';

export interface ForecastDay {
  day: string;
  date: string;
  max_temp: number;
  min_temp: number;
  precip: number;
}

export interface TelemetryData {
  location: string;
  latitude: number;
  longitude: number;
  temp: number;
  humidity: number;
  wind: number;
  precip: number;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  forecast_7d: ForecastDay[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  telemetry?: TelemetryData;
  persona?: PersonaType;
}

export interface HazardReport {
  id: string;
  hazard_type: string;
  severity: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
  water_depth_cm: number;
  quorum_count: number;
  status: 'UNVERIFIED_SINGLE_SOURCE' | 'TRIANGULATED_QUORUM';
  lat: number;
  lon: number;
  location: string;
  timestamp: string;
}

export interface EvacRouteResult {
  shelter_name: string;
  shelter_elevation_m: number;
  vehicle_type: string;
  clearance_cm: number;
  status: string;
  detour_required: boolean;
  total_distance_km: number;
  waypoints: [number, number][];
  impassable_hazards: Array<{
    id: string;
    hazard_type: string;
    water_depth_cm: number;
    clearance_cm: number;
    deficit_cm: number;
    lat: number;
    lon: number;
  }>;
}

export interface AtmosphericOverlay {
  id: 'radar' | 'wind' | 'heatmap' | 'none';
  label: string;
}
