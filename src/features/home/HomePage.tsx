import React from 'react';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-16 py-8 animate-fade-in">
      {/* Hero Section */}
      <section className="relative max-w-5xl mx-auto px-4 text-center space-y-6 pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-mono font-bold tracking-wide shadow-lg shadow-cyan-950/40">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          SIMULASI HARDWARE INTERAKTIF BERBASIS WEB
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15]">
          RakitPC <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500">2D</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          Simulasi Pemilihan Komponen Komputer dengan Tantangan Kompatibilitas Teknis dan Batasan Anggaran Nyata. Pelajari keterkaitan antarkomponen perangkat keras secara interaktif dan menyenangkan.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('/scenarios')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-cyan-950/60 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            <span>Mulai Simulasi Perakitan</span>
            <span>→</span>
          </button>

          <button
            onClick={() => navigate('/about')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm transition-all"
          >
            Panduan & Spesifikasi Aturan
          </button>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl font-bold text-white">
            Fitur Utama Media Pembelajaran
          </h2>
          <p className="text-xs text-slate-400">
            Dirancang berdasarkan prinsip pembelajaran perangkat keras berbasis data dan umpan balik edukatif
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-[#0e1422] border border-slate-800 hover:border-cyan-500/50 transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🖥️
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
              Papan Perakitan 2D
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visualisasi chassis dan penataan slot komponen (Motherboard, CPU, Cooler, RAM, GPU, Storage, PSU, Case).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0e1422] border border-slate-800 hover:border-cyan-500/50 transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              ⚡
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
              Rules Engine Kompatibilitas
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Validasi aturan teknis otomatis: socket CPU, tipe DDR RAM, dimensi casing, kecukupan daya PSU, dan soket cooler.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0e1422] border border-slate-800 hover:border-cyan-500/50 transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              💰
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
              Tantangan Anggaran Real-time
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pelajari keseimbangan performa vs harga. Bar anggaran responsif memperingatkan jika alokasi dana melampaui pagu.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0e1422] border border-slate-800 hover:border-cyan-500/50 transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📝
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
              Rasionalisasi & Multi-Ekspor
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tulis catatan alasan teknis dan unduh bukti uji tugas dalam format JSON, CSV, gambar PNG, dan dokumen cetak PDF.
            </p>
          </div>
        </div>
      </section>

      {/* How it works steps */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-8">
          <h2 className="text-xl font-bold text-white text-center mb-8">
            Alur Simulasi Perakitan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center text-sm font-mono mb-2">
                1
              </div>
              <h4 className="font-bold text-sm text-white">Pilih Skenario</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pilih kebutuhan komputer: PC Pelajar/Kantor, PC Desain Grafis, atau PC Gaming Kompetitif.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center text-sm font-mono mb-2">
                2
              </div>
              <h4 className="font-bold text-sm text-white">Rakit & Uji Kompatibilitas</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pasang 8 komponen pada chassis 2D, amati kalkulasi anggaran, lalu jalankan pemeriksaan sistem.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center text-sm font-mono mb-2">
                3
              </div>
              <h4 className="font-bold text-sm text-white">Evaluasi & Ekspor</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tuliskan analisis alasan pemilihan, raih lencana performa, dan cetak atau unduh laporan hasil.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
