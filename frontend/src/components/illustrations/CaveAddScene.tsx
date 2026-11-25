export default function CaveAddScene() {
  return (
    <svg
      viewBox="0 0 340 200"
      className="w-full h-full block"
      role="img"
      aria-label="Adegan Gua Tambah dengan mulut gua batu dan kristal warna-warni yang bisa dihitung"
    >
      {/* Dinding batu gua berlapis */}
      <path d="M20 200 C20 75 95 28 170 28 C245 28 320 75 320 200 Z" fill="#6E462E" />
      {/* Mulut gua gelap */}
      <path d="M68 200 C68 105 115 68 170 68 C225 68 272 105 272 200 Z" fill="#1B2B22" />
      {/* Lantai tanah gua */}
      <path d="M0 176 Q170 162 340 176 L340 200 L0 200 Z" fill="#5C3B26" />

      {/* Kelompok 2 Kristal Kuning di kiri */}
      <g transform="translate(105, 165)">
        <g className="crystal-float">
          <polygon points="-14,0 -8,-36 2,-38 8,0" fill="#F2B632" />
          <polygon points="8,0 14,-28 24,-24 26,0" fill="#FFD166" />
        </g>
      </g>

      {/* Tanda tambah sederhana di batu tengah */}
      <circle cx="170" cy="142" r="16" fill="#F3F8F1" />
      <text x="170" y="150" textAnchor="middle" fill="#1F4D3A" fontSize="24" fontWeight="700">
        +
      </text>

      {/* Kelompok 2 Kristal Biru & Hijau di kanan */}
      <g transform="translate(216, 165)">
        <g className="crystal-float" style={{ animationDelay: "900ms" }}>
          <polygon points="-12,0 -6,-34 4,-32 8,0" fill="#3E7CB1" />
          <polygon points="10,0 16,-40 26,-36 28,0" fill="#5FA84A" />
        </g>
      </g>
    </svg>
  );
}