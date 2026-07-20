import Papa from "papaparse";

export interface CsvParseResult {
  data: any[];
  headers: string[];
  errors: string[];
}

export function parseCsv(csvText: string): CsvParseResult {
  if (!csvText.trim()) {
    return { data: [], headers: [], errors: [] };
  }

  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const headers = result.meta.fields || [];
  const errors = result.errors.map(e => `Row ${e.row || 0}: ${e.message}`);

  return {
    data: result.data,
    headers,
    errors,
  };
}

export function jsonToCsv(jsonArray: any[]): string {
  if (!jsonArray || jsonArray.length === 0) return "";
  return Papa.unparse(jsonArray);
}
