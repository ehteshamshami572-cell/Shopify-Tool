export interface JsonFormatterResult {
  formatted: string;
  isValid: boolean;
  error?: string;
  sizeBytes?: number;
}

export function formatJson(jsonStr: string, indent: number = 2): JsonFormatterResult {
  if (!jsonStr.trim()) {
    return { formatted: "", isValid: true };
  }

  try {
    const parsed = JSON.parse(jsonStr);
    const formatted = JSON.stringify(parsed, null, indent);
    return {
      formatted,
      isValid: true,
      sizeBytes: new Blob([formatted]).size,
    };
  } catch (err: any) {
    return {
      formatted: jsonStr,
      isValid: false,
      error: err.message,
    };
  }
}

export function minifyJson(jsonStr: string): JsonFormatterResult {
  if (!jsonStr.trim()) {
    return { formatted: "", isValid: true };
  }

  try {
    const parsed = JSON.parse(jsonStr);
    const formatted = JSON.stringify(parsed);
    return {
      formatted,
      isValid: true,
      sizeBytes: new Blob([formatted]).size,
    };
  } catch (err: any) {
    return {
      formatted: jsonStr,
      isValid: false,
      error: err.message,
    };
  }
}
