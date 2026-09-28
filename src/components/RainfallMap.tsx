import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { StationRainfallRecord } from '../types/rainfall';
import { Layers, Maximize2, Info, Eye } from 'lucide-react';

interface RainfallMapProps {
  stations: StationRainfallRecord[];
  onSelectStation: (station: StationRainfallRecord) => void;
  selectedStationId?: string;
}

export const RainfallMap: React.FC<RainfallMapProps> = ({
  stations,
  onSelectStation,
  selectedStationId,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const radarLayerRef = useRef<L.TileLayer | null>(null);

  const [showRadar, setShowRadar] = useState(true);
  const [metricMode, setMetricMode] = useState<'mtd' | 'today' | 'departure'>('mtd');

  // Helper color scale for rainfall amounts
  const getMarkerColor = (rec: StationRainfallRecord) => {
    if (metricMode === 'mtd') {
      const val = rec.rainfall.monthToDateInches;
      if (val >= 5.0) return '#a855f7'; // Purple (Extreme/High e.g. Rockford)
      if (val >= 3.0) return '#10b981'; // Emerald
      if (val >= 2.0) return '#34d399'; // Mint Green
      if (val >= 1.0) return '#6ee7b7'; // Light Emerald
      return '#94a3b8'; // Slate
    } else if (metricMode === 'today') {
      const val = rec.rainfall.todayInches;
      if (val >= 1.0) return '#a855f7';
      if (val >= 0.25) return '#10b981';
      if (val > 0.005) return '#34d399';
      return '#64748b';
    } else {
      // Departure mode
      const dep = rec.rainfall.monthDepartureInches;
      if (dep >= 2.0) return '#10b981'; // Big surplus
      if (dep >= 0.0) return '#34d399'; // Moderate surplus
      if (dep >= -1.0) return '#f59e0b'; // Slight deficit
      return '#f43f5e'; // Significant deficit
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Illinois bounding coordinates
    const map = L.map(mapContainerRef.current, {
      center: [40.0, -89.2],
      zoom: 7,
      minZoom: 6,
      maxZoom: 12,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    // CartoDB Dark Matter basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Radar layer (IEM NEXRAD base reflectivity)
    const radar = L.tileLayer('https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png', {
      opacity: 0.65,
      zIndex: 10,
      attribution: 'NOAA / NWS NEXRAD Doppler Radar (IEM)',
    });

    if (showRadar) {
      radar.addTo(map);
    }
    radarLayerRef.current = radar;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Radar Layer Visibility
  useEffect(() => {
    if (!mapInstanceRef.current || !radarLayerRef.current) return;
    if (showRadar) {
      if (!mapInstanceRef.current.hasLayer(radarLayerRef.current)) {
        radarLayerRef.current.addTo(mapInstanceRef.current);
      }
    } else {
      if (mapInstanceRef.current.hasLayer(radarLayerRef.current)) {
        mapInstanceRef.current.removeLayer(radarLayerRef.current);
      }
    }
  }, [showRadar]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    stations.forEach((rec) => {
      const [lat, lng] = rec.station.coordinates;
      const color = getMarkerColor(rec);
      const isSelected = selectedStationId === rec.station.id;

      let displayVal = `${rec.rainfall.monthToDateInches.toFixed(2)}"`;
      if (metricMode === 'today') {
        displayVal = `${rec.rainfall.todayInches.toFixed(2)}"`;
      } else if (metricMode === 'departure') {
        const d = rec.rainfall.monthDepartureInches;
        displayVal = (d >= 0 ? `+${d.toFixed(2)}"` : `${d.toFixed(2)}"`);
      }

      // Create custom HTML marker
      const markerHtml = `
        <div style="
          background: rgba(15, 23, 42, 0.92);
          border: 2px solid ${color};
          border-radius: 9999px;
          padding: 2px 7px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          color: #f8fafc;
          box-shadow: 0 0 12px ${color}55;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          cursor: pointer;
          transform: translate(-50%, -50%);
          ${isSelected ? 'outline: 2px solid white; outline-offset: 2px;' : ''}
        ">
          <span style="width: 7px; height: 7px; border-radius: 50%; background: ${color};"></span>
          <span>${rec.station.cliCode}</span>
          <span style="color: ${color}; font-weight: 700;">${displayVal}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-rainfall-pin',
        html: markerHtml,
        iconSize: [0, 0],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 text-slate-900 font-sans';
      popupContent.innerHTML = `
        <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 2px;">
          ${rec.station.name} (${rec.station.icao})
        </div>
        <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
          ${rec.station.county} · NWS ${rec.station.wfo}
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-family: monospace; font-size: 11px; margin-bottom: 8px;">
          <div style="background: #f1f5f9; padding: 4px 6px; border-radius: 4px;">
            <div style="color: #64748b; font-size: 9px; text-transform: uppercase;">Today (24h)</div>
            <div style="font-weight: 700; color: #0f172a;">${rec.rainfall.todayInches.toFixed(2)}"</div>
          </div>
          <div style="background: #f1f5f9; padding: 4px 6px; border-radius: 4px;">
            <div style="color: #64748b; font-size: 9px; text-transform: uppercase;">Month to Date</div>
            <div style="font-weight: 700; color: #059669;">${rec.rainfall.monthToDateInches.toFixed(2)}"</div>
          </div>
          <div style="background: #f1f5f9; padding: 4px 6px; border-radius: 4px;">
            <div style="color: #64748b; font-size: 9px; text-transform: uppercase;">MTD Departure</div>
            <div style="font-weight: 700; color: ${rec.rainfall.monthDepartureInches >= 0 ? '#16a34a' : '#d97706'};">
              ${rec.rainfall.monthDepartureInches >= 0 ? '+' : ''}${rec.rainfall.monthDepartureInches.toFixed(2)}"
            </div>
          </div>
          <div style="background: #f1f5f9; padding: 4px 6px; border-radius: 4px;">
            <div style="color: #64748b; font-size: 9px; text-transform: uppercase;">Year to Date</div>
            <div style="font-weight: 700; color: #0f172a;">${rec.rainfall.yearToDateInches.toFixed(2)}"</div>
          </div>
        </div>
        <button id="view-details-${rec.station.id}" style="
          width: 100%;
          background: #059669;
          color: white;
          padding: 5px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          border: none;
          cursor: pointer;
        ">
          Inspect Official NWS Bulletin
        </button>
      `;

      marker.bindPopup(popupContent);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-details-${rec.station.id}`);
        if (btn) {
          btn.onclick = () => onSelectStation(rec);
        }
      });

      marker.addTo(markersLayerRef.current!);
    });
  }, [stations, metricMode, selectedStationId]);

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([40.0, -89.2], 7);
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col">
      {/* Top Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800 z-10">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span className="text-xs uppercase font-bold tracking-wider text-slate-200">
            Interactive Illinois Hydro Map & Doppler Radar
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Metric Selector Tabs */}
          <div className="flex items-center p-0.5 bg-slate-950 border border-slate-800 rounded-md">
            <button
              onClick={() => setMetricMode('mtd')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                metricMode === 'mtd' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Month to Date
            </button>
            <button
              onClick={() => setMetricMode('today')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                metricMode === 'today' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Today (24h)
            </button>
            <button
              onClick={() => setMetricMode('departure')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                metricMode === 'departure' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Departure
            </button>
          </div>

          {/* Radar Toggle Button */}
          <button
            onClick={() => setShowRadar(!showRadar)}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded border transition-colors cursor-pointer ${
              showRadar
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>NEXRAD Radar {showRadar ? 'ON' : 'OFF'}</span>
          </button>

          {/* Reset Zoom Button */}
          <button
            onClick={handleResetView}
            title="Reset Illinois view"
            className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div ref={mapContainerRef} className="w-full h-[520px] bg-slate-950 z-0"></div>

      {/* Map Legend Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-2.5 bg-slate-900/95 border-t border-slate-800 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-300">
            {metricMode === 'mtd'
              ? 'MTD Rainfall:'
              : metricMode === 'today'
              ? 'Today (24h):'
              : 'Departure from Normal:'}
          </span>
          {metricMode === 'mtd' ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8]"></span> &lt; 1.0"</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#6ee7b7]"></span> 1.0–2.0"</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#34d399]"></span> 2.0–3.0"</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span> 3.0–5.0"</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]"></span> &gt; 5.0"</span>
            </div>
          ) : metricMode === 'today' ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#64748b]"></span> 0.00"</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#34d399]"></span> 0.01–0.24"</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span> 0.25–0.99"</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]"></span> &ge; 1.00"</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]"></span> &lt; -1.0" Deficit</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span> Near Normal</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#34d399]"></span> 0 to +2.0" Surplus</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span> &gt; +2.0" Surplus</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-slate-500">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Click any station marker for full climate metrics & official bulletin</span>
        </div>
      </div>
    </div>
  );
};
