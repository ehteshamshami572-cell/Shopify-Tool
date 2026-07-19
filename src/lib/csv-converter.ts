export interface CsvParseResult {
  data: any[];
  headers: string[];
  errors: string[];
}

// Custom RFC-compliant CSV parser to handle quotes and comma values correctly
export function parseCsv(csvText: string): CsvParseResult {
  const data: any[] = [];
  const errors: string[] = [];
  const headers: string[] = [];

  if (!csvText.trim()) {
    return { data, headers, errors };
  }

  const lines: string[] = [];
  let currentLine = "";
  let insideQuote = false;

  // Split lines accounting for newlines inside quotes
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      insideQuote = !insideQuote;
      currentLine += char;
    } else if (char === '\n' || char === '\r') {
      if (insideQuote) {
        currentLine += char;
      } else {
        if (char === '\r' && nextChar === '\n') {
          i++; // skip next \n
        }
        lines.push(currentLine);
        currentLine = "";
      }
    } else {
      currentLine += char;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  if (lines.length === 0) {
    return { data, headers, errors };
  }

  // Parse header
  const rawHeaders = parseCsvLine(lines[0]);
  headers.push(...rawHeaders.map(h => h.trim()));

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCsvLine(line);
    if (values.length !== headers.length) {
      errors.push(`Row ${i + 1}: Column count mismatch. Expected ${headers.length} headers, got ${values.length} fields.`);
    }

    const rowObj: Record<string, string> = {};
    headers.forEach((header, index) => {
      rowObj[header] = values[index] !== undefined ? values[index] : "";
    });
    data.push(rowObj);
  }

  return { data, headers, errors };
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let currentVal = "";
  let insideQuote = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        // Escaped quote
        currentVal += '"';
        i++; // skip next quote
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === ',' && !insideQuote) {
      result.push(currentVal);
      currentVal = "";
    } else {
      currentVal += char;
    }
  }
  result.push(currentVal);
  return result;
}

export function jsonToCsv(jsonArray: any[]): string {
  if (!jsonArray || jsonArray.length === 0) return "";

  // Extract all unique headers
  const headers = Array.from(
    new Set(jsonArray.flatMap(obj => Object.keys(obj)))
  );

  const csvRows = [headers.join(",")];

  for (const obj of jsonArray) {
    const values = headers.map(header => {
      const val = obj[header] === undefined || obj[header] === null ? "" : String(obj[header]);
      // Escape quotes and wrap in quotes if contains commas or quotes
      const escaped = val.replace(/"/g, '""');
      if (escaped.includes(",") || escaped.includes('"') || escaped.includes("\n") || escaped.includes("\r")) {
        return `"${escaped}"`;
      }
      return escaped;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}
