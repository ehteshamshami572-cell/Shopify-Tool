export interface LiquidFormatterResult {
  formatted: string;
  errors: string[];
}

export function formatLiquid(code: string, tabSize: number = 2): LiquidFormatterResult {
  const errors: string[] = [];
  if (!code.trim()) {
    return { formatted: "", errors };
  }

  const indentStr = " ".repeat(tabSize);
  const lines = code.split("\n");
  let formattedLines: string[] = [];
  let indentLevel = 0;

  // Liquid tags that open block scopes
  const openBlockRegex = /\{%\s*(if|unless|for|case|tablerow|paginate|capture|style|javascript|schema|comment)\b[^%]*%\}/i;
  // Liquid tags that close block scopes
  const closeBlockRegex = /\{%\s*end(if|unless|for|case|tablerow|paginate|capture|style|javascript|schema|comment)\b[^%]*%\}/i;
  // Middle block elements that shouldn't change the base indent level but align inside (like else, elseif, when)
  const middleBlockRegex = /\{%\s*(else|elsif|when)\b[^%]*%\}/i;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) {
      formattedLines.push("");
      continue;
    }

    // Check if line closes a block
    const isClosing = closeBlockRegex.test(rawLine);
    const isMiddle = middleBlockRegex.test(rawLine);

    if (isClosing) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    const currentIndent = indentStr.repeat(isMiddle ? Math.max(0, indentLevel - 1) : indentLevel);
    formattedLines.push(currentIndent + rawLine);

    // Check if line opens a block for the NEXT lines
    const isOpening = openBlockRegex.test(rawLine);
    if (isOpening && !isClosing) {
      indentLevel++;
    }
  }

  // Basic syntax validation
  const openTags = (code.match(/\{%/g) || []).length;
  const closeTags = (code.match(/%\}/g) || []).length;
  if (openTags !== closeTags) {
    errors.push(`Mismatched Liquid tag syntax: Found ${openTags} opening '{%' tags and ${closeTags} closing '%}' tags.`);
  }

  const openOutputs = (code.match(/\{\{/g) || []).length;
  const closeOutputs = (code.match(/\}\}/g) || []).length;
  if (openOutputs !== closeOutputs) {
    errors.push(`Mismatched Liquid print syntax: Found ${openOutputs} opening '{{' tags and ${closeOutputs} closing '}}' tags.`);
  }

  return {
    formatted: formattedLines.join("\n"),
    errors,
  };
}
