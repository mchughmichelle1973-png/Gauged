import React from 'react';
import { GitCommit, Tag, Calendar, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

export interface ChangelogRelease {
  version: string;
  date: string;
  isLatest?: boolean;
  title: string;
  changes: {
    category: 'Features' | 'Improvements' | 'Styling & Theming' | 'Hydrology Telemetry';
    items: string[];
  }[];
}

const RELEASES: ChangelogRelease[] = [
  {
    version: '1.01a',
    date: 'September 28, 2026',
    isLatest: true,
    title: 'Owner Dispatch Station, Version 1.01a & Extended Community Integrations',
    changes: [
      {
        category: 'Features',
        items: [
          'Added dedicated "Messages from the owner" feature broadcast panel highlighting official network bulletins.',
          'Introduced archived transmission log preserving timestamps and dates of prior dispatches.',
          'Integrated official release changelog detailing system updates, architectural improvements, and feature revisions.',
        ],
      },
      {
        category: 'Improvements',
        items: [
          'Updated application version tag to Version 1.01a in the primary header and system manifest.',
          'Enhanced official community link to the Gauged. Discord server for real-time hydrologic discussions.',
        ],
      },
      {
        category: 'Styling & Theming',
        items: [
          'Refined deep pulsing emerald-obsidian theme palette with enhanced contrast for radar matrix and text readouts.',
          'Unified high-priority telemetric green accents across station matrices, flood advisories, and climate normals.',
        ],
      },
    ],
  },
  {
    version: '1.00a',
    date: 'September 27, 2026',
    isLatest: false,
    title: 'Initial Production Release: Statewide Illinois Hydro-Precipitation Telemetry',
    changes: [
      {
        category: 'Hydrology Telemetry',
        items: [
          'Live connection to NOAA / National Weather Service (api.weather.gov) airport ASOS/AWOS stations across Illinois.',
          'Automated 24-hour rainfall calculations, Month-To-Date (MTD) totals, and Year-To-Date (YTD) accumulations.',
          '30-year climatological normal departure gradient based on 1991–2020 NOAA NCEI baseline.',
          'Full-text NWS Climatological Data Bulletin (CLI) parser and live hourly METAR telemetry inspector.',
          'Hydrologic flood statement and active river flood warning feed parser.',
        ],
      },
      {
        category: 'Improvements',
        items: [
          'CSV data matrix export for all Illinois reporting stations and regional forecast offices (KLOT, KILX, KDVN, KLSX, KPAH).',
          'Attribution and aesthetic alignment inspired by SkyMonitor.',
        ],
      },
    ],
  },
];

export const Changelog: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider">
            <GitCommit className="w-4 h-4" />
            <span>System Release History & Updates</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight mt-1">
            Gauged. Product Changelog
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-lg">
          <Tag className="w-3.5 h-3.5" />
          <span>Current Build: Version 1.01a</span>
        </div>
      </div>

      <div className="space-y-8">
        {RELEASES.map((release) => (
          <div
            key={release.version}
            className={`relative rounded-xl p-5 sm:p-6 transition-all ${
              release.isLatest
                ? 'bg-gradient-to-br from-[#03170e] to-[#010c07] border border-emerald-700/60 shadow-lg shadow-emerald-950/30'
                : 'bg-slate-950/80 border border-slate-800/80'
            }`}
          >
            {/* Version Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-sm font-bold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  v{release.version}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {release.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{release.date}</span>
                {release.isLatest && (
                  <span className="ml-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-500 text-slate-950 rounded">
                    Latest
                  </span>
                )}
              </div>
            </div>

            {/* Changes by category */}
            <div className="space-y-4">
              {release.changes.map((group, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{group.category}</span>
                  </div>
                  <ul className="space-y-1.5 pl-5 list-disc list-outside text-xs text-slate-300 leading-relaxed marker:text-emerald-500">
                    {group.items.map((item, itemIdx) => (
                      <li key={itemIdx}>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
