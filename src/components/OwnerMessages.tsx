import React, { useState } from 'react';
import { MessageSquare, Clock, User, ChevronDown, ChevronUp, History, Sparkles } from 'lucide-react';

export interface OwnerMessage {
  id: string;
  message: string;
  author: string;
  authorTitle: string;
  timestamp: string; // e.g., "3:36 PM"
  date: string; // e.g., "9/28/2026"
  isLatest?: boolean;
}

const OWNER_MESSAGES: OwnerMessage[] = [
  {
    id: 'msg-1',
    message: 'I think we might get some rain soon.',
    author: 'Owner',
    authorTitle: 'Network Lead & Meteorologist',
    timestamp: '3:36 PM',
    date: '9/28/2026',
    isLatest: true,
  },
];

export const OwnerMessages: React.FC = () => {
  const [showAllArchives, setShowAllArchives] = useState(false);
  const latestMessage = OWNER_MESSAGES[0];
  const archivedMessages = OWNER_MESSAGES.slice(1);

  return (
    <div className="space-y-4">
      {/* Primary Section Header */}
      <div className="flex items-center justify-between border-b border-emerald-950/60 pb-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-300">
            Messages from the owner
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Official Dispatch</span>
        </div>
      </div>

      {/* One Big Message */}
      <div className="relative overflow-hidden rounded-xl border border-emerald-800/50 bg-gradient-to-br from-[#041a10] via-[#03150d] to-[#010c07] p-6 sm:p-7 shadow-lg shadow-emerald-950/40">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 bg-emerald-600/5 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-xs">
                <User className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-semibold text-slate-100">{latestMessage.author}</span>
                <span className="text-slate-500 ml-1.5 hidden sm:inline">({latestMessage.authorTitle})</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-emerald-400/90 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-md text-[11px]">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>Created at {latestMessage.timestamp} on {latestMessage.date}</span>
            </div>
          </div>

          <div className="text-lg sm:text-xl font-medium text-slate-100 leading-relaxed font-sans pl-1 sm:pl-2 border-l-2 border-emerald-500/60 py-0.5">
            "{latestMessage.message}"
          </div>
        </div>
      </div>

      {/* Smaller Section Below: Archives */}
      <div className="rounded-lg border border-emerald-950/70 bg-[#02100a]/70 p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider">
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>Message Archive & Transmission Log</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            {OWNER_MESSAGES.length} total broadcast{OWNER_MESSAGES.length === 1 ? '' : 's'}
          </span>
        </div>

        {archivedMessages.length === 0 ? (
          <div className="py-4 text-center sm:text-left text-xs font-mono text-slate-500">
            <span className="text-emerald-400/80">Transmission #1</span> logged at {latestMessage.timestamp} on {latestMessage.date}. Older dispatches will automatically archive below upon future updates.
          </div>
        ) : (
          <div className="space-y-2">
            {(showAllArchives ? archivedMessages : archivedMessages.slice(0, 3)).map((archive) => (
              <div
                key={archive.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-3 rounded-md bg-slate-950/70 border border-emerald-950/50 text-xs font-mono"
              >
                <div className="text-slate-300 font-sans">
                  "{archive.message}"
                </div>
                <div className="text-[11px] text-slate-500 shrink-0 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{archive.timestamp} · {archive.date}</span>
                </div>
              </div>
            ))}

            {archivedMessages.length > 3 && (
              <button
                onClick={() => setShowAllArchives(!showAllArchives)}
                className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors pt-1 cursor-pointer"
              >
                {showAllArchives ? (
                  <>
                    <span>Show fewer archives</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <span>View all {archivedMessages.length} past messages</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
