export function DuckIllustration() {
  return (
    <svg
      viewBox="0 0 140 120"
      className="w-28 h-24 shrink-0"
      role="img"
      aria-label="Ilustrasi bebek kuning"
    >
      {/* Riak air sungai di bawah bebek */}
      <ellipse cx="70" cy="102" rx="52" ry="10" fill="#B9D7EC" />

      {/* Badan bebek potongan kertas */}
      <path
        d="M32 76 C32 54 54 48 80 54 C96 58 112 52 118 44 C118 68 104 94 68 94 C44 94 32 86 32 76 Z"
        fill="#F2B632"
      />
      {/* Sayap berlapis */}
      <path
        d="M54 66 C68 62 84 68 88 78 C74 84 56 80 54 66 Z"
        fill="#D99B1E"
      />

      {/* Kepala bebek */}
      <circle cx="48" cy="40" r="22" fill="#F2B632" />

      {/* Paruh oranye */}
      <path
        d="M14 40 C14 34 26 32 32 36 L32 45 C24 47 14 45 14 40 Z"
        fill="#D96B27"
      />

      {/* Mata bulat */}
      <circle cx="43" cy="36" r="4" fill="#1B2B22" />
      <circle cx="42" cy="34.5" r="1.3" fill="#FFFFFF" />
    </svg>
  );
}

export function SmallStarMark() {
  return (
    <svg
      viewBox="0 0 36 36"
      className="w-7 h-7 shrink-0"
      role="img"
      aria-label="Tanda bintang kecil"
    >
      <path
        d="M18 3 L22.2 12.6 L32.6 13.8 L24.8 20.8 L27 31 L18 25.6 L9 31 L11.2 20.8 L3.4 13.8 L13.8 12.6 Z"
        fill="#F2B632"
      />
    </svg>
  );
}