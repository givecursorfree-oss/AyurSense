import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.resolve(__dirname, '../../AyurGenixAI_Dataset_V2_Balanced.csv');
const outPath = path.resolve(__dirname, '../src/data/dataset-v2-dosha-guidance.json');

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

function normDoshaKey(doshas) {
  const t = String(doshas ?? '').toLowerCase();
  const out = [];
  if (t.includes('vata')) out.push('Vata');
  if (t.includes('pitta')) out.push('Pitta');
  if (t.includes('kapha')) out.push('Kapha');
  return out.length ? out.join('-') : 'General';
}

function pick(val) {
  const v = String(val ?? '').trim();
  if (!v || /^none specific$/i.test(v) || /^not specified$/i.test(v)) return null;
  return v;
}

const raw = fs.readFileSync(csvPath, 'utf8');
const lines = raw.split(/\r?\n/).filter(Boolean);
const headers = parseCsvLine(lines[0]);
const idx = (name) => headers.indexOf(name);

const byDosha = {};

for (let i = 1; i < lines.length; i++) {
  const row = parseCsvLine(lines[i]);
  const key = normDoshaKey(row[idx('Doshas')]);
  if (!byDosha[key]) {
    byDosha[key] = {
      diet: new Set(),
      yoga: new Set(),
      patient: new Set(),
      habits: new Set(),
    };
  }
  const diet = pick(row[idx('Diet and Lifestyle Recommendations')]);
  const yoga = pick(row[idx('Yoga & Physical Therapy')]);
  const patient = pick(row[idx('Patient Recommendations')]);
  const habits = pick(row[idx('Dietary Habits')]);
  if (diet) byDosha[key].diet.add(diet);
  if (yoga) byDosha[key].yoga.add(yoga);
  if (patient) byDosha[key].patient.add(patient);
  if (habits) byDosha[key].habits.add(habits);
}

const out = {};
for (const [k, v] of Object.entries(byDosha)) {
  out[k] = {
    dietLifestyle: [...v.diet].slice(0, 30),
    yogaTherapy: [...v.yoga].slice(0, 30),
    patientRecommendations: [...v.patient].slice(0, 30),
    dietaryHabits: [...v.habits].slice(0, 15),
  };
}

fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`Wrote ${Object.keys(out).length} dosha keys to dataset-v2-dosha-guidance.json`);
