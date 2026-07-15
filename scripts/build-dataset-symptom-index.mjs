import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.resolve(__dirname, '../../AyurGenixAI_Dataset_V2_Balanced.csv');
const outPath = path.resolve(__dirname, '../src/data/dataset-v2-symptom-index.json');

const STOP = new Set([
  'the', 'and', 'with', 'from', 'that', 'this', 'have', 'has', 'had',
  'are', 'was', 'were', 'for', 'not', 'but', 'can', 'may', 'your',
  'while', 'when', 'during', 'after', 'before', 'into', 'over', 'under',
  'feeling', 'sensation', 'between', 'both', 'also', 'very', 'some',
]);

function parseCsvLine(line) {
  const row = [];
  let cur = '';
  let inQ = false;
  for (const ch of line) {
    if (ch === '"') {
      inQ = !inQ;
      continue;
    }
    if (ch === ',' && !inQ) {
      row.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  row.push(cur);
  return row;
}

function pick(val) {
  const v = String(val ?? '').trim();
  if (!v || /^none specific$/i.test(v) || /^not specified$/i.test(v)) return '';
  return v;
}

function tokenize(text) {
  return [
    ...new Set(
      String(text ?? '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 2 && !STOP.has(w)),
    ),
  ];
}

const raw = fs.readFileSync(csvPath, 'utf8');
const lines = raw.split(/\r?\n/).filter(Boolean);
const headers = parseCsvLine(lines[0]);
const idx = (name) => headers.indexOf(name);

const rows = [];

for (let i = 1; i < lines.length; i++) {
  const row = parseCsvLine(lines[i]);
  const disease = pick(row[idx('Disease')]);
  const symptoms = pick(row[idx('Symptoms')]);
  if (!disease || !symptoms) continue;

  rows.push({
    id: i,
    disease,
    symptoms,
    symptomsTokens: tokenize(`${disease} ${symptoms}`),
    doshas: pick(row[idx('Doshas')]),
    prakriti: pick(row[idx('Constitution/Prakriti')]),
    severity: pick(row[idx('Symptom Severity')]),
    herbs: pick(row[idx('Ayurvedic Herbs')]),
    formulation: pick(row[idx('Formulation')]),
    dietLifestyle: pick(row[idx('Diet and Lifestyle Recommendations')]),
    patientRecommendations: pick(row[idx('Patient Recommendations')]),
    dietaryHabits: pick(row[idx('Dietary Habits')]),
    prevention: pick(row[idx('Prevention')]),
  });
}

fs.writeFileSync(outPath, JSON.stringify(rows));
console.log(`Wrote ${rows.length} symptom-index rows to dataset-v2-symptom-index.json`);
