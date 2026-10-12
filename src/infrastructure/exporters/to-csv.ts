import type { ExportDataPayload } from './to-json';

export function exportToCsv(data: ExportDataPayload, filename?: string) {
  const rows: string[][] = [
    ['LAPORAN HASIL PERAKITAN PC — RAKITPC 2D'],
    ['Waktu Ekspor', data.exportDate],
    ['Skenario', data.scenario.title],
    ['Pagu Anggaran', `Rp ${data.budget.budget.toLocaleString('id-ID')}`],
    ['Total Biaya', `Rp ${data.budget.total.toLocaleString('id-ID')}`],
    ['Sisa Anggaran', `Rp ${data.budget.remaining.toLocaleString('id-ID')}`],
    ['Skor Akhir', `${data.evaluation.score} / 100`],
    ['Status Kompatibilitas', data.evaluation.isCompatible ? 'LULUS' : 'GAGAL'],
    ['Status Anggaran', data.evaluation.isWithinBudget ? 'DALAM PAGU' : 'MELEBIHI PAGU'],
    [''],
    ['RINCIAN KOMPONEN DAN ALASAN PEMILIHAN'],
    ['Kategori', 'Nama Komponen', 'Harga (IDR)', 'Alasan Pemilihan (Rasionalisasi)'],
  ];

  const categoryNames: Record<string, string> = {
    cpu: 'Prosesor (CPU)',
    motherboard: 'Motherboard',
    ram: 'Memori RAM',
    gpu: 'Kartu Grafis (GPU)',
    storage: 'Penyimpanan (SSD)',
    psu: 'Catu Daya (PSU)',
    case: 'Casing',
    cooler: 'Pendingin CPU',
  };

  for (const [cat, comp] of Object.entries(data.selectedComponents)) {
    if (comp) {
      const catLabel = categoryNames[cat] || cat;
      const rationaleText = (data.rationale[cat] || '-').replace(/"/g, '""');
      rows.push([
        catLabel,
        `"${comp.name}"`,
        `Rp ${comp.price.toLocaleString('id-ID')}`,
        `"${rationaleText}"`,
      ]);
    }
  }

  rows.push(['']);
  rows.push(['RIWAYAT PERCOBAAN PEMERIKSAAN']);
  rows.push(['Percobaan Ke', 'Waktu', 'Status', 'Jumlah Error', 'Jumlah Peringatan']);

  data.attempts.forEach((att) => {
    rows.push([
      `Percobaan ${att.attemptNumber}`,
      att.timestamp,
      att.passed ? 'Lulus' : 'Ada Masalah',
      String(att.errorCount),
      String(att.warningCount),
    ]);
  });

  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' +
    rows.map((row) => row.join(',')).join('\r\n');

  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', encodeURI(csvContent));
  downloadAnchor.setAttribute(
    'download',
    filename || `Laporan_RakitPC2D_${data.scenario.id}_${Date.now()}.csv`
  );
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
