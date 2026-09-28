import React from 'react';
import { NWSFloodAlert } from '../types/rainfall';
import { AlertTriangle, ShieldAlert, Clock, MapPin, CheckCircle2 } from 'lucide-react';

interface ActiveAlertsProps {
  alerts: NWSFloodAlert[];
}

export const ActiveAlerts: React.FC<ActiveAlertsProps> = ({ alerts }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>NWS Hydrologic Advisories & Warnings</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight mt-1">
            Active Illinois Flood & Precipitation Alerts
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Queried via api.weather.gov/alerts</span>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          <div className="text-sm font-semibold text-slate-200">
            No Active Flood Watches or Warnings
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            All rivers, creeks, and urban drainage networks across Illinois are currently reporting at or below normal baseline hydrological thresholds.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const effectiveFormatted = new Date(alert.effective).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              timeZoneName: 'short',
            });
            const expiresFormatted = new Date(alert.expires).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              timeZoneName: 'short',
            });

            return (
              <div
                key={alert.id}
                className="bg-slate-950 border border-amber-500/40 rounded-lg p-5 space-y-3 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-amber-500"></div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {alert.event}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Severity: <strong className="text-slate-200">{alert.severity}</strong>
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Issuing: <span className="text-emerald-400">{alert.senderName}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">
                  {alert.headline}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Affected Area: {alert.areaDesc}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Valid until: {expiresFormatted}</span>
                  </div>
                </div>

                {alert.description && (
                  <div className="bg-slate-900/90 border border-slate-800 rounded p-3 text-xs font-mono text-slate-300 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                    {alert.description}
                  </div>
                )}

                {alert.instruction && (
                  <div className="text-xs text-amber-200/90 bg-amber-950/30 border border-amber-900/40 rounded p-2.5">
                    <strong>Safety Precaution:</strong> {alert.instruction}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
