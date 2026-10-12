# Catatan Keputusan Arsitektur (Architectural Decision Records)

Dokumen ini mendokumentasikan keputusan teknis dan arsitektur untuk proyek **RakitPC 2D**.

---

## ADR-001: Pilihan Arsitektur SPA Local-First Tanpa Backend
- **Tanggal:** 2026-09-30
- **Status:** Diterima
- **Konteks:** Proyek ini bertujuan sebagai media simulasi edukasi perakitan PC dengan fokus pada pengujian kompatibilitas perangkat keras dan anggaran. Pada tahap MVP, pengguna adalah mahasiswa atau siswa yang melakukan pengujian mandiri tanpa kebutuhan sinkronisasi multipengguna secara langsung.
- **Keputusan:** Menggunakan model arsitektur Single Page Application (SPA) berbasis React + Vite yang sepenuhnya *local-first*. Seluruh basis data komponen, skenario, dan aturan kompatibilitas disimpan dalam format JSON statis yang divalidasi oleh Zod. State pengguna disimpan di browser menggunakan `localStorage` melalui Zustand middleware `persist`.
- **Konsekuensi Positif:**
  - Zero server cost dan zero latency.
  - Privasi data pengguna 100% terjaga (tidak ada transmisi data pribadi ke server).
  - Kemudahan deployment ke static web hosting (Vercel, Netlify, Cloudflare Pages, GitHub Pages).
  - Tahan terhadap gangguan koneksi internet (offline-capable).
- **Konsekuensi Negatif:** Data hanya tersimpan di browser lokal perangkat terkait kecuali diekspor (JSON/CSV/PDF).

---

## ADR-002: Pemisahan Domain Core (Pure TypeScript) dari UI
- **Tanggal:** 2026-09-30
- **Status:** Diterima
- **Konteks:** Aturan kompatibilitas perangkat keras (socket, RAM, dimensi fisik, PSU watt, TDP, antarmuka storage) harus dapat diaudit oleh ahli materi dan diuji secara independen tanpa ketergantungan pada React, DOM, atau UI lifecycle.
- **Keputusan:** Seluruh logika evaluasi kompatibilitas, kalkulasi anggaran, dan generator umpan balik diimplementasikan sebagai fungsi murni (*pure functions*) di dalam direktori `src/domain/`. Domain core dilarang mengimpor React, Zustand, atau browser API.
- **Konsekuensi Positif:**
  - 100% unit-testable dengan pengujian cepat menggunakan Vitest.
  - Ahli materi dapat meninjau logika kompatibilitas dengan mudah.
  - Perubahan aturan di masa depan tidak berdampak pada komponen UI.

---

## ADR-003: Model Komponen 2D dan Interaksi Ganda (Drag & Drop + Click/Keyboard)
- **Tanggal:** 2026-09-30
- **Status:** Diterima
- **Konteks:** Interaksi seret dan lepas (Drag & Drop) memberikan pengalaman simulasi merakit fisik yang imersif, namun seringkali sulit diakses oleh pengguna perangkat layar sentuh (mobile/tablet) atau pengguna pembaca layar/keyboard.
- **Keputusan:** Implementasi interaksi ganda:
  1. Interaksi visual Drag & Drop interaktif untuk pengguna desktop mouse.
  2. Interaksi langsung *Click-to-Select* / *Keyboard Navigation* yang intuitif untuk setiap slot dan kartu komponen.
- **Konsekuensi Positif:** Memenuhi standar aksesibilitas WCAG AA dan nyaman digunakan di berbagai ukuran layar.

---

## ADR-004: Strategi Ekspor Hasil Multi-Format
- **Tanggal:** 2026-09-30
- **Status:** Diterima
- **Konteks:** Hasil rakitan dan catatan rasionalisasi pengguna harus dapat didokumentasikan untuk keperluan tugas perkuliahan, evaluasi riset, atau bukti uji fungsi.
- **Keputusan:** Menyediakan 4 opsi ekspor:
  1. **JSON:** Data mentah lengkap dengan struktur terstandar untuk analisis data peneliti.
  2. **CSV:** Ringkasan tabular komponen, harga, dan alasan pemilihan.
  3. **PDF / Cetak Laporan:** Dokumen formal berformat rapi siap cetak/simpan ke PDF.
  4. **PNG / Gambar:** Visualisasi visual rakitan PC 2D beserta ringkasan spesifikasi.
