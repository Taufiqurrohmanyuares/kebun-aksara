
export default function ForestWorldScene() {
  const leaves = [
    { char: "A", x: 96, y: 92, fill: "#F2B632", text: "#1B2B22" },
    { char: "E", x: 170, y: 66, fill: "#F3F8F1", text: "#1F4D3A" },
    { char: "M", x: 245, y: 96, fill: "#F2B632", text: "#1B2B22" },
    { char: "S", x: 355, y: 84, fill: "#F3F8F1", text: "#1F4D3A" },
    { char: "Z", x: 425, y: 112, fill: "#F2B632", text: "#1B2B22" },
  ];

  return (
    <svg
      viewBox="0 0 520 260"
      className="w-full h-full block"
      role="img"
      aria-label="Adegan Hutan Huruf dengan pohon-pohon berdaun huruf A, E, M, S, dan Z"
    >
      {/* Lapisan bukit hijau tua belakang */}
      <path
        d="M0 175 Q140 130 280 165 T520 150 L520 260 L0 260 Z"
        fill="#3F782F"
      />

      {/* Lapisan tanah hutan depan */}
      <path
        d="M0 205 Q190 185 360 200 T520 192 L520 260 L0 260 Z"
        fill="#1F4D3A"
      />

      {/* Batang pohon kiri */}
      <path
        d="M152 225 L160 112 L186 112 L194 225 Z"
        fill="#8A5A3C"
      />
      <path
        d="M173 225 L173 112 L186 112 L194 225 Z"
        fill="#6E462E"
      />

      {/* Batang pohon kanan */}
      <path
        d="M376 220 L382 126 L402 126 L408 220 Z"
        fill="#8A5A3C"
      />

      {/* Rimbun daun pohon kiri */}
      <circle cx="105" cy="100" r="46" fill="#2E6324" />
      <circle cx="238" cy="102" r="44" fill="#2E6324" />
      <circle cx="172" cy="74" r="56" fill="#478C36" />
      <circle cx="136" cy="96" r="42" fill="#76BF5E" />
      <circle cx="212" cy="98" r="40" fill="#76BF5E" />

      {/* Rimbun daun pohon kanan */}
      <circle cx="356" cy="94" r="42" fill="#2E6324" />
      <circle cx="422" cy="112" r="38" fill="#478C36" />
      <circle cx="390" cy="98" r="44" fill="#76BF5E" />

      {/* Daun-daun berbentuk huruf dengan animasi */}
      {leaves.map((item) => (
        <g
          key={item.char}
          transform={`translate(${item.x}, ${item.y})`}
        >
          <g
            className="leaf-sway"
            style={{
              animationDelay: `${item.x * 4}ms`,
            }}
          >
            <path
              d="M0 -24 C16 -24 24 -12 24 0 C24 14 12 24 0 24 C-14 24 -24 12 -24 0 C-24 -14 -12 -24 0 -24 Z"
              fill={item.fill}
            />

            <text
              x="0"
              y="7"
              textAnchor="middle"
              fill={item.text}
              fontSize="22"
              fontWeight="700"
            >
              {item.char}
            </text>
          </g>
        </g>
      ))}
    </svg>
  );
}
