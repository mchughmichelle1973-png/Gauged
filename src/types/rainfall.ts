export type IllinoisRegion = 
  | 'All' 
  | 'Northern IL (KLOT)' 
  | 'Central IL (KILX)' 
  | 'Western IL (KDVN)' 
  | 'Southwest IL (KLSX)' 
  | 'Southern IL (KPAH)';

export interface StationLocation {
  id: string; // e.g. "KORD" or "ORD"
  icao: string; // e.g. "KORD"
  cliCode: string; // e.g. "ORD"
  name: string;
  county: string;
  region: IllinoisRegion;
  wfo: string; // e.g. "KLOT", "KILX", "KDVN", "KLSX", "KPAH"
  coordinates: [number, number]; // [lat, lng]
  elevationFt?: number;
}

export interface RainfallData {
  todayInches: number;
  monthToDateInches: number;
  monthNormalInches: number;
  monthDepartureInches: number;
  yearToDateInches: number;
  yearNormalInches: number;
  yearDepartureInches: number;
  todayRecordInches: number | null;
  todayRecordYear: string | null;
  todayNormalInches: number;
  lastYearMtdInches: number | null;
  lastYearYtdInches: number | null;
  observedDate: string;
  sourceProductId: string;
  rawText?: string;
  lastUpdated: string;
}

export interface CurrentObservation {
  temperatureF?: number | null;
  humidity?: number | null;
  windSpeedMph?: number | null;
  windDirection?: string | null;
  precipitationLastHourInches?: number | null;
  textDescription?: string | null;
  timestamp?: string;
}

export interface StationRainfallRecord {
  station: StationLocation;
  rainfall: RainfallData;
  currentObs?: CurrentObservation;
}

export interface NWSFloodAlert {
  id: string;
  event: string; // e.g. "Flood Warning", "Flash Flood Watch"
  severity: string; // e.g. "Severe", "Moderate", "Minor"
  headline: string;
  areaDesc: string;
  description: string;
  instruction?: string;
  effective: string;
  expires: string;
  senderName: string;
}

export interface StatewideSummary {
  updatedAt: string;
  totalReportingStations: number;
  maxRainfallToday: {
    stationName: string;
    inches: number;
  };
  statewideMtdAverage: number;
  statewideMtdNormal: number;
  statewideMtdDeparture: number;
  activeFloodAlertsCount: number;
  driestStationMtd: {
    stationName: string;
    inches: number;
  };
  wettestStationMtd: {
    stationName: string;
    inches: number;
  };
  wettestStationYtd: {
    stationName: string;
    inches: number;
  };
}
