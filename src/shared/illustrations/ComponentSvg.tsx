import React from 'react';

interface ComponentSvgProps {
  name: string; // e.g. 'cpu-amx.svg', 'mb-atx.svg', etc.
  className?: string;
}

export const ComponentSvg: React.FC<ComponentSvgProps> = ({ name, className = 'w-16 h-16' }) => {
  // Normalize key
  const key = name.replace('.svg', '').toLowerCase();

  switch (key) {
    case 'cpu-amx':
      return (
        <svg viewBox="0 0 100 100" fill="none" className={className}>
          <rect x="10" y="10" width="80" height="80" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
          <rect x="22" y="22" width="56" height="56" rx="5" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="28" cy="28" r="3" fill="#eab308" />
          <text x="50" y="52" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">AM-X</text>
          <text x="50" y="66" fill="#cbd5e1" fontSize="8" textAnchor="middle">ZENITH 4C</text>
        </svg>
      );

    case 'cpu-lgaz':
      return (
        <svg viewBox="0 0 100 100" fill="none" className={className}>
          <rect x="15" y="8" width="70" height="84" rx="6" fill="#0f172a" stroke="#818cf8" strokeWidth="2.5" />
          <rect x="25" y="18" width="50" height="64" rx="4" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.5" />
          <circle cx="30" cy="24" r="3" fill="#38bdf8" />
          <text x="50" y="50" fill="#818cf8" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">LGA-Z</text>
          <text x="50" y="65" fill="#38bdf8" fontSize="8" textAnchor="middle">AURORA i7</text>
        </svg>
      );

    case 'mb-matx':
      return (
        <svg viewBox="0 0 100 100" fill="none" className={className}>
          <rect x="10" y="10" width="80" height="80" rx="4" fill="#090d16" stroke="#0ea5e9" strokeWidth="2" />
          {/* CPU Socket */}
          <rect x="25" y="22" width="28" height="28" rx="2" fill="#1e293b" stroke="#eab308" strokeWidth="1.5" strokeDasharray="2 2" />
          <text x="39" y="38" fill="#eab308" fontSize="6" fontWeight="bold" textAnchor="middle">AM-X</text>
          {/* RAM Slots DDR4 */}
          <rect x="60" y="18" width="4" height="34" fill="#22c55e" rx="1" />
          <rect x="67" y="18" width="4" height="34" fill="#16a34a" rx="1" />
          <text x="65" y="58" fill="#22c55e" fontSize="5" textAnchor="middle">DDR4</text>
          {/* PCIe Slot */}
          <rect x="20" y="68" width="55" height="6" fill="#38bdf8" rx="1" />
          <rect x="40" y="56" width="24" height="5" fill="#64748b" rx="1" />
          <text x="52" y="60" fill="#94a3b8" fontSize="4" textAnchor="middle">M.2 PCIe</text>
        </svg>
      );

    case 'mb-atx':
      return (
        <svg viewBox="0 0 100 100" fill="none" className={className}>
          <rect x="8" y="5" width="84" height="90" rx="4" fill="#0f172a" stroke="#a855f7" strokeWidth="2.5" />
          {/* VRM Heatsinks */}
          <rect x="12" y="12" width="12" height="38" fill="#334155" rx="1" />
          <rect x="24" y="10" width="30" height="10" fill="#334155" rx="1" />
          {/* CPU Socket LGA-Z */}
          <rect x="28" y="24" width="26" height="32" rx="2" fill="#1e293b" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="2 2" />
          <text x="41" y="42" fill="#818cf8" fontSize="6" fontWeight="bold" textAnchor="middle">LGA-Z</text>
          {/* RAM Slots DDR5 */}
          <rect x="62" y="18" width="4" height="38" fill="#a855f7" rx="1" />
          <rect x="68" y="18" width="4" height="38" fill="#9333ea" rx="1" />
          <rect x="74" y="18" width="4" height="38" fill="#7e22ce" rx="1" />
          <text x="70" y="63" fill="#c084fc" fontSize="5" textAnchor="middle">DDR5</text>
          {/* PCIe Gen5 & M.2 Slots with Heatsinks */}
          <rect x="16" y="68" width="68" height="6" fill="#a855f7" rx="1" />
          <rect x="16" y="80" width="60" height="5" fill="#64748b" rx="1" />
          <rect x="36" y="58" width="30" height="5" fill="#475569" rx="1" />
        </svg>
      );

    case 'ram-ddr4':
      return (
        <svg viewBox="0 0 100 100" fill="none" className={className}>
          <rect x="6" y="32" width="88" height="36" rx="3" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          {/* Heat spreader accents */}
          <rect x="12" y="36" width="76" height="12" fill="#0f172a" rx="1" />
          <circle cx="20" cy="42" r="3" fill="#22c55e" />
          <circle cx="30" cy="42" r="3" fill="#22c55e" />
          <text x="56" y="44" fill="#86efac" fontSize="7" fontWeight="bold" fontFamily="monospace">DDR4 16GB</text>
          {/* Gold pins with notch */}
          <rect x="8" y="64" width="38" height="4" fill="#eab308" />
          <rect x="52" y="64" width="40" height="4" fill="#eab308" />
        </svg>
      );

    case 'ram-ddr5':
      return (
        <svg viewBox="0 0 100 100" fill="none" className={className}>
          <rect x="6" y="30" width="88" height="38" rx="3" fill="#18181b" stroke="#a855f7" strokeWidth="2" />
          {/* RGB Lightbar on top */}
          <rect x="6" y="30" width="88" height="8" rx="2" fill="url(#rgb-gradient)" />
          <text x="50" y="52" fill="#e9d5ff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">DDR5 32GB RGB</text>
          {/* Gold pins with centered notch */}
          <rect x="8" y="64" width="41" height="4" fill="#eab308" />
          <rect x="53" y="64" width="39" height="4" fill="#eab308" />
          <defs>
            <linearGradient id="rgb-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'gpu-dual':
      return (
        <svg viewBox="0 0 100 100" fill="none" className={className}>
          <rect x="8" y="26" width="84" height="48" rx="5" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          {/* 2 Fans */}
          <circle cx="34" cy="50" r="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="34" cy="50" r="5" fill="#38bdf8" />
          <circle cx="68" cy="50" r="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="68" cy="50" r="5" fill="#38bdf8" />
          {/* PCIe bracket & connector */}
          <rect x="6" y="20" width="4" height="60" fill="#94a3b8" />
          <rect x="25" y="74" width="50" height="4" fill="#eab308" />
          {/* Power 8-pin */}
          <rect x="76" y="22" width="12" height="6" fill="#f59e0b" rx="1" />
          <text x="50" y="71" fill="#93c5fd" fontSize="5" textAnchor="middle">240mm / 8-PIN</text>
        </svg>
      );

    case 'gpu-triple':
      return (
        <svg viewBox="0 0 100 100" fill="none" className={className}>
          <rect x="4" y="24" width="92" height="52" rx="5" fill="#090d16" stroke="#f43f5e" strokeWidth="2.5" />
          {/* 3 Fans */}
          <circle cx="22" cy="50" r="13" fill="#182234" stroke="#f43f5e" strokeWidth="1.5" />
          <circle cx="22" cy="50" r="4" fill="#fb7185" />
          <circle cx="50" cy="50" r="13" fill="#182234" stroke="#f43f5e" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="4" fill="#fb7185" />
          <circle cx="78" cy="50" r="13" fill="#182234" stroke="#f43f5e" strokeWidth="1.5" />
          <circle cx="78" cy="50" r="4" fill="#fb7185" />
          {/* PCIe pins */}
          <rect x="2" y="18" width="4" height="64" fill="#cbd5e1" />
          <rect x="20" y="76" width="60" height="4" fill="#eab308" />
          {/* 12-pin power */}
          <rect x="70" y="20" width="16" height="5" fill="#38bdf8" rx="1" />
          <text x="50" y="20" fill="#fb7185" fontSize="5" fontWeight="bold" textAnchor="middle">325mm TRIPLE / 12-PIN</text>
        </svg>
      );

    case 'storage-sata':
      return (
        <svg viewBox="0 0 100 100" fill="none" className={className}>
          <rect x="18" y="16" width="64" height="68" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
          <rect x="24" y="22" width="52" height="34" fill="#0f172a" rx="2" />
          <text x="50" y="38" fill="#e2e8f0" fontSize="7" fontWeight="bold" textAnchor="middle">IRONCLAD</text>
          <text x="50" y="48" fill="#94a3b8" fontSize="6" textAnchor="middle">500GB SATA III</text>
          <rect x="30" y="78" width="22" height="4" fill="#eab308" />
          <rect x="56" y="78" width="12" height="4" fill="#cbd5e1" />
        </svg>
      );

    case 'storage-m2':
      return (
        <svg viewBox="0 0 100 100" fill="none" className={className}>
          <rect x="8" y="36" width="84" height="28" rx="2" fill="#064e3b" stroke="#10b981" strokeWidth="1.8" />
          {/* NAND Controller & Flash chips */}
          <rect x="18" y="40" width="14" height="20" fill="#182234" stroke="#34d399" strokeWidth="1" />
          <rect x="38" y="40" width="20" height="20" fill="#0f172a" />
          <rect x="62" y="40" width="20" height="20" fill="#0f172a" />
          <text x="55" y="52" fill="#a7f3d0" fontSize="5" fontWeight="bold" textAnchor="middle">1TB NVMe Gen4</text>
          {/* Gold M.2 connector with M-key notch */}
          <rect x="8" y="42" width="4" height="16" fill="#eab308" />
        </svg>
      );

    case 'psu-500w':
      return (
        <svg viewBox="0 0 100 100" fill="none" className={className}>
          <rect x="12" y="20" width="76" height="60" rx="4" fill="#182234" stroke="#d97706" strokeWidth="2" />
          <circle cx="48" cy="50" r="18" fill="#0f172a" stroke="#d97706" strokeWidth="1.5" />
          <line x1="34" y1="50" x2="62" y2="50" stroke="#f59e0b" strokeWidth="1.5" />
          <line x1="48" y1="36" x2="48" y2="64" stroke="#f59e0b" strokeWidth="1.5" />
          <rect x="76" y="32" width="8" height="14" fill="#ef4444" rx="1" />
          <text x="48" y="74" fill="#fde68a" fontSize="6" fontWeight="bold" textAnchor="middle">500W 80+ BRONZE</text>
        </svg>
      );

    case 'psu-850w':
      return (
        <svg viewBox="0 0 100 100" fill="none" className={className}>
          <rect x="10" y="16" width="80" height="68" rx="4" fill="#090d16" stroke="#eab308" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="22" fill="#1e293b" stroke="#eab308" strokeWidth="1.5" />
          <polygon points="50,34 62,56 38,56" fill="#fde047" opacity="0.8" />
          {/* Modular sockets on back */}
          <rect x="14" y="24" width="8" height="8" fill="#334155" />
          <rect x="14" y="36" width="8" height="8" fill="#334155" />
          <rect x="14" y="48" width="8" height="8" fill="#334155" />
          <text x="50" y="78" fill="#fef08a" fontSize="7" fontWeight="bold" textAnchor="middle">850W GOLD MODULAR</text>
        </svg>
      );

    case 'case-matx':
      return (
        <svg viewBox="0 0 100 100" fill="none" className={className}>
          <rect x="18" y="10" width="64" height="80" rx="5" fill="#111827" stroke="#06b6d4" strokeWidth="2" />
          {/* Glass window */}
          <rect x="24" y="16" width="52" height="52" rx="3" fill="#0e7490" fillOpacity="0.2" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3 3" />
          {/* PSU Shroud */}
          <rect x="24" y="70" width="52" height="15" fill="#1f2937" rx="1" />
          <text x="50" y="44" fill="#67e8f9" fontSize="6" textAnchor="middle">mATX COMPACT</text>
          <text x="50" y="80" fill="#9ca3af" fontSize="5" textAnchor="middle">GPU MAX 290mm</text>
        </svg>
      );

    case 'case-atx':
      return (
        <svg viewBox="0 0 100 100" fill="none" className={className}>
          <rect x="12" y="6" width="76" height="88" rx="6" fill="#030712" stroke="#a855f7" strokeWidth="2.5" />
          {/* Panoramic Dual Glass */}
          <rect x="18" y="12" width="64" height="60" rx="3" fill="#581c87" fillOpacity="0.25" stroke="#c084fc" strokeWidth="1" />
          {/* 3 RGB Fans on side/front */}
          <circle cx="28" cy="24" r="7" stroke="#ec4899" strokeWidth="1.5" />
          <circle cx="28" cy="42" r="7" stroke="#a855f7" strokeWidth="1.5" />
          <circle cx="28" cy="60" r="7" stroke="#06b6d4" strokeWidth="1.5" />
          {/* PSU Basement */}
          <rect x="18" y="74" width="64" height="16" fill="#111827" rx="2" />
          <text x="54" y="44" fill="#e9d5ff" fontSize="7" fontWeight="bold" textAnchor="middle">ATX PANORAMIC</text>
          <text x="50" y="85" fill="#a855f7" fontSize="5" textAnchor="middle">GPU MAX 380mm</text>
        </svg>
      );

    case 'cooler-air':
      return (
        <svg viewBox="0 0 100 100" fill="none" className={className}>
          {/* Copper baseplate */}
          <rect x="35" y="76" width="30" height="8" rx="1" fill="#b45309" stroke="#d97706" strokeWidth="1" />
          {/* Tower Heatsink Fins */}
          <rect x="22" y="24" width="56" height="48" rx="2" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="22" y1="32" x2="78" y2="32" stroke="#64748b" strokeWidth="1" />
          <line x1="22" y1="40" x2="78" y2="40" stroke="#64748b" strokeWidth="1" />
          <line x1="22" y1="48" x2="78" y2="48" stroke="#64748b" strokeWidth="1" />
          <line x1="22" y1="56" x2="78" y2="56" stroke="#64748b" strokeWidth="1" />
          {/* 120mm Fan */}
          <circle cx="50" cy="48" r="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="50" cy="48" r="4" fill="#38bdf8" />
          <text x="50" y="18" fill="#38bdf8" fontSize="6" fontWeight="bold" textAnchor="middle">120mm / 152mm H</text>
        </svg>
      );

    case 'cooler-aio':
      return (
        <svg viewBox="0 0 100 100" fill="none" className={className}>
          {/* 240 Radiator on top */}
          <rect x="12" y="10" width="76" height="22" rx="2" fill="#1e293b" stroke="#06b6d4" strokeWidth="1.5" />
          <circle cx="32" cy="21" r="7" stroke="#22d3ee" strokeWidth="1" />
          <circle cx="68" cy="21" r="7" stroke="#22d3ee" strokeWidth="1" />
          {/* Sleeved tubes */}
          <path d="M 35 32 Q 35 55 45 68" stroke="#64748b" strokeWidth="3" fill="none" />
          <path d="M 65 32 Q 65 55 55 68" stroke="#64748b" strokeWidth="3" fill="none" />
          {/* CPU RGB Pump Block */}
          <circle cx="50" cy="74" r="14" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
          <circle cx="50" cy="74" r="6" fill="#ec4899" />
          <text x="50" y="96" fill="#67e8f9" fontSize="6" fontWeight="bold" textAnchor="middle">240 AIO (LGA-Z)</text>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 100 100" fill="none" className={className}>
          <rect x="10" y="10" width="80" height="80" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
          <text x="50" y="55" fill="#94a3b8" fontSize="10" textAnchor="middle">HARDWARE</text>
        </svg>
      );
  }
};
