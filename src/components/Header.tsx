import React from 'react';
import { CloudRain, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated?: string;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRefresh,
  isRefreshing,
  activeSection,
  setActiveSection,
}) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3.5 bg-[#020d08]/85 backdrop-blur-md border-b border-emerald-950/70">
      {/* Zone 1: Single text element wordmark in display face + Version badge */}
      <div className="flex items-center gap-2.5">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveSection('overview');
          }}
          className="flex items-center gap-2.5 text-slate-100 hover:text-emerald-400 transition-colors"
        >
          <CloudRain className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-lg font-extrabold tracking-tight text-white whitespace-nowrap">
            Gauged<span className="text-emerald-400">.</span>
          </span>
        </a>
        <span className="text-[11px] font-mono font-medium text-emerald-400/90 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded tracking-wide select-none">
          Version 1.01b
        </span>
      </div>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-wider font-semibold text-slate-400">
        <button
          onClick={() => setActiveSection('overview')}
          className={`hover:text-slate-100 transition-colors pb-1 border-b-2 whitespace-nowrap ${
            activeSection === 'overview'
              ? 'border-emerald-400 text-emerald-300 font-bold'
              : 'border-transparent'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveSection('totals')}
          className={`hover:text-slate-100 transition-colors pb-1 border-b-2 whitespace-nowrap ${
            activeSection === 'totals'
              ? 'border-emerald-400 text-emerald-300 font-bold'
              : 'border-transparent'
          }`}
        >
          Station Totals
        </button>
        <button
          onClick={() => setActiveSection('normals')}
          className={`hover:text-slate-100 transition-colors pb-1 border-b-2 whitespace-nowrap ${
            activeSection === 'normals'
              ? 'border-emerald-400 text-emerald-300 font-bold'
              : 'border-transparent'
          }`}
        >
          Climate Normals
        </button>
        <button
          onClick={() => setActiveSection('alerts')}
          className={`hover:text-slate-100 transition-colors pb-1 border-b-2 whitespace-nowrap ${
            activeSection === 'alerts'
              ? 'border-emerald-400 text-emerald-300 font-bold'
              : 'border-transparent'
          }`}
        >
          Flood Advisories
        </button>
        <button
          onClick={() => setActiveSection('changelog')}
          className={`hover:text-slate-100 transition-colors pb-1 border-b-2 whitespace-nowrap ${
            activeSection === 'changelog'
              ? 'border-emerald-400 text-emerald-300 font-bold'
              : 'border-transparent'
          }`}
        >
          Changelog
        </button>
        <button
          onClick={() => setActiveSection('messages')}
          className={`hover:text-slate-100 transition-colors pb-1 border-b-2 whitespace-nowrap ${
            activeSection === 'messages'
              ? 'border-emerald-400 text-emerald-300 font-bold'
              : 'border-transparent'
          }`}
        >
          Live Messages
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 mr-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>NWS API Live</span>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors whitespace-nowrap disabled:opacity-50 cursor-pointer shadow-sm shadow-emerald-500/20"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Syncing...' : 'Sync NWS Data'}</span>
        </button>
      </div>
    </header>
  );
};
