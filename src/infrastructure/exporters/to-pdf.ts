import type { ExportDataPayload } from './to-json';

export function exportToPrintablePdf(data: ExportDataPayload) {
  const printWindow = window.open('', '_blank', 'width=900,height=900');
  if (!printWindow) {
    alert('Harap izinkan popup browser untuk mencetak/menyimpan PDF.');
    return;
  }

  const categoryNames: Record<string, string> = {
    cpu: 'Prosesor (CPU)',
    motherboard: 'Motherboard',
    ram: 'Memori RAM',
    gpu: 'Kartu Grafis (GPU)',
    storage: 'Media Penyimpanan (SSD)',
    psu: 'Catu Daya (PSU)',
    case: 'Casing PC',
    cooler: 'Pendingin CPU (Cooler)',
  };

  const formatRp = (num: number) =>
    'Rp ' + num.toLocaleString('id-ID');

  const componentRowsHtml = Object.entries(data.selectedComponents)
    .map(([cat, comp]) => {
      if (!comp) return '';
      const catLabel = categoryNames[cat] || cat;
      const rationaleText = data.rationale[cat] || '<em>Tidak ada catatan alasan.</em>';
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${catLabel}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
            <div style="font-weight: bold; color: #0f172a;">${comp.name}</div>
            <div style="font-size: 12px; color: #64748b;">${comp.shortDescription}</div>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600;">${formatRp(comp.price)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #334155;">${rationaleText}</td>
        </tr>
      `;
    })
    .join('');

  const badgesHtml = data.evaluation.badges
    .filter((b) => b.earned)
    .map(
      (b) => `
      <div style="display: inline-block; background: #e0f2fe; color: #0369a1; padding: 6px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-right: 8px; margin-bottom: 8px;">
        ★ ${b.name}: ${b.description}
      </div>
    `
    )
    .join('');

  const attemptsHtml = data.attempts
    .map(
      (a) => `
      <li style="margin-bottom: 6px; font-size: 13px;">
        <strong>Percobaan ${a.attemptNumber}</strong> (${a.timestamp}): 
        Status <span style="color: ${a.passed ? '#16a34a' : '#dc2626'}; font-weight: bold;">${a.passed ? 'Lulus Kompatibel' : 'Ada ' + a.errorCount + ' Error'}</span>.
      </li>
    `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Laporan Hasil RakitPC 2D — ${data.scenario.title}</title>
      <style>
        body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; margin: 40px; line-height: 1.5; }
        .header { border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; }
        .title { font-size: 24px; font-weight: bold; color: #0369a1; margin: 0; }
        .subtitle { font-size: 14px; color: #64748b; margin-top: 4px; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .meta-item { font-size: 14px; }
        .meta-label { font-weight: 600; color: #64748b; }
        .meta-value { font-weight: bold; color: #0f172a; font-size: 15px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th { background: #f1f5f9; padding: 10px; text-align: left; font-size: 13px; text-transform: uppercase; color: #475569; border-bottom: 2px solid #cbd5e1; }
        .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #cbd5e1; font-size: 12px; color: #94a3b8; text-align: center; }
        @media print {
          body { margin: 15mm; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 20px; display: flex; gap: 10px;">
        <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;">
          🖨️ Cetak / Simpan sebagai PDF
        </button>
        <button onclick="window.close()" style="background: #e2e8f0; color: #475569; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer;">
          Tutup
        </button>
      </div>

      <div class="header">
        <h1 class="title">RakitPC 2D — Laporan Hasil Perakitan Komputer</h1>
        <div class="subtitle">Simulasi Interaktif Pemilihan Komponen Komputer dengan Tantangan Kompatibilitas dan Anggaran</div>
      </div>

      <div class="meta-grid">
        <div class="meta-item">
          <div class="meta-label">Skenario Kebutuhan:</div>
          <div class="meta-value">${data.scenario.title}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Tanggal Pelaksanaan:</div>
          <div class="meta-value">${data.exportDate}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Pagu Anggaran Skenario:</div>
          <div class="meta-value">${formatRp(data.budget.budget)}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Total Realisasi Biaya:</div>
          <div class="meta-value">${formatRp(data.budget.total)} (${data.budget.remaining >= 0 ? 'Sisa ' + formatRp(data.budget.remaining) : 'Melebihi ' + formatRp(Math.abs(data.budget.remaining))})</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Skor Akhir:</div>
          <div class="meta-value" style="color: #0284c7; font-size: 18px;">${data.evaluation.score} / 100</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Predikat Evaluasi:</div>
          <div class="meta-value">${data.evaluation.verdict}</div>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="margin-top: 0; color: #1e293b;">Pencapaian & Lencana:</h3>
        <div>${badgesHtml || '<em>Belum ada lencana yang diraih.</em>'}</div>
      </div>

      <h3 style="color: #1e293b;">Daftar Komponen Terpilih & Analisis Rasionalisasi</h3>
      <table>
        <thead>
          <tr>
            <th style="width: 18%;">Kategori</th>
            <th style="width: 32%;">Komponen</th>
            <th style="width: 15%; text-align: right;">Harga</th>
            <th style="width: 35%;">Alasan Pemilihan</th>
          </tr>
        </thead>
        <tbody>
          ${componentRowsHtml}
        </tbody>
      </table>

      <h3 style="color: #1e293b;">Riwayat Pemeriksaan Ulang (Attempts)</h3>
      <ul style="padding-left: 20px;">
        ${attemptsHtml || '<li>Tidak ada catatan percobaan.</li>'}
      </ul>

      <div class="footer">
        Dokumen ini dibuat secara otomatis oleh sistem simulasi pembelajaran RakitPC 2D (Local-First Architecture).
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
