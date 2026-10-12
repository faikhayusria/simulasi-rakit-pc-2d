import type { ExportDataPayload } from './to-json';

export function exportToImage(data: ExportDataPayload, filename?: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
  bgGrad.addColorStop(0, '#0a0d14');
  bgGrad.addColorStop(1, '#121824');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 800);

  // Border glow
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, 1160, 760);

  // Header Title
  ctx.fillStyle = '#22d3ee';
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('RAKITPC 2D — HASIL SIMULASI PERAKITAN', 50, 80);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '18px sans-serif';
  ctx.fillText(`Skenario: ${data.scenario.title} | Tanggal: ${data.exportDate}`, 50, 115);

  // Score Box
  ctx.fillStyle = '#182234';
  ctx.fillRect(50, 140, 320, 140);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(50, 140, 320, 140);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px sans-serif';
  ctx.fillText('SKOR EVALUASI', 70, 170);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText(`${data.evaluation.score}/100`, 70, 220);

  ctx.fillStyle = data.evaluation.isCompatible ? '#4ade80' : '#f87171';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(
    data.evaluation.isCompatible ? '✓ 100% KOMPATIBEL' : '✗ ADA MASALAH',
    70,
    255
  );

  // Budget Box
  ctx.fillStyle = '#182234';
  ctx.fillRect(390, 140, 360, 140);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(390, 140, 360, 140);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px sans-serif';
  ctx.fillText('REALISASI ANGGARAN', 410, 170);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(`Rp ${data.budget.total.toLocaleString('id-ID')}`, 410, 205);

  ctx.fillStyle = data.budget.remaining >= 0 ? '#4ade80' : '#f87171';
  ctx.font = '14px sans-serif';
  ctx.fillText(
    `Pagu: Rp ${data.budget.budget.toLocaleString('id-ID')} (${
      data.budget.remaining >= 0
        ? 'Sisa Rp ' + data.budget.remaining.toLocaleString('id-ID')
        : 'Over Rp ' + Math.abs(data.budget.remaining).toLocaleString('id-ID')
    })`,
    410,
    240
  );

  // Components List
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('KOMPONEN TERPASANG', 50, 330);

  let startY = 370;
  const col1X = 50;
  const col2X = 620;

  const entries = Object.entries(data.selectedComponents);
  entries.forEach(([cat, comp], idx) => {
    const isCol2 = idx >= 4;
    const x = isCol2 ? col2X : col1X;
    const y = isCol2 ? startY + (idx - 4) * 85 : startY + idx * 85;

    ctx.fillStyle = '#131d2e';
    ctx.fillRect(x, y - 25, 530, 70);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(x, y - 25, 530, 70);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(cat.toUpperCase(), x + 15, y - 5);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(comp?.name || 'Belum Dipilih', x + 15, y + 20);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.fillText(
      comp ? `Rp ${comp.price.toLocaleString('id-ID')}` : '-',
      x + 390,
      y + 20
    );
  });

  // Footer credit
  ctx.fillStyle = '#64748b';
  ctx.font = '12px sans-serif';
  ctx.fillText(
    'Simulasi RakitPC 2D • Proyek Evaluasi Perangkat Keras Komputer Berbasis Web',
    50,
    750
  );

  const dataUrl = canvas.toDataURL('image/png');
  const anchor = document.createElement('a');
  anchor.download = filename || `RakitPC2D_${data.scenario.id}_${Date.now()}.png`;
  anchor.href = dataUrl;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
