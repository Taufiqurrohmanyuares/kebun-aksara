export default function RiverWordScene() {
  const stones = [
    { text: "ba", x: 96, y: 128 },
    { text: "bu", x: 196, y: 112 },
    { text: "ku", x: 298, y: 126 },
  ];

  return (
    <svg
      viewBox="0 0 480 200"
      className="w-full h-full block"
      role="img"
      aria-label="Adegan Sungai Kata dengan batu pijakan bertuliskan suku kata ba, bu, ku dan jembatan kayu"
    >
      {/* Tepi sungai atas & bawah */}
      <path d="M0 70 Q180 54 340 72 T480 62 L480 200 L0 200 Z" fill="#2A5E8A" />
      {/* Aliran air sungai lebih terang */}
      <path d="M0 95 Q160 80 320 96 T480 88 L480 165 Q300 175 150 158 T0 168 Z" fill="#5A9AD0" />
      {/* Daratan tepi bawah */}
      <path d="M0 162 Q220 148 480 164 L480 200 L0 200 Z" fill="#5FA84A" />

      {/* Jembatan kayu di sisi kanan */}
      <g transform="translate(362, 66)">
        <rect x="0" y="0" width="84" height="92" rx="10" fill="#8A5A3C" />
        <line x1="0" y1="22" x2="84" y2="22" stroke="#5C3B26" strokeWidth="4" />
        <line x1="0" y1="46" x2="84" y2="46" stroke="#5C3B26" strokeWidth="4" />
        <line x1="0" y1="70" x2="84" y2="70" stroke="#5C3B26" strokeWidth="4" />
        <rect x="-4" y="-6" width="12" height="104" rx="4" fill="#6E462E" />
        <rect x="76" y="-6" width="12" height="104" rx="4" fill="#6E462E" />
      </g>

      {/* Batu pijakan suku kata */}
      {stones.map((s) => (
        <g key={s.text} transform={`translate(${s.x}, ${s.y})`}>
          <ellipse cx="0" cy="6" rx="36" ry="22" fill="#1F4D3A" />
          <ellipse cx="0" cy="0" rx="36" ry="22" fill="#F3F8F1" />
          <text
            x="0"
            y="7"
            textAnchor="middle"
            fill="#1F4D3A"
            fontSize="22"
            fontWeight="700"
          >
            {s.text}
          </text>
        </g>
      ))}
    </svg>
  );
}