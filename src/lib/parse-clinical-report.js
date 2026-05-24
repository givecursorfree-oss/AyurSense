/**
 * Parses plain-text clinical reports from AyurGenix V9 API (and legacy V8 layout).
 */

/**
 * @param {string} text
 * @param {string|string[]} labels
 * @returns {string}
 */
function extractField(text, labels) {
  const list = Array.isArray(labels) ? labels : [labels];
  for (const label of list) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const m = text.match(new RegExp(`${escaped}\\s*:\\s*(.+)`, 'i'));
    if (m) return m[1].trim();
  }
  return 'N/A';
}

/**
 * @param {string} block
 * @param {string} key
 * @returns {string}
 */
function extractLabeledLine(block, key) {
  const m = block.match(new RegExp(`${key}\\s*:\\s*(.+)`, 'i'));
  return m ? m[1].trim() : '';
}

/** @param {string} source */
function sanitizeReportSource(source) {
  const value = (source || '').trim();
  if (!value || value === '—' || value === 'N/A') return '';
  if (/randomforest\s+on\s+herb_properties/i.test(value)) return '';
  return value;
}

/**
 * @param {string} sectionBody
 * @returns {{ name: string, confidence: string, canonical: string, preview: string }[]}
 */
function parseHerbs(sectionBody) {
  if (!sectionBody) return [];

  const lines = sectionBody.split('\n');
  const herbs = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(
      /^\s*->\s*(.+?)\s*\(([\d.]+%)\)\s*\[DB:\s*([^\]]+)\]/i
    );
    if (!m) continue;

    let preview = '';
    const next = lines[i + 1];
    if (next && !next.includes('->') && !next.startsWith('---')) {
      preview = next.trim();
      i += 1;
    }

    herbs.push({
      name: m[1].trim(),
      confidence: m[2].trim(),
      canonical: m[3].trim(),
      preview,
    });
  }

  return herbs;
}

/**
 * @param {string} sectionBody
 * @returns {Record<string, string>|null}
 */
function parseFormulation(sectionBody) {
  if (!sectionBody) return null;

  const noMatch = /no direct classical formulation match/i.test(sectionBody);
  if (noMatch) return null;

  const name = extractLabeledLine(sectionBody, 'Name');
  if (!name || name === 'N/A') return null;

  return {
    name,
    category: extractLabeledLine(sectionBody, 'Category') || '—',
    dosage: extractLabeledLine(sectionBody, 'Dosage') || '—',
    anupana: extractLabeledLine(sectionBody, 'Anupana') || '—',
    reference: extractLabeledLine(sectionBody, 'Reference') || '—',
    indications: extractLabeledLine(sectionBody, 'Indications') || '—',
  };
}

/**
 * @param {string} sectionBody
 * @returns {object[]}
 */
function parseInteractions(sectionBody) {
  if (!sectionBody) return [];

  const noneFound =
    /no documented interactions/i.test(sectionBody) ||
    /only one herb recommended/i.test(sectionBody);
  if (noneFound) return [];

  const blocks = sectionBody
    .split(/\n(?=\s*\[(?:OK|WARN|DANGER|\?)\])/i)
    .map((b) => b.trim())
    .filter((b) => /^\[/.test(b) || /^\s*\[/.test(b));

  return blocks.map((block) => {
    const titleLine = block.split('\n')[0]?.trim() ?? '';
    const tagMatch = titleLine.match(/\[(OK|WARN|DANGER|\?)\]/i);
    const tag = tagMatch ? tagMatch[1].toUpperCase() : '?';
    const title = titleLine.replace(/\[(?:OK|WARN|DANGER|\?)\]\s*/i, '').trim();

    const typeLine = extractLabeledLine(block, 'Type');
    const type = typeLine.split('|')[0]?.trim() || 'Unknown';
    const confidence = typeLine.includes('|')
      ? typeLine.split('|').slice(1).join('|').trim()
      : '';

    return {
      tag,
      title,
      type,
      confidence,
      source: sanitizeReportSource(extractLabeledLine(block, 'Source')),
      reference: extractLabeledLine(block, 'Reference') || '',
      reason: extractLabeledLine(block, 'Reason') || '—',
      bodyEffect: extractLabeledLine(block, 'Body effect') || '—',
    };
  });
}

/**
 * @param {string} text
 */
export function parseClinicalReport(text) {
  const patient = extractField(text, 'Patient');
  const symptoms = extractField(text, 'Symptoms');

  const herbsMatch = text.match(
    /---\s*RECOMMENDED HERBS[^\n]*\n([\s\S]*?)(?=\n---|\n={10,})/i
  );
  const formMatch = text.match(
    /---\s*CLASSICAL FORMULATION MATCH[^\n]*\n([\s\S]*?)(?=\n---|\n={10,})/i
  );
  const interMatch = text.match(
    /---\s*HERB-HERB INTERACTIONS[^\n]*\n([\s\S]*?)(?=\n---\s*DISCLAIMER|\n={10,})/i
  );

  const herbs = parseHerbs(herbsMatch?.[1] ?? '');
  const formulation = parseFormulation(formMatch?.[1] ?? '');
  const interactions = parseInteractions(interMatch?.[1] ?? '');

  const safety = extractField(text, [
    'Drug safety',
    'Drug Safety',
  ]);
  const dosageRaw = extractField(text, [
    'Safe dosage (model)',
    'Safe Dosage',
    'Safe dosage',
  ]);

  return {
    patient,
    symptoms,
    dosha: extractField(text, ['Dosha imbalance', 'Dosha Imbalance']),
    severity: extractField(text, ['Disease severity', 'Disease Severity']),
    safety,
    toxicity: extractField(text, ['Toxicity level', 'Toxicity Level']),
    dosage: dosageRaw,
    sideEffects: extractField(text, ['Side effects', 'Side Effects']),
    herbs,
    formulation,
    interactions,
    raw: text,
  };
}
