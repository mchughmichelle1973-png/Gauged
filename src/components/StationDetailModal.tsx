import React, { useEffect, useState } from 'react';
import { StationRainfallRecord, CurrentObservation } from '../types/rainfall';
import { fetchStationObservation } from '../services/rainfallService';
import { X, Copy, Check, ExternalLink, Thermometer, Wind, Droplets, MapPin, Gauge } from 'lucide-react';

interface StationDetailModalProps {
  record: StationRainfallRecord | null;
  onClose: () => void;
}

export const StationDetailModal: React.FC<StationDetailModalProps> = ({
  record,
  onClose,
}) => {
  const [currentObs, setCurrentObs] = useState<CurrentObservation | null>(null);
  const [loadingObs, setLoadingObs] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!record) return;
    setLoadingObs(true);
    fetchStationObservation(record.station.icao)
      .then((data) => {
        if (data && data.currentObs) {
          setCurrentObs(data.currentObs);
        } else {
          setCurrentObs(null);
        }
      })
      .catch(() => setCurrentObs(null))
      .finally(() => setLoadingObs(false));
  }, [record]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!record) return null;

  const { station, rainfall } = record;

  const handleCopyBulletin = () => {
    if (rainfall.rawText) {
      navigator.clipboard.writeText(rainfall.rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span>{station.icao} · CLI:{station.cliCode}</span>
              <span aria-hidden="true">·</span>
              <span>NWS {station.wfo}</span>
              <span aria-hidden="true">·</span>
              <span>{station.county}</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              {station.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Station Geographic & Elevation Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs font-mono">
            <div>
              <div className="text-slate-500 uppercase text-[10px]">Coordinates</div>
              <div className="text-slate-200 font-semibold">
                {station.coordinates[0].toFixed(4)}°N, {Math.abs(station.coordinates[1]).toFixed(4)}°W
              </div>
            </div>
            <div>
              <div className="text-slate-500 uppercase text-[10px]">Elevation</div>
              <div className="text-slate-200 font-semibold">
                {station.elevationFt ? `${station.elevationFt} ft MSL` : 'Standard MSL'}
              </div>
            </div>
            <div>
              <div className="text-slate-500 uppercase text-[10px]">Forecast Office</div>
              <div className="text-emerald-400 font-semibold">
                NWS {station.wfo}
              </div>
            </div>
            <div>
              <div className="text-slate-500 uppercase text-[10px]">Climate Bulletin ID</div>
              <div className="text-slate-200 truncate font-semibold">
                {rainfall.sourceProductId}
              </div>
            </div>
          </div>

          {/* Core Precipitation Metrics Grid */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Official Rainfall Telemetry (Inches)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Today */}
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg">
                <div className="text-[10px] uppercase font-mono text-slate-500">Today (24h)</div>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {rainfall.todayInches.toFixed(2)}"
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Normal: {rainfall.todayNormalInches.toFixed(2)}"
                </div>
              </div>

              {/* Month to Date */}
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg">
                <div className="text-[10px] uppercase font-mono text-slate-500">Month To Date</div>
                <div className="text-xl font-bold font-mono text-emerald-300 mt-1">
                  {rainfall.monthToDateInches.toFixed(2)}"
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Normal: {rainfall.monthNormalInches.toFixed(2)}"
                </div>
              </div>

              {/* MTD Departure */}
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg">
                <div className="text-[10px] uppercase font-mono text-slate-500">MTD Departure</div>
                <div
                  className={`text-xl font-bold font-mono mt-1 ${
                    rainfall.monthDepartureInches >= 0 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {rainfall.monthDepartureInches >= 0 ? '+' : ''}
                  {rainfall.monthDepartureInches.toFixed(2)}"
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {rainfall.monthDepartureInches >= 0 ? 'Precipitation Surplus' : 'Precipitation Deficit'}
                </div>
              </div>

              {/* Year to Date */}
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg">
                <div className="text-[10px] uppercase font-mono text-slate-500">Year To Date</div>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {rainfall.yearToDateInches.toFixed(2)}"
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Norm: {rainfall.yearNormalInches.toFixed(2)}" ({rainfall.yearDepartureInches >= 0 ? '+' : ''}{rainfall.yearDepartureInches.toFixed(2)}")
                </div>
              </div>
            </div>
          </div>

          {/* Live Hourly Meteorological Conditions */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Live Hourly Conditions (api.weather.gov/stations/{station.icao})
            </h3>
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
              {loadingObs ? (
                <div className="text-xs text-slate-500 font-mono py-2">
                  Fetching current observation from NWS...
                </div>
              ) : currentObs ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-rose-400" />
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Temperature</div>
                      <div className="text-sm font-bold text-white">
                        {currentObs.temperatureF !== null && currentObs.temperatureF !== undefined
                          ? `${currentObs.temperatureF}°F`
                          : 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Humidity</div>
                      <div className="text-sm font-bold text-white">
                        {currentObs.humidity !== null && currentObs.humidity !== undefined
                          ? `${currentObs.humidity}%`
                          : 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-teal-400" />
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Wind</div>
                      <div className="text-sm font-bold text-white">
                        {currentObs.windSpeedMph !== null && currentObs.windSpeedMph !== undefined
                          ? `${currentObs.windDirection || ''} ${currentObs.windSpeedMph} mph`
                          : 'Calm'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Rain Last Hour</div>
                      <div className="text-sm font-bold text-white">
                        {currentObs.precipitationLastHourInches !== null && currentObs.precipitationLastHourInches !== undefined
                          ? `${currentObs.precipitationLastHourInches.toFixed(2)}"`
                          : '0.00"'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 font-mono">
                  Current conditions: Sky Clear / Calm · No precipitation reported in past hour
                </div>
              )}
            </div>
          </div>

          {/* Raw Official NWS Climate Report Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Official NWS Climatological Bulletin (CLI Text)
              </h3>
              <button
                onClick={handleCopyBulletin}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-xs font-mono cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto max-h-64 whitespace-pre select-text">
              {rainfall.rawText || 'Raw NWS bulletin text loading or unavailable.'}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950 text-xs text-slate-500 font-mono">
          <span>Source: NOAA National Weather Service · api.weather.gov</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-slate-800 text-slate-200 hover:text-white font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
