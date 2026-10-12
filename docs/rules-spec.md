# Spesifikasi Aturan Kompatibilitas & Anggaran (Rules Spec)

Dokumen ini disusun untuk telaah dan audit ahli materi (dosen/ahli perangkat keras).

---

## 1. Daftar Aturan Kompatibilitas

| ID Aturan | Nama Aturan | Tingkat Keparahan | Kategori Terkait | Logika Validasi | Pesan Edukatif untuk Pengguna |
|---|---|---|---|---|---|
| **R-SOCKET-01** | Kesesuaian Socket CPU & Motherboard | `error` | CPU, Motherboard | `cpu.specs.socket === motherboard.specs.socket` | Socket CPU harus sama dengan socket pada motherboard agar pin prosesor dapat terpasang dengan tepat dan tidak bengkok/rusak. |
| **R-RAM-01** | Kompatibilitas Generasi Memori RAM | `error` | RAM, Motherboard | `ram.specs.type === motherboard.specs.ramType` | Tipe RAM (DDR4 atau DDR5) harus sesuai dengan slot pada motherboard. Bentuk fisik notch pada DDR4 dan DDR5 berbeda sehingga tidak dapat saling ditukar. |
| **R-FORM-01** | Dukungan Form Factor Motherboard di Casing | `error` | Motherboard, Case | `case.specs.supportedFormFactors.includes(motherboard.specs.formFactor)` | Ukuran fisik motherboard (misal ATX) tidak boleh melebihi kapasitas form factor yang didukung oleh casing komputer. |
| **R-GPU-01** | Batas Panjang Maksimal Kartu Grafis (GPU) | `error` | GPU, Case | `gpu.specs.lengthMM <= case.specs.maxGpuLengthMM` | Panjang fisik kartu grafis melebihi ruang horizontal yang tersedia di dalam casing komputer. |
| **R-COOL-01** | Kompatibilitas Braket Pendingin CPU | `error` | Cooler, CPU | `cooler.specs.socketSupport.includes(cpu.specs.socket)` | Dudukan pendingin (cooler bracket) harus mendukung tipe socket prosesor yang dipasang. |
| **R-COOL-02** | Batas Ketinggian Pendingin CPU (Cooler Height) | `error` | Cooler, Case | `cooler.specs.heightMM <= case.specs.maxCoolerHeightMM` | Tinggi pendingin CPU melebihi batas clearance pendingin pada casing sehingga panel samping casing tidak akan bisa ditutup. |
| **R-COOL-03** | Kapasitas Pendinginan Termal (TDP) | `warning` | Cooler, CPU | `cooler.specs.tdpSupport >= cpu.specs.tdp` | Kapasitas pendinginan (TDP) cooler lebih rendah dari panas yang dihasilkan prosesor (CPU TDP). Komputer berisiko mengalami *thermal throttling*. |
| **R-PSU-01** | Kecukupan Daya Catu Daya (PSU Wattage) | `error` / `warning` | PSU, CPU, GPU | Total TDP CPU + GPU + Sistem Margin (100W) <= `psu.specs.wattage` | Daya PSU tidak mencukupi kebutuhan konsumsi daya puncak prosesor, kartu grafis, dan komponen lainnya. Sistem dapat mati mendadak saat beban kerja tinggi. |
| **R-PSU-02** | Ketersediaan Konektor Daya Eksternal GPU | `error` | PSU, GPU | `psu.specs.pcieConnectors` memenuhi kebutuhan `gpu.specs.powerConnector` | Kartu grafis membutuhkan konektor daya tambahan (misal 8-pin PCIe) yang tidak disediakan oleh unit catu daya (PSU). |
| **R-STOR-01** | Dukungan Antarmuka Media Penyimpanan | `error` | Storage, Motherboard | Jika storage bertipe `M.2 NVMe`, maka `motherboard.specs.m2Slots > 0` | Antarmuka media penyimpanan (M.2 NVMe) membutuhkan slot M.2 khusus pada motherboard yang tidak tersedia. |
| **R-COMP-01** | Kelengkapan Komponen Inti Komputer | `error` (saat submit) | Semua Kategori Wajib | Seluruh 8 komponen wajib terisi (CPU, Motherboard, RAM, GPU, Storage, PSU, Case, Cooler) | Sebuah komputer fungsional membutuhkan seluruh 8 komponen utama agar dapat menyala (*POST*) dan beroperasi. |
| **R-SCEN-01** | Kesesuaian Kebutuhan Skenario | `warning` | Skenario, Komponen Terkait | Memenuhi `scenario.performanceHints` (misal kapasitas RAM minimum, kebutuhan GPU dedicated) | Rakitan belum memenuhi rekomendasi kebutuhan komputasi minimum yang disyaratkan oleh profil skenario pengguna. |
| **R-BUD-01** | Batas Anggaran Biaya (Budget Cap) | `error` (saat submit) | Seluruh Komponen | Total harga komponen <= `scenario.budget` | Total biaya komponen melebihi batas anggaran yang dialokasikan pada skenario proyek. |

---

## 2. Catatan untuk Tim Ahli Materi
- Formula estimasi konsumsi daya PSU:
  $$\text{Daya Minimum} = \text{TDP CPU} + \text{TDP GPU} + 100\text{W (Motherboard, RAM, Storage, Fans)} + \text{Headroom 20\%}$$
- Aturan `warning` tidak menghalangi rakitan untuk diselesaikan, namun akan mengurangi poin efisiensi pada evaluasi akhir.
- Seluruh aturan dievaluasi secara otomatis setiap kali kartu komponen diganti atau saat tombol "Periksa Rakitan" ditekan.
