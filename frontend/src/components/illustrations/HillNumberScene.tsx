export default function HillNumberScene() {
  // 3 apel merah di undakan atas, 5 jeruk di undakan bawah (mudah dihitung anak)
  const apples = [
    { x: 105, y: 112 },
    { x: 145, y: 106 },
    { x: 185, y: 114 },
  ];
  const oranges = [
    { x: 76, y: 182 },
    { x: 116, y: 176 },
    { x: 156, y: 180 },
    { x: 196, y: 175 },
    { x: 236, y: 184 },
  ];

  return (
    <svg
      viewBox="0 0 320 280"
      className="w-full h-full block"
      role="img"
      aria-label="Adegan Bukit Angka dengan 3 buah apel di bukit atas dan 5 buah jeruk di bukit bawah"
    >
      {/* Undakan bukit pertama */}
      <path d="M0 145 Q130 92 320 138 L320 280 L0 280 Z" fill="#D99B1E" />
      {/* Undakan bukit kedua */}
      <path d="M0 205 Q170 162 320 198 L320 280 L0 280 Z" fill="#5FA84A" />
      {/* Undakan tanah depan */}
      <path d="M0 245 Q140 228 320 242 L320 280 L0 280 Z" fill="#1F4D3A" />

      {/* Penanda angka 3 di bukit atas */}
      <rect x="222" y="84" width="44" height="44" rx="12" fill="#1F4D3A" />
      <text x="244" y="114" textAnchor="middle" fill="#F3F8F1" fontSize="24" fontWeight="700">
        3
      </text>

      {/* Buah Apel (3 buah) */}
      {apples.map((a, idx) => (
        <g key={idx} transform={`translate(${a.x}, ${a.y})`}>
          <circle cx="0" cy="0" r="14" fill="#D6453A" />
          <path d="M0 -13 C4 -20 12 -20 14 -14 C8 -12 3 -12 0 -13 Z" fill="#1F4D3A" />
        </g>
      ))}

      {/* Penanda angka 5 di bukit bawah */}
      <rect x="26" y="156" width="36" height="36" rx="10" fill="#1F4D3A" />
      <text x="44" y="181" textAnchor="middle" fill="#F3F8F1" fontSize="20" fontWeight="700">
        5
      </text>

      {/* Buah Jeruk (5 buah) */}
      {oranges.map((o, idx) => (
        <g key={idx} transform={`translate(${o.x}, ${o.y})`}>
          <circle cx="0" cy="0" r="13" fill="#E87A24" />
          <circle cx="0" cy="-12" r="3" fill="#1F4D3A" />
        </g>
      ))}
    </svg>
  );
}