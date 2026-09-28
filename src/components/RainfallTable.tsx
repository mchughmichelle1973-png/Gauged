import React, { useState, useMemo } from 'react';
import { StationRainfallRecord, IllinoisRegion } from '../types/rainfall';
import { Search, Download, ArrowUpDown, ExternalLink, FileSpreadsheet } from 'lucide-react';

interface RainfallTableProps {
  stations: StationRainfallRecord[];
  onSelectStation: (station: StationRainfallRecord) => void;
  selectedRegion: IllinoisRegion;
}

type SortField = 'station' | 'today' | 'mtd' | 'mtdNormal' | 'departure' | 'ytd' | 'record';
type SortDirection = 'asc' | 'desc';

export const RainfallTable: React.FC<RainfallTableProps> = ({
  stations,
  onSelectStation,
  selectedRegion,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('mtd');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Filter stations by region and search
  const filteredStations = useMemo(() => {
    return stations.filter((rec) => {
      // Region filter
      if (selectedRegion !== 'All' && rec.station.region !== selectedRegion) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = rec.station.name.toLowerCase().includes(q);
        const matchesIcao = rec.station.icao.toLowerCase().includes(q);
        const matchesCli = rec.station.cliCode.toLowerCase().includes(q);
        const matchesCounty = rec.station.county.toLowerCase().includes(q);
        return matchesName || matchesIcao || matchesCli || matchesCounty;
      }
      return true;
    });
  }, [stations, selectedRegion, searchQuery]);

  // Sort stations
  const sortedStations = useMemo(() => {
    const list = [...filteredStations];
    list.sort((a, b) => {
      let valA: any = 0;
      let valB: any = 0;

      switch (sortField) {
        case 'station':
          valA = a.station.name;
          valB = b.station.name;
          break;
        case 'today':
          valA = a.rainfall.todayInches;
          valB = b.rainfall.todayInches;
          break;
        case 'mtd':
          valA = a.rainfall.monthToDateInches;
          valB = b.rainfall.monthToDateInches;
          break;
        case 'mtdNormal':
          valA = a.rainfall.monthNormalInches;
          valB = b.rainfall.monthNormalInches;
          break;
        case 'departure':
          valA = a.rainfall.monthDepartureInches;
          valB = b.rainfall.monthDepartureInches;
          break;
        case 'ytd':
          valA = a.rainfall.yearToDateInches;
          valB = b.rainfall.yearToDateInches;
          break;
        case 'record':
          valA = a.rainfall.todayRecordInches ?? 0;
          valB = b.rainfall.todayRecordInches ?? 0;
          break;
      }

      if (typeof valA === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });
    return list;
  }, [filteredStations, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // CSV Export Handler
  const handleExportCsv = () => {
    const headers = [
      'Station ICAO',
      'CLI Code',
      'Station Name',
      'County',
      'Region',
      'NWS WFO',
      'Latitude',
      'Longitude',
      'Elevation (ft)',
      'Today (in)',
      'Month To Date (in)',
      'MTD Normal (in)',
      'MTD Departure (in)',
      'Year To Date (in)',
      'YTD Normal (in)',
      'YTD Departure (in)',
      'Daily Record (in)',
      'Record Year',
      'Observed Date',
      'Source Bulletin'
    ];

    const rows = sortedStations.map((r) => [
      `"${r.station.icao}"`,
      `"${r.station.cliCode}"`,
      `"${r.station.name}"`,
      `"${r.station.county}"`,
      `"${r.station.region}"`,
      `"${r.station.wfo}"`,
      r.station.coordinates[0],
      r.station.coordinates[1],
      r.station.elevationFt || '',
      r.rainfall.todayInches.toFixed(2),
      r.rainfall.monthToDateInches.toFixed(2),
      r.rainfall.monthNormalInches.toFixed(2),
      r.rainfall.monthDepartureInches.toFixed(2),
      r.rainfall.yearToDateInches.toFixed(2),
      r.rainfall.yearNormalInches.toFixed(2),
      r.rainfall.yearDepartureInches.toFixed(2),
      r.rainfall.todayRecordInches?.toFixed(2) || 'N/A',
      r.rainfall.todayRecordYear || 'N/A',
      `"${r.rainfall.observedDate}"`,
      `"${r.rainfall.sourceProductId}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `illinois_rainfall_totals_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col space-y-4 p-5">
      {/* Table Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            Illinois Automated Station Rainfall Matrix
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            <span>{sortedStations.length} reporting observation stations</span>
            <span aria-hidden="true">·</span>
            <span>1991–2020 NOAA 30-Year Normals Baseline</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search station, city, county, ICAO..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-md text-xs font-semibold border border-slate-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto border border-slate-800 rounded-lg">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-mono">
              <th
                onClick={() => handleSort('station')}
                className="py-3 px-4 font-semibold cursor-pointer hover:text-emerald-400 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Station & Location</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold">County / WFO</th>
              <th
                onClick={() => handleSort('today')}
                className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-emerald-400 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Today (24h)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('mtd')}
                className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-emerald-400 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Month To Date</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('mtdNormal')}
                className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-emerald-400 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>MTD Normal</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('departure')}
                className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-emerald-400 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Departure</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('ytd')}
                className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-emerald-400 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Year To Date</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('record')}
                className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-emerald-400 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Daily Record</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
            {sortedStations.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-500 font-sans">
                  No Illinois weather stations found matching "{searchQuery}"
                </td>
              </tr>
            ) : (
              sortedStations.map((rec) => {
                const dep = rec.rainfall.monthDepartureInches;
                const isSurplus = dep >= 0;
                return (
                  <tr
                    key={rec.station.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Station Name & ICAO */}
                    <td className="py-2.5 px-4 font-sans">
                      <div className="font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors">
                        {rec.station.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {rec.station.icao} · CLI:{rec.station.cliCode}
                      </div>
                    </td>

                    {/* County / WFO */}
                    <td className="py-2.5 px-4 font-sans text-slate-400">
                      <div>{rec.station.county}</div>
                      <div className="text-[11px] font-mono text-slate-500">NWS {rec.station.wfo}</div>
                    </td>

                    {/* Today (24h) */}
                    <td className="py-2.5 px-4 text-right font-semibold text-slate-200">
                      {rec.rainfall.todayInches > 0 ? (
                        <span className="text-emerald-300">{rec.rainfall.todayInches.toFixed(2)}"</span>
                      ) : (
                        <span className="text-slate-500">0.00"</span>
                      )}
                    </td>

                    {/* Month To Date */}
                    <td className="py-2.5 px-4 text-right font-bold text-slate-100">
                      {rec.rainfall.monthToDateInches.toFixed(2)}"
                    </td>

                    {/* MTD Normal */}
                    <td className="py-2.5 px-4 text-right text-slate-400">
                      {rec.rainfall.monthNormalInches.toFixed(2)}"
                    </td>

                    {/* Departure */}
                    <td className="py-2.5 px-4 text-right font-semibold">
                      <span
                        className={
                          isSurplus
                            ? dep > 1.5
                              ? 'text-emerald-400 font-bold'
                              : 'text-emerald-400'
                            : dep < -1.0
                            ? 'text-rose-400'
                            : 'text-amber-400'
                        }
                      >
                        {isSurplus ? `+${dep.toFixed(2)}"` : `${dep.toFixed(2)}"`}
                      </span>
                    </td>

                    {/* Year To Date */}
                    <td className="py-2.5 px-4 text-right text-slate-300 font-medium">
                      <div>{rec.rainfall.yearToDateInches.toFixed(2)}"</div>
                      <div className="text-[10px] text-slate-500">
                        Norm: {rec.rainfall.yearNormalInches.toFixed(2)}" ({rec.rainfall.yearDepartureInches >= 0 ? '+' : ''}{rec.rainfall.yearDepartureInches.toFixed(2)}")
                      </div>
                    </td>

                    {/* Daily Record */}
                    <td className="py-2.5 px-4 text-right text-slate-400">
                      {rec.rainfall.todayRecordInches ? (
                        <div>
                          <span className="text-slate-300">{rec.rainfall.todayRecordInches.toFixed(2)}"</span>
                          <span className="text-[10px] text-slate-500 ml-1">({rec.rainfall.todayRecordYear})</span>
                        </div>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="py-2.5 px-4 text-center">
                      <button
                        onClick={() => onSelectStation(rec)}
                        title="View Official NWS Bulletin"
                        className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-emerald-300 hover:bg-slate-700 transition-colors cursor-pointer inline-flex items-center justify-center"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
