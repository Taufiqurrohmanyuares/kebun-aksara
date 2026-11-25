"use client";

import { useEffect, useState } from "react";
import { onKikoSpeakingChange } from "@/lib/speech";

interface KikoMascotProps {
  className?: string;
  animateEar?: boolean;
  reactToSpeech?: boolean;
}

export default function KikoMascot({
  className = "w-32 h-36",
  animateEar = true,
  reactToSpeech = true,
}: KikoMascotProps) {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (!reactToSpeech) return;
    return onKikoSpeakingChange(setSpeaking);
  }, [reactToSpeech]);

  return (
    <svg
      viewBox="0 0 160 180"
      className={className}
      role="img"
      aria-label="Kiko si kelinci bersyal daun hijau"
    >
      {/* Telinga kiri */}
      <g className={animateEar || speaking ? "kiko-ear-animate" : ""}>
        <ellipse cx="58" cy="44" rx="14" ry="38" transform="rotate(-10 58 44)" fill="#F3E5D0" />
        <ellipse cx="58" cy="46" rx="7" ry="27" transform="rotate(-10 58 46)" fill="#F2A7B0" />
      </g>

      {/* Telinga kanan */}
      <g>
        <ellipse cx="102" cy="44" rx="14" ry="38" transform="rotate(10 102 44)" fill="#EAD7BC" />
        <ellipse cx="102" cy="46" rx="7" ry="27" transform="rotate(10 102 46)" fill="#E8949E" />
      </g>

      {/* Badan bulat krem berlapis */}
      <ellipse cx="80" cy="144" rx="38" ry="30" fill="#EAD7BC" />
      <ellipse cx="80" cy="146" rx="24" ry="20" fill="#FAF2E4" />

      {/* Kepala bulat krem */}
      <circle cx="80" cy="96" r="42" fill="#F6E9D7" />
      <path d="M44 114C54 132 106 132 116 114C106 138 54 138 44 114Z" fill="#E3CEB0" />

      {/* Mata besar bulat */}
      <circle cx="64" cy="92" r="7" fill="#1B2B22" />
      <circle cx="62" cy="89" r="2.3" fill="#FFFFFF" />

      <circle cx="96" cy="92" r="7" fill="#1B2B22" />
      <circle cx="94" cy="89" r="2.3" fill="#FFFFFF" />

      {/* Pipi merona */}
      <ellipse cx="52" cy="105" rx="7" ry="4.5" fill="#F2A7B0" opacity="0.75" />
      <ellipse cx="108" cy="105" rx="7" ry="4.5" fill="#F2A7B0" opacity="0.75" />

      {/* Hidung kecil merah muda */}
      <ellipse cx="80" cy="102" rx="5" ry="3.5" fill="#E87A88" />

      {/* Mulut: terbuka ceria saat Kiko berbicara, tersenyum saat diam */}
      {speaking ? (
        <ellipse cx="80" cy="113" rx="7" ry="6" fill="#D96B78" stroke="#1B2B22" strokeWidth="2.5" />
      ) : (
        <path
          d="M73 110Q80 116 87 110"
          fill="none"
          stroke="#1B2B22"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}

      {/* Syal daun hijau */}
      <path d="M46 128Q80 142 114 128L108 140Q80 152 52 140Z" fill="#5FA84A" />
      <path d="M92 134C104 136 116 146 114 160C102 156 92 146 92 134Z" fill="#1F4D3A" />
      <path d="M84 136C92 144 96 158 88 166C80 158 80 146 84 136Z" fill="#4B8E39" />
    </svg>
  );
}