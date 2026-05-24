import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fontPath =
  process.env.SIGNATURE_FONT ||
  'C:\\WINDOWS\\Fonts\\segoesc.ttf';

const font = opentype.parse(fs.readFileSync(fontPath));

function textToPathData(text, fontSize = 42) {
  const p = font.getPath(text, 0, fontSize * 0.85, fontSize);
  return p.toPathData(2);
}

function bounds(text, fontSize = 42) {
  const p = font.getPath(text, 0, fontSize * 0.85, fontSize);
  const b = p.getBoundingBox();
  return {
    x: b.x1,
    y: b.y1,
    width: b.x2 - b.x1,
    height: b.y2 - b.y1,
  };
}

const team = textToPathData('Team', 38);
const ayurSense = textToPathData('AyurSense', 34);
const teamBounds = bounds('Team', 38);
const ayurBounds = bounds('AyurSense', 34);

const out = `/** Auto-generated signature stroke paths — do not edit by hand */
export const TEAM_SIGNATURE = {
  viewBox: \`0 0 ${Math.ceil(teamBounds.width + 8)} ${Math.ceil(teamBounds.height + 8)}\`,
  paths: [
    { id: 'team', d: ${JSON.stringify(team)}, delay: 0.2, duration: 0.85 },
  ],
};

export const AYURSENSE_SIGNATURE = {
  viewBox: \`0 0 ${Math.ceil(ayurBounds.width + 12)} ${Math.ceil(ayurBounds.height + 8)}\`,
  paths: [
    { id: 'ayursense', d: ${JSON.stringify(ayurSense)}, delay: 0, duration: 2 },
  ],
};
`;

fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'data', 'signature-paths.js'),
  out,
  'utf8',
);

console.log('Wrote src/data/signature-paths.js');
