/**
 * Split compound guidance strings into scannable bullet lines.
 * @param {string[]} items
 * @returns {string[]}
 */
export function expandBulletPoints(items) {
  const out = [];

  (items ?? []).forEach((raw) => {
    const text = String(raw ?? '').trim();
    if (!text) return;

    if (text.includes(';')) {
      text
        .split(';')
        .map((part) => part.trim().replace(/\.\s*$/, ''))
        .filter((part) => part.length > 3)
        .forEach((part) => out.push(part.endsWith('.') ? part : `${part}.`));
      return;
    }

    out.push(text.endsWith('.') ? text : `${text}.`);
  });

  return out;
}
