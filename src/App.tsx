/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { RainfallTable } from './components/RainfallTable';
import { ClimateNormalsChart } from './components/ClimateNormalsChart';
import { ActiveAlerts } from './components/ActiveAlerts';
import { StationDetailModal } from './components/StationDetailModal';
import { Footer } from './components/Footer';
import { fetchRainfallSummary, RainfallResponse } from './services/rainfallService';
import { IllinoisRegion, StationRainfallRecord } from './types/rainfall';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<RainfallResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeSection, setActiveSection] = useState<string>('overview');
  const [selectedRegion, setSelectedRegion] = useState<IllinoisRegion>('All');
  const [inspectedStation, setInspectedStation] = useState<StationRainfallRecord | null>(null);

  const loadData = async (forceRefresh = false) => {
    if (forceRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const result = await fetchRainfallSummary(forceRefresh);
      setData(result);
    } catch (err: any) {
      console.error('Failed to load rainfall data:', err);
      setError('Unable to fetch live NWS rainfall data. Please check connection and retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#020d08] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      {/* Deep Pulsing Green Ambient Background (Non-Distracting) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
        {/* Deep base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#02100a] via-[#020d08] to-[#010905]" />

        {/* Primary breathing emerald plume */}
        <div className="absolute -top-[12%] left-1/2 -translate-x-1/2 w-[1100px] h-[750px] rounded-full bg-emerald-600/12 blur-[130px] animate-ambient-pulse" />

        {/* Secondary deep forest green pulse (offset and delayed) */}
        <div className="absolute top-[35%] -left-[10%] w-[850px] h-[650px] rounded-full bg-emerald-800/14 blur-[140px] animate-ambient-pulse-delayed" />

        {/* Lower basin teal/emerald subtle pulse */}
        <div className="absolute top-[65%] -right-[10%] w-[900px] h-[700px] rounded-full bg-teal-800/10 blur-[150px] animate-ambient-pulse" />

        {/* Subtle atmospheric micro-grid overlay for scientific texture */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(16,185,129,0.04)_1px,transparent_1px)] [background-size:28px_28px] opacity-60" />
      </div>

      {/* Top Header */}
      <Header
        onRefresh={() => loadData(true)}
        isRefreshing={refreshing}
        lastUpdated={data?.timestamp}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        {/* Error Notification */}
        {error && (
          <div className="bg-rose-950/50 border border-rose-800 rounded-lg p-4 flex items-center justify-between gap-4 text-xs font-mono text-rose-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadData(true)}
              className="px-3 py-1 bg-rose-900 hover:bg-rose-800 rounded text-rose-100 font-semibold transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && !data ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
            <div className="text-sm font-mono text-slate-400">
              Querying NOAA National Weather Service API for Illinois stations...
            </div>
          </div>
        ) : data ? (
          <>
            {/* Overview / Executive Summary Section */}
            {(activeSection === 'overview' || activeSection === 'totals') && (
              <section id="summary-section">
                <ExecutiveSummary
                  summary={data.summary}
                  selectedRegion={selectedRegion}
                  onSelectRegion={setSelectedRegion}
                  lastUpdated={data.timestamp}
                />
              </section>
            )}

            {/* Station Rainfall Totals Matrix */}
            {(activeSection === 'overview' || activeSection === 'totals') && (
              <section id="totals-section">
                <RainfallTable
                  stations={data.stations}
                  onSelectStation={(station) => setInspectedStation(station)}
                  selectedRegion={selectedRegion}
                />
              </section>
            )}

            {/* Climate Normals & Departure Distribution */}
            {(activeSection === 'overview' || activeSection === 'normals') && (
              <section id="normals-section">
                <ClimateNormalsChart
                  stations={data.stations}
                  onSelectStation={(station) => setInspectedStation(station)}
                />
              </section>
            )}

            {/* Active Flood Warnings & Alerts */}
            {(activeSection === 'overview' || activeSection === 'alerts') && (
              <section id="alerts-section">
                <ActiveAlerts alerts={data.alerts} />
              </section>
            )}
          </>
        ) : null}
      </main>

      {/* Station Technical Details Modal */}
      <StationDetailModal
        record={inspectedStation}
        onClose={() => setInspectedStation(null)}
      />

      {/* Authoritative Footer */}
      <Footer />
    </div>
  );
}
