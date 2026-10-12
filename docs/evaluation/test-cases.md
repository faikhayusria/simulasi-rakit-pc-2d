# Matriks Pengujian Fungsi (Black-box Test Cases)

Dokumen ini berisi rancangan uji fungsi (*functional black-box testing*) untuk validasi sistem **RakitPC 2D**.

---

| ID Uji | Fitur / Skenario | Langkah Pengujian | Hasil yang Diharapkan | Status |
|---|---|---|---|---|
| **TC-NAV-01** | Navigasi Halaman Utama | Klik tombol "Mulai Simulasi" di Beranda | Pengguna diarahkan ke halaman pemilihan skenario | Siap Diuji |
| **TC-SCEN-01** | Pemilihan Skenario | Pilih skenario "PC Belajar Hemat" dan klik "Mulai Merakit" | Halaman builder terbuka dengan judul skenario dan anggaran Rp 5.500.000 | Siap Diuji |
| **TC-CARD-01** | Filter Kategori Komponen | Klik tab kategori "CPU" pada palet komponen | Hanya komponen kategori CPU yang ditampilkan pada daftar | Siap Diuji |
| **TC-SLOT-01** | Pemilihan Komponen (Click / DND) | Klik tombol "Pasang" pada CPU fiktif | CPU terpasang pada slot CPU di papan rakitan, slot terisi | Siap Diuji |
| **TC-SLOT-02** | Pelepasan Komponen | Klik tombol "Lepas" pada slot CPU | Slot CPU kembali kosong, total anggaran berkurang | Siap Diuji |
| **TC-RULE-01** | Deteksi Ketidakcocokan Socket | Pasang CPU AM-X dengan Motherboard Intel LGA-Z | Umpan balik error muncul: "R-SOCKET-01: Socket CPU tidak cocok dengan motherboard" | Siap Diuji |
| **TC-RULE-02** | Deteksi RAM DDR Incompatible | Pasang RAM DDR4 pada Motherboard yang hanya mendukung DDR5 | Umpan balik error muncul: "R-RAM-01: Tipe RAM tidak didukung motherboard" | Siap Diuji |
| **TC-RULE-03** | Deteksi Catu Daya Kurang | Pasang CPU 125W + GPU 250W dengan PSU 350W | Umpan balik error muncul: "R-PSU-01: Daya PSU tidak mencukupi" | Siap Diuji |
| **TC-RULE-04** | Deteksi Fisik GPU Melebihi Case | Pasang GPU 320mm pada Casing dengan max 280mm | Umpan balik error muncul: "R-GPU-01: Panjang GPU melebihi batas casing" | Siap Diuji |
| **TC-BUD-01** | Pelampauan Anggaran | Memilih komponen dengan total biaya melebihi anggaran skenario | Indikator anggaran berwarna merah, status over budget, peringatan aktif | Siap Diuji |
| **TC-CHECK-01** | Tombol "Periksa Rakitan" | Klik tombol "Periksa Rakitan" dengan rakitan lengkap & valid | Panel menampilkan pesan "Semua Komponen Kompatibel!", riwayat percobaan bertambah | Siap Diuji |
| **TC-RAT-01** | Pengisian Catatan Alasan | Menulis alasan pada form evaluasi komponen | Teks tersimpan secara lokal dan muncul pada ringkasan hasil | Siap Diuji |
| **TC-EXP-01** | Ekspor Format JSON | Klik "Ekspor JSON" di halaman hasil | File JSON terunduh dengan struktur data lengkap rakitan & hasil evaluasi | Siap Diuji |
| **TC-EXP-02** | Ekspor Format CSV | Klik "Ekspor CSV" di halaman hasil | File CSV terunduh berisi daftar komponen, harga, dan alasan | Siap Diuji |
| **TC-EXP-03** | Ekspor Format PDF / Cetak | Klik "Cetak Laporan / Simpan PDF" di halaman hasil | Tampilan laporan siap cetak / jendela dialog print browser terbuka | Siap Diuji |
| **TC-PERS-01** | Persistensi LocalStorage | Merakit sebagian komponen lalu me-refresh halaman browser | Komponen yang telah dipilih tetap berada pada posisinya di papan rakitan | Siap Diuji |
