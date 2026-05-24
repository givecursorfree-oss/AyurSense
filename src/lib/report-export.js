/**
 * Export clinical report as markdown or trigger print dialog.
 */
export function reportToMarkdown(report) {
  if (!report) return '';

  const lines = [
    '# AyurSense Clinical Report',
    '',
    '> For research and educational clinical decision support only.',
    '',
  ];

  if (report.patient && report.patient !== 'N/A') {
    lines.push(`**Patient:** ${report.patient}`);
  }
  if (report.symptoms && report.symptoms !== 'N/A') {
    lines.push(`**Symptoms:** ${report.symptoms}`);
  }

  lines.push(
    '',
    '## Metrics',
    `- Dosha imbalance: ${report.dosha ?? '—'}`,
    `- Disease severity: ${report.severity ?? '—'}`,
    `- Safe dosage: ${report.dosage ?? '—'}`,
    `- Toxicity: ${report.toxicity ?? '—'}`,
    `- Side effects: ${report.sideEffects ?? '—'}`,
    `- Drug safety: ${report.safety ?? '—'}`,
    '',
    '## Recommended herbs',
  );

  (report.herbs ?? []).forEach((h) => {
    lines.push(`- **${h.name}** (${h.canonical}) — ${h.confidence}`);
  });

  if (report.formulation) {
    lines.push(
      '',
      '## Classical formulation',
      `**${report.formulation.name}** — ${report.formulation.category}`,
      `- Dosage: ${report.formulation.dosage}`,
      `- Anupana: ${report.formulation.anupana}`,
      `- Reference: ${report.formulation.reference}`,
    );
  }

  if (report.interactions?.length) {
    lines.push('', '## Interactions');
    report.interactions.forEach((inter) => {
      lines.push(`- [${inter.type}] ${inter.title}: ${inter.reason}`);
    });
  }

  return lines.join('\n');
}

export async function copyReportMarkdown(report) {
  const md = reportToMarkdown(report);
  await navigator.clipboard.writeText(md);
  return md;
}

export function printReport() {
  window.print();
}
