interface Props {
  code: string;
  className?: string;
}

export default function GardenStickerSvg({ code, className = "w-12 h-12" }: Props) {
  switch (code) {
    case "stiker_kupu_biru":
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <ellipse cx="22" cy="24" rx="13" ry="11" fill="#3E7CB1" />
          <ellipse cx="42" cy="24" rx="13" ry="11" fill="#5A9AD0" />
          <ellipse cx="24" cy="40" rx="10" ry="9" fill="#5A9AD0" />
          <ellipse cx="40" cy="40" rx="10" ry="9" fill="#3E7CB1" />
          <rect x="30" y="16" width="4" height="32" rx="2" fill="#1B2B22" />
        </svg>
      );
    case "stiker_apel_merah":
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect x="29" y="38" width="6" height="18" rx="2" fill="#8A5A3C" />
          <circle cx="32" cy="28" r="18" fill="#5FA84A" />
          <circle cx="25" cy="25" r="4" fill="#D6453A" />
          <circle cx="38" cy="23" r="4" fill="#D6453A" />
          <circle cx="32" cy="34" r="4" fill="#D6453A" />
        </svg>
      );
    case "stiker_kiko_topi":
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <ellipse cx="32" cy="42" rx="22" ry="7" fill="#F2B632" />
          <path d="M18 42 C18 24 46 24 46 42 Z" fill="#D99B1E" />
          <rect x="18" y="36" width="28" height="4" fill="#5FA84A" />
        </svg>
      );
    case "stiker_kristal_pelangi":
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <polygon points="32,8 46,28 38,54 26,54 18,28" fill="#3E7CB1" />
          <polygon points="32,8 46,28 32,32" fill="#F2B632" />
          <polygon points="32,8 18,28 32,32" fill="#5FA84A" />
        </svg>
      );
    case "stiker_bebek_sungai":
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <path d="M16 42 C16 32 28 30 40 33 C47 35 53 31 55 27 C55 39 48 50 32 50 C21 50 16 46 16 42 Z" fill="#F2B632" />
          <circle cx="24" cy="26" r="10" fill="#F2B632" />
          <path d="M9 26 C9 23 14 22 17 24 L17 28 C13 29 9 28 9 26 Z" fill="#D96B27" />
          <circle cx="22" cy="24" r="2" fill="#1B2B22" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <rect x="30" y="34" width="4" height="22" rx="2" fill="#1F4D3A" />
          <circle cx="32" cy="24" r="14" fill="#F2B632" />
          <circle cx="32" cy="24" r="7" fill="#8A5A3C" />
        </svg>
      );
  }
}
