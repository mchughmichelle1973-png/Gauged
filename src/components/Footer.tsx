import React from 'react';
import { ExternalLink, Database, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-emerald-950/70 bg-[#010905]/90 py-10 px-6 text-xs text-slate-500 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-slate-300 font-bold uppercase text-xs tracking-wider">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>NOAA National Weather Service Data Pipeline</span>
          </div>
          <p className="text-slate-400 leading-relaxed font-sans text-xs">
            Precipitation telemetry, daily climatological reports (CLI), and hydrological flood statements are ingested directly from the public National Weather Service API (<a href="https://api.weather.gov" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">api.weather.gov</a>). Climatological normals adhere to the 1991–2020 standard baseline established by the National Centers for Environmental Information (NCEI).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="space-y-1">
            <div className="text-slate-300 font-semibold uppercase text-[11px]">Reporting WFOs</div>
            <div className="text-slate-400 text-xs">
              KLOT (Chicago) · KILX (Lincoln) · KDVN (Quad Cities) · KLSX (St. Louis) · KPAH (Paducah)
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-slate-300 font-semibold uppercase text-[11px]">Data Status</div>
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Public Domain · U.S. Gov</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <div className="flex flex-col gap-1.5">
          <div>
            © {new Date().getFullYear()} Gauged. Illinois Hydro-Precipitation Network. All meteorological observations provided for scientific, agricultural, and public awareness purposes.
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400 font-mono text-[11px]">
            <div>
              Heavily inspired by{' '}
              <a
                href="https://skymonitor.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 transition-colors"
              >
                SkyMonitor
              </a>{' '}
              <span className="text-slate-500">(skymonitor.app)</span>
            </div>
            <span aria-hidden="true" className="text-slate-600 hidden sm:inline">·</span>
            <div>
              <a
                href="https://discord.gg/5XFRPbZefy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 transition-colors inline-flex items-center gap-1"
              >
                <span>Join our discord!</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <a
            href="https://weather.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors flex items-center gap-1"
          >
            <span>weather.gov</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://www.ncei.noaa.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors flex items-center gap-1"
          >
            <span>NOAA NCEI</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
};
