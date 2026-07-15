/**
 * Structured Ayurvedic clinical prescription PDF (AyurSense).
 * Layout inspired by professional diagnostic report templates.
 */

import { MEDICAL_DISCLAIMER, MODEL_NAME, PRODUCT_NAME } from '@/data/brand-copy';
import { getSymptomAwareTreatmentGuidance } from '@/data/dataset-v2-guidance';
import {
  filterDisplayFoods,
  formatDoshaLabel,
  foodItemDisplay,
  generateDietPlan,
  normalizeDoshas,
} from '@/data/natural-food-recommendations';

const COLORS = {
  ink: [26, 42, 38],
  inkMuted: [90, 100, 96],
  accent: [140, 105, 60],
  accentDark: [55, 80, 52],
  panelBg: [245, 240, 232],
  panelBorder: [210, 198, 180],
  white: [255, 255, 255],
  danger: [140, 55, 45],
  safe: [45, 110, 70],
};

function createReportId() {
  const t = Date.now().toString(36).toUpperCase();
  return `RPT-${t.slice(-8)}`;
}

function wrapLines(doc, text, maxWidth) {
  return doc.splitTextToSize(String(text ?? ''), maxWidth);
}

function setColor(doc, [r, g, b]) {
  doc.setTextColor(r, g, b);
}

function setDrawColor(doc, [r, g, b]) {
  doc.setDrawColor(r, g, b);
}

function setFillColor(doc, [r, g, b]) {
  doc.setFillColor(r, g, b);
}

/** @param {string} foodLine */
function parseFoodLine(foodLine) {
  const raw = String(foodLine ?? '').trim();
  const colon = raw.indexOf(':');
  if (colon > 0 && colon < 60) {
    return {
      title: raw.slice(0, colon).trim(),
      detail: raw.slice(colon + 1).trim(),
    };
  }
  return { title: raw, detail: '' };
}

/**
 * @param {import('jspdf').jsPDF} doc
 */
function drawPageFooter(doc, pageNum, pageCount, marginX, pageWidth) {
  const pageHeight = doc.internal.pageSize.getHeight();
  const y = pageHeight - 14;

  setDrawColor(doc, COLORS.panelBorder);
  doc.setLineWidth(0.3);
  doc.line(marginX, y - 4, pageWidth - marginX, y - 4);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  setColor(doc, COLORS.accentDark);
  doc.text(PRODUCT_NAME, marginX, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  setColor(doc, COLORS.inkMuted);
  const footerMid = `${MODEL_NAME} Clinical Release · Educational use only`;
  doc.text(footerMid, pageWidth / 2, y, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.text(`${pageNum} / ${pageCount}`, pageWidth - marginX, y, { align: 'right' });
}

/**
 * @param {import('jspdf').jsPDF} doc
 */
function drawReportHeader(doc, marginX, pageWidth, reportId, subtitle) {
  let y = 14;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  setColor(doc, COLORS.ink);
  doc.text('AYURVEDIC CLINICAL REPORT', marginX, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  setColor(doc, COLORS.inkMuted);
  doc.text(subtitle, marginX, y + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  setColor(doc, COLORS.accent);
  doc.text(`Report ID: ${reportId}`, pageWidth - marginX, y, { align: 'right' });

  y += 12;
  setDrawColor(doc, COLORS.accent);
  doc.setLineWidth(0.8);
  doc.line(marginX, y, pageWidth - marginX, y);

  return y + 6;
}

/**
 * @param {import('jspdf').jsPDF} doc
 */
function drawMetaGrid(doc, x, y, w, rows) {
  const colW = w / 4;
  const rowH = 14;

  setFillColor(doc, COLORS.panelBg);
  setDrawColor(doc, COLORS.panelBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, w, rowH + 8, 2, 2, 'FD');

  rows.forEach((cell, i) => {
    const cx = x + i * colW + 3;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    setColor(doc, COLORS.inkMuted);
    doc.text(cell.label.toUpperCase(), cx, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    setColor(doc, COLORS.ink);
    const lines = wrapLines(doc, cell.value, colW - 6);
    doc.text(lines.slice(0, 2), cx, y + 10);
  });

  return y + rowH + 12;
}

/**
 * @param {import('jspdf').jsPDF} doc
 */
function drawHighlightPanel(doc, x, y, w, h, label, value, subtext) {
  setFillColor(doc, COLORS.white);
  setDrawColor(doc, COLORS.panelBorder);
  doc.setLineWidth(0.4);
  doc.roundedRect(x, y, w, h, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  setColor(doc, COLORS.inkMuted);
  doc.text(label.toUpperCase(), x + 4, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  setColor(doc, COLORS.accentDark);
  const valueLines = wrapLines(doc, value, w - 8);
  doc.text(valueLines.slice(0, 2), x + 4, y + 14);

  if (subtext) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    setColor(doc, COLORS.inkMuted);
    const subLines = wrapLines(doc, subtext, w - 8);
    doc.text(subLines.slice(0, 3), x + 4, y + h - 6 - subLines.length * 3.2);
  }
}

/**
 * @param {import('jspdf').jsPDF} doc
 */
function drawSectionTitle(doc, x, y, title) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  setColor(doc, COLORS.ink);
  doc.text(title.toUpperCase(), x, y);
  setDrawColor(doc, COLORS.panelBorder);
  doc.setLineWidth(0.25);
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.line(x, y + 1.5, pageWidth - x, y + 1.5);
  return y + 6;
}

/**
 * @param {import('jspdf').jsPDF} doc
 */
function drawBody(doc, x, y, text, maxWidth, fontSize = 9) {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fontSize);
  setColor(doc, COLORS.ink);
  const lines = wrapLines(doc, text, maxWidth);
  lines.forEach((line, i) => {
    doc.text(line, x, y + i * 4.2);
  });
  return y + lines.length * 4.2;
}

/**
 * @param {import('jspdf').jsPDF} doc
 * @param {string[]} items
 */
function addBulletList(doc, x, y, items, maxWidth, lineHeight = 4) {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  setColor(doc, COLORS.ink);

  let cy = y;
  (items ?? []).forEach((item) => {
    const lines = wrapLines(doc, `• ${String(item ?? '')}`, maxWidth);
    lines.forEach((line) => {
      doc.text(line, x, cy);
      cy += lineHeight;
    });
  });
  return cy;
}

/**
 * @param {import('jspdf').jsPDF} doc
 */
function drawNoticeBox(doc, x, y, w, text) {
  const lines = wrapLines(doc, text, w - 10);
  const h = 10 + lines.length * 4;

  setFillColor(doc, COLORS.panelBg);
  setDrawColor(doc, COLORS.accent);
  doc.setLineWidth(0.5);
  doc.roundedRect(x, y, w, h, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  setColor(doc, COLORS.accentDark);
  doc.text('IMPORTANT NOTICE', x + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  setColor(doc, COLORS.ink);
  lines.forEach((line, i) => {
    doc.text(line, x + 5, y + 11 + i * 4);
  });

  return y + h + 4;
}

/**
 * @param {import('jspdf').jsPDF} doc
 */
function drawNumberedFoodCard(doc, x, y, w, index, title, detail, doshaTag) {
  const cardH = detail ? 16 : 12;

  setFillColor(doc, COLORS.white);
  setDrawColor(doc, COLORS.panelBorder);
  doc.setLineWidth(0.25);
  doc.roundedRect(x, y, w, cardH, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  setColor(doc, COLORS.accent);
  doc.text(String(index).padStart(2, '0'), x + 4, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  setColor(doc, COLORS.ink);
  doc.text(title, x + 14, y + 7);

  if (doshaTag) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    setColor(doc, COLORS.inkMuted);
    doc.text(doshaTag, x + w - 4, y + 7, { align: 'right' });
  }

  if (detail) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    setColor(doc, COLORS.inkMuted);
    const detailLines = wrapLines(doc, detail, w - 18);
    doc.text(detailLines.slice(0, 2), x + 14, y + 11.5);
  }

  return y + cardH + 3;
}

/**
 * @param {object} args
 */
export async function downloadAyurvedicPrescriptionPdf({
  patient,
  age,
  gender,
  season,
  doshaText,
  severity,
  safeDosage,
  toxicity,
  sideEffects,
  drugSafety,
  symptoms,
  herbs,
  formulation,
  foodRecommendations,
  enrichment,
  primaryMatch,
  formulationMeta,
}) {
  const jspdfMod = await import('jspdf');
  const JsPDFCtor =
    jspdfMod.jsPDF ?? jspdfMod.default?.jsPDF ?? jspdfMod.default;
  const doc = new JsPDFCtor({ format: 'a4', unit: 'mm' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 14;
  const contentW = pageWidth - marginX * 2;
  const reportId = createReportId();

  const now = new Date();
  const dateStr = now.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
  });

  const patientName =
    patient && patient !== 'N/A' ? String(patient) : 'Clinical intake';
  const doshaDisplay = doshaText && doshaText !== 'N/A' ? doshaText : '—';
  const parsedDoshas = normalizeDoshas(doshaText);
  const alignedDoshas =
    parsedDoshas.length > 0 ? parsedDoshas : ['Vata', 'Pitta', 'Kapha'];
  const dietPlan = generateDietPlan({
    doshas: alignedDoshas,
    season,
    symptoms,
    primaryMatch: primaryMatch ?? enrichment?.primaryMatch,
  });
  const datasetGuidance = getSymptomAwareTreatmentGuidance({
    doshas: alignedDoshas,
    symptoms,
    primaryMatch: primaryMatch ?? enrichment?.primaryMatch,
  });

  // ─── Page 1: Diagnostic / clinical report ───────────────────────────────
  let y = drawReportHeader(
    doc,
    marginX,
    pageWidth,
    reportId,
    `${PRODUCT_NAME} · ${MODEL_NAME} — Intelligent Ayurvedic Clinical Analysis`,
  );

  y = drawMetaGrid(doc, marginX, y, contentW, [
    { label: 'Patient file', value: patientName },
    { label: 'Report date', value: dateStr },
    { label: 'Season (Ritu)', value: season ?? '—' },
    { label: 'Gender', value: gender ?? '—' },
  ]);

  const panelW = (contentW - 4) / 2;
  drawHighlightPanel(
    doc,
    marginX,
    y,
    panelW,
    28,
    'Primary dosha assessment',
    doshaDisplay,
    `Age ${age ?? '—'} · ${gender ?? '—'}`,
  );
  drawHighlightPanel(
    doc,
    marginX + panelW + 4,
    y,
    panelW,
    28,
    'Disease severity',
    severity && severity !== 'N/A' ? severity : '—',
    `Drug safety: ${drugSafety && drugSafety !== 'N/A' ? drugSafety : '—'}`,
  );
  y += 34;

  y = drawSectionTitle(doc, marginX, y, 'Clinical directive');
  const directive = [
    `Dosha imbalance identified: ${doshaDisplay}.`,
    severity && severity !== 'N/A' ? `Severity band: ${severity}.` : '',
    'Review recommended herbs and interaction flags before any self-administration.',
    'Your personalized diet plan follows on later pages.',
  ]
    .filter(Boolean)
    .join(' ');
  y = drawBody(doc, marginX, y, directive, contentW) + 4;

  if (symptoms && symptoms !== 'N/A') {
    y = drawSectionTitle(doc, marginX, y, 'Presenting symptoms (summary)');
    const symptomClean = String(symptoms)
      .replace(/\n\nPredominant pattern:[\s\S]*$/i, '')
      .trim();
    y = drawBody(doc, marginX, y, symptomClean.slice(0, 400), contentW, 8) + 4;
  }

  if (primaryMatch?.disease || enrichment?.primaryMatch?.disease) {
    const match = primaryMatch ?? enrichment.primaryMatch;
    y = drawSectionTitle(doc, marginX, y, 'Dataset condition match');
    y = drawBody(
      doc,
      marginX,
      y,
      `${match.disease} — ${match.symptoms}`.slice(0, 420),
      contentW,
      8,
    ) + 4;
  }

  const redFlags = enrichment?.redFlags ?? [];
  if (redFlags.length > 0) {
    y = drawSectionTitle(doc, marginX, y, 'Clinical safety notice');
    y = drawBody(
      doc,
      marginX,
      y,
      redFlags.map((f) => `${f.title}: ${f.message}`).join(' ').slice(0, 500),
      contentW,
      8,
    ) + 4;
  }

  y = drawSectionTitle(doc, marginX, y, 'Clinical metrics');
  const metrics = [
    ['Safe dosage (model)', safeDosage],
    ['Toxicity level', toxicity],
    ['Side effects', sideEffects],
    ['Drug safety', drugSafety],
  ];
  const metricColW = contentW / 2;
  metrics.forEach(([label, val], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const mx = marginX + col * metricColW;
    const my = y + row * 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    setColor(doc, COLORS.inkMuted);
    doc.text(String(label).toUpperCase(), mx, my);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    setColor(doc, COLORS.ink);
    doc.text(String(val ?? '—').slice(0, 80), mx, my + 4);
  });
  y += 24;

  y = drawSectionTitle(doc, marginX, y, 'Recommended botanical profile');
  const herbList = Array.isArray(herbs) ? herbs.slice(0, 6) : [];
  if (herbList.length === 0) {
    y = drawBody(doc, marginX, y, 'No herbs returned for this intake.', contentW, 8) + 2;
  } else {
    herbList.forEach((h, i) => {
      const canonical =
        h.canonical && h.canonical !== 'N/A' ? ` · ${h.canonical}` : '';
      const line = `${String(i + 1).padStart(2, '0')}  ${h.name ?? '—'}${canonical}  —  ${h.confidence ?? ''}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      setColor(doc, COLORS.ink);
      doc.text(line.slice(0, 95), marginX + 2, y);
      y += 5;
    });
    y += 2;
  }

  if (formulation?.name) {
    y = drawSectionTitle(doc, marginX, y, 'Classical formulation match');
    const formBlock = [
      formulation.name,
      formulation.category ? `Category: ${formulation.category}` : '',
      formulation.dosage ? `Dosage: ${formulation.dosage}` : '',
      formulation.anupana ? `Anupana: ${formulation.anupana}` : '',
    ]
      .filter(Boolean)
      .join(' · ');
    y = drawBody(doc, marginX, y, formBlock, contentW, 8) + 2;
  } else if (formulationMeta?.rejectReason) {
    y = drawSectionTitle(doc, marginX, y, 'Classical formulation (filtered)');
    const alt = formulationMeta.datasetAlternative
      ? ` Dataset alternative: ${formulationMeta.datasetAlternative}.`
      : '';
    y = drawBody(
      doc,
      marginX,
      y,
      `Model suggestion ${formulationMeta.rejectedName ?? '—'} hidden: ${formulationMeta.rejectReason}.${alt}`,
      contentW,
      8,
    ) + 2;
  }

  // ─── Page 2: Dietary prescription ─────────────────────────────────────
  doc.addPage();
  y = drawReportHeader(
    doc,
    marginX,
    pageWidth,
    reportId,
    'Dietary prescription — natural foods (Ahara)',
  );

  y = drawSectionTitle(doc, marginX, y, 'Dosha-rated natural foods');
  y = drawBody(
    doc,
    marginX,
    y,
    `Based on dosha assessment: ${doshaDisplay}. Foods are rated by Vata, Pitta, and Kapha alignment only.`,
    contentW,
    9,
  );
  y += 4;

  if (
    datasetGuidance.dietLifestyle.length ||
    datasetGuidance.yogaTherapy.length ||
    datasetGuidance.patientRecommendations.length
  ) {
    y = drawSectionTitle(doc, marginX, y, 'Treatment approaches');
    if (datasetGuidance.dietLifestyle.length) {
      y = drawBody(doc, marginX, y, 'Diet & lifestyle:', contentW, 8);
      y = addBulletList(doc, marginX, y, datasetGuidance.dietLifestyle, contentW, 5) + 2;
    }
    if (datasetGuidance.patientRecommendations.length) {
      y = drawBody(doc, marginX, y, 'Patient recommendations:', contentW, 8);
      y =
        addBulletList(
          doc,
          marginX,
          y,
          datasetGuidance.patientRecommendations,
          contentW,
          4,
        ) + 4;
    }
  }

  y = drawSectionTitle(doc, marginX, y, 'Recommended foods by dosha');

  /** @type {{ title: string, detail: string, dosha: string }[]} */
  const allFoods = [];
  (foodRecommendations ?? []).forEach(({ dosha, foods }) => {
    filterDisplayFoods(foods ?? []).forEach((line) => {
      const parsed =
        typeof line === 'string'
          ? parseFoodLine(line)
          : {
              title: line.label,
              detail: [line.benefit, line.source].filter(Boolean).join(' · '),
            };
      allFoods.push({
        ...parsed,
        dosha: formatDoshaLabel(dosha),
      });
    });
  });

  let foodIndex = 1;
  for (const item of allFoods) {
    if (y > pageHeight - 45) {
      doc.addPage();
      y = drawReportHeader(
        doc,
        marginX,
        pageWidth,
        reportId,
        'Dietary prescription (continued)',
      );
      y += 4;
    }
    y = drawNumberedFoodCard(
      doc,
      marginX,
      y,
      contentW,
      foodIndex,
      item.title,
      item.detail,
      item.dosha,
    );
    foodIndex += 1;
  }

  if (allFoods.length === 0) {
    y = drawBody(
      doc,
      marginX,
      y,
      'No dosha-aligned foods could be derived. Re-run analysis or verify dosha output from the model.',
      contentW,
    );
  }

  // ─── Page 3: Personalized diet plan ───────────────────────────────────
  doc.addPage();
  y = drawReportHeader(
    doc,
    marginX,
    pageWidth,
    reportId,
    'Personalized diet plan',
  );

  y = drawSectionTitle(doc, marginX, y, 'Plan overview');
  y = drawBody(
    doc,
    marginX,
    y,
    `Aligned constitution(s): ${alignedDoshas.map(formatDoshaLabel).join(', ')}. Season: ${season ?? '—'}.`,
    contentW,
    8,
  );
  y += 3;

  y = drawSectionTitle(doc, marginX, y, 'Do\'s');
  y = addBulletList(doc, marginX, y, dietPlan.globalDos, contentW, 4) + 2;

  y = drawSectionTitle(doc, marginX, y, 'Don\'ts');
  y = addBulletList(doc, marginX, y, dietPlan.globalDonts, contentW, 4) + 4;

  const mealBlocks = [
    ['MORNING', (dietPlan.mealSuggestions.morning ?? []).map(foodItemDisplay)],
    ['MIDDAY', (dietPlan.mealSuggestions.midday ?? []).map(foodItemDisplay)],
    ['EVENING', (dietPlan.mealSuggestions.evening ?? []).map(foodItemDisplay)],
  ];

  y = drawSectionTitle(doc, marginX, y, 'Suggested meals');
  mealBlocks.forEach(([label, items]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    setColor(doc, COLORS.inkMuted);
    doc.text(label, marginX, y);
    y = addBulletList(doc, marginX + 2, y + 3, items, contentW - 2, 3.5);
  });

  y += 4;
  if (y > pageHeight - 50) {
    doc.addPage();
    y = 20;
  }

  drawNoticeBox(
    doc,
    marginX,
    y,
    contentW,
    `${MEDICAL_DISCLAIMER} Dietary lists combine classical Ayurvedic dosha food guidance with practical, generalized wellness items. They are not individualized medical nutrition therapy. Consult a qualified Ayurvedic practitioner or registered dietitian before significant dietary changes.`,
  );

  const pageCount = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p += 1) {
    doc.setPage(p);
    drawPageFooter(doc, p, pageCount, marginX, pageWidth);
  }

  const safePatient = patientName.replace(/[^\w.-]+/g, '_').slice(0, 24);
  const fileName = `${PRODUCT_NAME}_Clinical_Prescription_${safePatient}_${reportId}.pdf`;
  doc.save(fileName);
}
