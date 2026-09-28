import React from 'react';
import { IllinoisRegion, StatewideSummary } from '../types/rainfall';
import { Droplet, AlertTriangle, TrendingUp, Compass, Calendar } from 'lucide-react';

interface ExecutiveSummaryProps {
  summary: StatewideSummary;
  selectedRegion: IllinoisRegion;
  onSelectRegion: (region: IllinoisRegion) => void;
  lastUpdated: string;
}

const REGIONS: IllinoisRegion[] = [
  'All',
  'Northern IL (KLOT)',
  'Central IL (KILX)',
  'Western IL (KDVN)',
  'Southwest IL (KLSX)',
  'Southern IL (KPAH)'
];

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  summary,
  selectedRegion,
  onSelectRegion,
  lastUpdated,
}) => {
  const formattedDate = new Date(lastUpdated).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  return (
    <div className="space-y-6">
      {/* Hero Atmospheric Banner */}
      <div className="relative rounded-xl overflow-hidden border border-emerald-950/70 bg-[#04140e]/70 min-h-[220px] flex flex-col justify-end p-6 md:p-8">
        <img
          src="/src/assets/images/hero_illinois_rainstorm_1790551870889.jpg"
          alt="Atmospheric storm clouds over Illinois prairie"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 select-none pointer-events-none"
        />
        {/* Measured contrast scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020d08] via-[#020d08]/80 to-transparent"></div>

        <div className="relative z-10 max-w-3xl space-y-2">
          {/* Clean unboxed metadata with typographic separators */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-emerald-400">
            <span>NOAA / National Weather Service</span>
            <span aria-hidden="true">·</span>
            <span>WFO Chicago · Lincoln · Quad Cities · St. Louis · Paducah</span>
            <span aria-hidden="true">·</span>
            <span>September 27, 2026</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white max-w-2xl text-balance">
            Gauged<span className="text-emerald-400">.</span> Statewide Illinois Precipitation & Hydro-Climatological Telemetry
          </h1>

          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Real-time rainfall observations, 24-hour accumulations, monthly-to-date (MTD) totals, and 30-year climatological normal departures calibrated across Illinois automated airport weather stations (ASOS/AWOS) and NWS forecast offices.
          </p>

          <div className="flex items-center gap-2 pt-2 text-xs text-slate-400 font-mono">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Last official sync: {formattedDate}</span>
          </div>
        </div>
      </div>

      {/* 4 Precision Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: 24h Peak */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="uppercase tracking-wider">24H Max Rainfall</span>
            <Droplet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono tabular-nums text-white">
              {summary.maxRainfallToday.inches.toFixed(2)}
              <span className="text-xs uppercase font-mono text-slate-400 ml-1.5 font-normal">in</span>
            </div>
            <div className="text-xs text-slate-400 truncate mt-1">
              {summary.maxRainfallToday.inches > 0 ? summary.maxRainfallToday.stationName : 'Dry across majority of state'}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Past 24 hours precipitation
          </div>
        </div>

        {/* Metric 2: Statewide MTD Average */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="uppercase tracking-wider">Statewide MTD Average</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono tabular-nums text-white">
              {summary.statewideMtdAverage.toFixed(2)}
              <span className="text-xs uppercase font-mono text-slate-400 ml-1.5 font-normal">in</span>
            </div>
            <div className="text-xs mt-1 font-mono flex items-center gap-1.5">
              <span className={summary.statewideMtdDeparture >= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                {summary.statewideMtdDeparture >= 0 ? `+${summary.statewideMtdDeparture.toFixed(2)}"` : `${summary.statewideMtdDeparture.toFixed(2)}"`}
              </span>
              <span className="text-slate-400">vs Normal ({summary.statewideMtdNormal.toFixed(2)}")</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Month-to-date accumulation
          </div>
        </div>

        {/* Metric 3: Wettest MTD Basin */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="uppercase tracking-wider">Highest MTD Accumulation</span>
            <Compass className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono tabular-nums text-emerald-300">
              {summary.wettestStationMtd.inches.toFixed(2)}
              <span className="text-xs uppercase font-mono text-slate-400 ml-1.5 font-normal">in</span>
            </div>
            <div className="text-xs text-slate-300 truncate mt-1">
              {summary.wettestStationMtd.stationName}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Rock River / Northern IL basin
          </div>
        </div>

        {/* Metric 4: Active Flood Warnings */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="uppercase tracking-wider">Active Flood Advisories</span>
            <AlertTriangle className={`w-4 h-4 ${summary.activeFloodAlertsCount > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
          </div>
          <div className="my-2">
            <div className={`text-2xl font-bold font-mono tabular-nums ${summary.activeFloodAlertsCount > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
              {summary.activeFloodAlertsCount}
              <span className="text-xs uppercase font-mono text-slate-400 ml-1.5 font-normal">Active</span>
            </div>
            <div className="text-xs text-slate-400 truncate mt-1">
              {summary.activeFloodAlertsCount > 0 ? 'Des Plaines River basin warnings' : 'No active river flood warnings'}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            NWS Chicago / Des Plaines watershed
          </div>
        </div>
      </div>

      {/* Region Selector Tabs (Functional Segmented Control) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div className="text-xs uppercase font-semibold tracking-wider text-slate-400 font-mono">
          Filter Regional Forecast Offices:
        </div>
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-lg max-w-full overflow-x-auto">
          {REGIONS.map((reg) => (
            <button
              key={reg}
              onClick={() => onSelectRegion(reg)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                selectedRegion === reg
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
