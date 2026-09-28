import { RainfallData, CurrentObservation } from '../types/rainfall';

export function parsePrecipitationFromNwsCli(
  productText: string,
  sourceProductId: string,
  validDateStr?: string
): RainfallData {
  const result: RainfallData = {
    todayInches: 0,
    monthToDateInches: 0,
    monthNormalInches: 0,
    monthDepartureInches: 0,
    yearToDateInches: 0,
    yearNormalInches: 0,
    yearDepartureInches: 0,
    todayRecordInches: null,
    todayRecordYear: null,
    todayNormalInches: 0,
    lastYearMtdInches: null,
    lastYearYtdInches: null,
    observedDate: validDateStr || new Date().toISOString().split('T')[0],
    sourceProductId,
    rawText: productText,
    lastUpdated: new Date().toISOString(),
  };

  if (!productText) return result;

  // Extract date from summary line e.g. "CLIMATE SUMMARY FOR SEPTEMBER 27 2026"
  const dateMatch = productText.match(/CLIMATE SUMMARY FOR\s+([A-Za-z]+)\s+(\d{1,2})\s+(\d{4})/i);
  if (dateMatch) {
    const months: Record<string, string> = {
      january: '01', february: '02', march: '03', april: '04',
      may: '05', june: '06', july: '07', august: '08',
      september: '09', october: '10', november: '11', december: '12'
    };
    const m = months[dateMatch[1].toLowerCase()] || '09';
    const d = dateMatch[2].padStart(2, '0');
    const y = dateMatch[3];
    result.observedDate = `${y}-${m}-${d}`;
  }

  const parseVal = (str: string | undefined): number | null => {
    if (!str) return null;
    const clean = str.trim().toUpperCase();
    if (clean === 'MM' || clean === 'M' || clean === '-' || clean === '') return null;
    if (clean === 'T') return 0.001; // Trace precipitation
    const num = parseFloat(clean.replace(/[^0-9.-]/g, ''));
    return isNaN(num) ? null : num;
  };

  // Find PRECIPITATION section
  const precipSectionMatch = productText.match(
    /PRECIPITATION[\s\S]*?(?=SNOWFALL|DEGREE DAYS|\n\s*\n\s*\n|\.\.\.\.\.\.\.\.\.\.)/i
  );
  if (!precipSectionMatch) return result;

  const section = precipSectionMatch[0];
  const lines = section.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^TODAY\b/i.test(trimmed)) {
      const parts = trimmed.split(/\s+/).slice(1);
      result.todayInches = parseVal(parts[0]) ?? 0;
      if (parts[1]) result.todayRecordInches = parseVal(parts[1]);
      if (parts[2] && /^\d{4}$/.test(parts[2])) result.todayRecordYear = parts[2];
      if (parts[3]) result.todayNormalInches = parseVal(parts[3]) ?? 0;
    } else if (/^MONTH TO DATE\b/i.test(trimmed)) {
      const parts = trimmed.replace(/^MONTH TO DATE\s+/i, '').split(/\s+/);
      result.monthToDateInches = parseVal(parts[0]) ?? 0;
      result.monthNormalInches = parseVal(parts[1]) ?? 0;
      result.monthDepartureInches = parseVal(parts[2]) ?? (result.monthToDateInches - result.monthNormalInches);
      if (parts[3]) result.lastYearMtdInches = parseVal(parts[3]);
    } else if (/^SINCE JAN 1\b/i.test(trimmed)) {
      const parts = trimmed.replace(/^SINCE JAN 1\s+/i, '').split(/\s+/);
      result.yearToDateInches = parseVal(parts[0]) ?? 0;
      result.yearNormalInches = parseVal(parts[1]) ?? 0;
      result.yearDepartureInches = parseVal(parts[2]) ?? (result.yearToDateInches - result.yearNormalInches);
      if (parts[3]) result.lastYearYtdInches = parseVal(parts[3]);
    }
  }

  return result;
}

export function parseHourlyObservation(obsProperties: any): CurrentObservation {
  if (!obsProperties) return {};
  
  // NWS temperatures are in Celsius, convert to Fahrenheit
  let tempF: number | null = null;
  if (obsProperties.temperature?.value !== null && obsProperties.temperature?.value !== undefined) {
    tempF = Math.round((obsProperties.temperature.value * 9) / 5 + 32);
  }

  let humidity: number | null = null;
  if (obsProperties.relativeHumidity?.value !== null && obsProperties.relativeHumidity?.value !== undefined) {
    humidity = Math.round(obsProperties.relativeHumidity.value);
  }

  // Wind speed is in km/h, convert to mph
  let windSpeedMph: number | null = null;
  if (obsProperties.windSpeed?.value !== null && obsProperties.windSpeed?.value !== undefined) {
    windSpeedMph = Math.round(obsProperties.windSpeed.value * 0.621371);
  }

  let windDir: string | null = null;
  if (obsProperties.windDirection?.value !== null && obsProperties.windDirection?.value !== undefined) {
    const deg = obsProperties.windDirection.value;
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    windDir = dirs[Math.round(deg / 22.5) % 16];
  }

  // Precipitation in mm, convert to inches
  let precipInches: number | null = null;
  if (obsProperties.precipitationLastHour?.value !== null && obsProperties.precipitationLastHour?.value !== undefined) {
    precipInches = Number((obsProperties.precipitationLastHour.value * 0.0393701).toFixed(2));
  }

  return {
    temperatureF: tempF,
    humidity,
    windSpeedMph,
    windDirection: windDir,
    precipitationLastHourInches: precipInches,
    textDescription: obsProperties.textDescription || null,
    timestamp: obsProperties.timestamp,
  };
}
