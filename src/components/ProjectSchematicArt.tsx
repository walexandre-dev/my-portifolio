import React from 'react';
import { ProjectItem } from '../data/portfolioData';

interface ProjectSchematicArtProps {
  theme: ProjectItem['visualTheme'];
  title: string;
}

export const ProjectSchematicArt: React.FC<ProjectSchematicArtProps> = ({ theme, title }) => {
  return (
    <div
      role="img"
      aria-label={`Diagrama arquitetural demonstrativo do projeto: ${title}`}
      className="relative h-48 w-full overflow-hidden bg-[#070b14] border-b border-slate-800/80 select-none"
    >
      {/* Subtle Background Grid */}
      <svg
        className="h-full w-full transition-transform duration-300 ease-out group-hover:scale-105"
        viewBox="0 0 400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={`grid-${theme}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="400" height="200" fill={`url(#grid-${theme})`} />

        {theme === 'web-portal' && (
          <g>
            <rect x="36" y="24" width="328" height="152" rx="8" fill="#0d1526" stroke="#334155" strokeWidth="1.5" />
            <rect x="36" y="24" width="328" height="24" rx="8" fill="#1e293b" />
            <circle cx="52" cy="36" r="3.5" fill="#06b6d4" />
            <circle cx="64" cy="36" r="3.5" fill="#475569" />
            <rect x="52" y="62" width="88" height="98" rx="4" fill="#090d16" stroke="#1e293b" />
            <rect x="62" y="74" width="56" height="8" rx="2" fill="#06b6d4" />
            <rect x="62" y="90" width="68" height="6" rx="2" fill="#475569" />
            <rect x="62" y="104" width="48" height="6" rx="2" fill="#475569" />
            <rect x="154" y="62" width="194" height="44" rx="4" fill="#111c33" stroke="#0891b2" strokeWidth="1.2" />
            <rect x="166" y="74" width="110" height="8" rx="2" fill="#e2e8f0" />
            <rect x="166" y="88" width="150" height="6" rx="2" fill="#06b6d4" />
            <rect x="154" y="116" width="92" height="44" rx="4" fill="#090d16" stroke="#1e293b" />
            <rect x="256" y="116" width="92" height="44" rx="4" fill="#090d16" stroke="#1e293b" />
            <path d="M 168 146 L 188 130 L 208 138 L 232 124" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {theme === 'sys-control' && (
          <g>
            <rect x="44" y="30" width="136" height="140" rx="6" fill="#0d1526" stroke="#334155" strokeWidth="1.5" />
            <rect x="58" y="46" width="84" height="10" rx="2" fill="#06b6d4" />
            <rect x="58" y="68" width="108" height="22" rx="3" fill="#090d16" stroke="#1e293b" />
            <rect x="58" y="98" width="108" height="22" rx="3" fill="#090d16" stroke="#1e293b" />
            <rect x="58" y="128" width="108" height="22" rx="3" fill="#090d16" stroke="#1e293b" />
            <path d="M 180 100 L 220 100" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 4" />
            <rect x="220" y="42" width="136" height="116" rx="6" fill="#0d1526" stroke="#0891b2" strokeWidth="1.5" />
            <rect x="236" y="62" width="44" height="76" rx="3" fill="#1e293b" />
            <rect x="236" y="88" width="44" height="50" rx="3" fill="#06b6d4" />
            <rect x="294" y="62" width="44" height="76" rx="3" fill="#1e293b" />
            <rect x="294" y="74" width="44" height="64" rx="3" fill="#3b82f6" />
          </g>
        )}

        {theme === 'python-auto' && (
          <g>
            <rect x="34" y="68" width="86" height="64" rx="8" fill="#0d1526" stroke="#334155" strokeWidth="1.5" />
            <text x="52" y="104" fill="#94a3b8" fontFamily="monospace" fontSize="11">ORIGEM</text>
            <path d="M 120 100 L 160 100" stroke="#06b6d4" strokeWidth="2" />
            <rect x="160" y="54" width="90" height="92" rx="10" fill="#111c33" stroke="#06b6d4" strokeWidth="1.8" />
            <text x="176" y="96" fill="#06b6d4" fontFamily="monospace" fontSize="11" fontWeight="bold">PYTHON</text>
            <text x="176" y="114" fill="#e2e8f0" fontFamily="monospace" fontSize="10">SHA-256</text>
            <path d="M 250 100 L 290 100" stroke="#06b6d4" strokeWidth="2" />
            <rect x="290" y="68" width="80" height="64" rx="8" fill="#0d1526" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="306" y="104" fill="#e2e8f0" fontFamily="monospace" fontSize="11">BACKUP</text>
          </g>
        )}

        {theme === 'sql-engine' && (
          <g>
            {/* Relational Tables & Foreign Key Links */}
            <rect x="38" y="34" width="110" height="62" rx="5" fill="#0d1526" stroke="#06b6d4" strokeWidth="1.5" />
            <rect x="38" y="34" width="110" height="18" rx="5" fill="#0891b2" />
            <line x1="50" y1="66" x2="128" y2="66" stroke="#94a3b8" strokeWidth="4" />
            <line x1="50" y1="80" x2="110" y2="80" stroke="#475569" strokeWidth="4" />

            <rect x="38" y="110" width="110" height="62" rx="5" fill="#0d1526" stroke="#334155" strokeWidth="1.5" />
            <rect x="38" y="110" width="110" height="18" rx="5" fill="#1e293b" />
            <line x1="50" y1="142" x2="124" y2="142" stroke="#94a3b8" strokeWidth="4" />
            <line x1="50" y1="156" x2="104" y2="156" stroke="#475569" strokeWidth="4" />

            <path d="M 148 65 L 204 100 M 148 140 L 204 100" stroke="#06b6d4" strokeWidth="1.8" />

            <rect x="204" y="52" width="156" height="96" rx="6" fill="#111c33" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="220" y="78" fill="#06b6d4" fontFamily="monospace" fontSize="11">VIEW ANALÍTICA SQL</text>
            <rect x="220" y="92" width="120" height="8" rx="2" fill="#e2e8f0" />
            <rect x="220" y="108" width="96" height="8" rx="2" fill="#38bdf8" />
            <rect x="220" y="124" width="108" height="8" rx="2" fill="#64748b" />
          </g>
        )}

        {theme === 'server-rack' && (
          <g>
            {/* Enterprise Server Rack & Patch Topology */}
            <rect x="136" y="20" width="128" height="160" rx="6" fill="#0d1526" stroke="#334155" strokeWidth="2" />
            <rect x="148" y="34" width="104" height="20" rx="3" fill="#111c33" stroke="#06b6d4" strokeWidth="1.2" />
            <rect x="148" y="62" width="104" height="24" rx="3" fill="#1e293b" />
            <rect x="148" y="94" width="104" height="24" rx="3" fill="#1e293b" />
            <rect x="148" y="126" width="104" height="36" rx="3" fill="#090d16" stroke="#3b82f6" strokeWidth="1.2" />
            <circle cx="236" cy="44" r="3" fill="#06b6d4" />
            <circle cx="236" cy="74" r="3" fill="#06b6d4" />
            <circle cx="236" cy="106" r="3" fill="#06b6d4" />
            <path d="M 64 60 L 136 44 M 64 140 L 136 74 M 336 60 L 264 44 M 336 140 L 264 144" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="64" cy="60" r="8" fill="#111c33" stroke="#06b6d4" strokeWidth="1.5" />
            <circle cx="64" cy="140" r="8" fill="#111c33" stroke="#06b6d4" strokeWidth="1.5" />
            <circle cx="336" cy="60" r="8" fill="#111c33" stroke="#3b82f6" strokeWidth="1.5" />
            <circle cx="336" cy="140" r="8" fill="#111c33" stroke="#3b82f6" strokeWidth="1.5" />
          </g>
        )}

        {theme === 'hardware-diag' && (
          <g>
            {/* Motherboard & Thermal / Storage Diagnostic Schematic */}
            <rect x="76" y="26" width="248" height="148" rx="8" fill="#0d1526" stroke="#334155" strokeWidth="1.8" />
            <rect x="112" y="54" width="68" height="68" rx="6" fill="#111c33" stroke="#06b6d4" strokeWidth="1.8" />
            <rect x="128" y="70" width="36" height="36" rx="3" fill="#06b6d4" fillOpacity="0.25" stroke="#06b6d4" />
            {/* RAM Slots */}
            <rect x="200" y="52" width="8" height="72" rx="2" fill="#38bdf8" />
            <rect x="214" y="52" width="8" height="72" rx="2" fill="#1e293b" />
            <rect x="228" y="52" width="8" height="72" rx="2" fill="#38bdf8" />
            <rect x="242" y="52" width="8" height="72" rx="2" fill="#1e293b" />
            {/* NVMe M.2 Slot */}
            <rect x="112" y="136" width="110" height="18" rx="3" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.2" />
            <text x="264" y="92" fill="#06b6d4" fontFamily="monospace" fontSize="11">S.M.A.R.T</text>
            <text x="264" y="108" fill="#e2e8f0" fontFamily="monospace" fontSize="10">TEMP: OK</text>
          </g>
        )}
      </svg>
    </div>
  );
};
