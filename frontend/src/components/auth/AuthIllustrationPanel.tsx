import Logo from "@/components/Logo";
import KikoMascot from "@/components/illustrations/KikoMascot";

interface AuthIllustrationPanelProps {
  speechText: string;
}

export default function AuthIllustrationPanel({ speechText }: AuthIllustrationPanelProps) {
  return (
    <div className="hidden lg:block lg:w-[45%] m-4 relative overflow-hidden rounded-[20px] self-stretch bg-[#DFF0D8] border-2 border-[#1F4D3A] shrink-0">
      {/* Ilustrasi Hutan Huruf memenuhi seluruh panel tanpa celah */}
      <svg
        viewBox="0 0 420 560"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 h-full w-full block"
        aria-hidden="true"
      >
        {/* Langit lembut */}
        <rect x="-60" y="0" width="540" height="560" fill="#DFF0D8" />

        {/* Awan kertas */}
        <path
          d="M44 178 Q60 158 84 166 Q102 152 124 168 Q140 170 138 186 L40 186 Z"
          fill="#FAFDF8"
        />
        <path
          d="M288 154 Q304 136 326 144 Q342 132 360 146 Q374 148 372 162 L284 162 Z"
          fill="#FAFDF8"
        />

        {/* Bukit belakang dilebarkan melewati tepi viewBox */}
        <path
          d="M-60 390 Q110 330 245 376 T480 356 L480 560 L-60 560 Z"
          fill="#8CC776"
        />

        {/* Bukit dan tanah depan dilebarkan melewati tepi viewBox */}
        <path
          d="M-60 442 Q145 412 285 438 T480 422 L480 560 L-60 560 Z"
          fill="#5FA84A"
        />

        {/* Batang pohon */}
        <path d="M254 452 L262 326 L296 326 L304 452 Z" fill="#8A5A3C" />
        <path d="M279 452 L279 326 L296 326 L304 452 Z" fill="#72482E" />

        {/* Tajuk pohon berdaun huruf */}
        <circle cx="204" cy="312" r="52" fill="#3F782F" />
        <circle cx="352" cy="316" r="50" fill="#3F782F" />
        <circle cx="279" cy="276" r="66" fill="#4B8E39" />
        <circle cx="236" cy="304" r="46" fill="#5FA84A" />
        <circle cx="320" cy="306" r="44" fill="#5FA84A" />

        {/* Daun huruf A, B, C */}
        <g transform="translate(178, 282)">
          <rect width="40" height="40" rx="12" fill="#79C262" stroke="#1F4D3A" strokeWidth="2" />
          <text x="20" y="27" textAnchor="middle" fill="#1B2B22" fontSize="20" fontWeight="700">
            A
          </text>
        </g>
        <g transform="translate(259, 248)">
          <rect width="42" height="42" rx="12" fill="#F2B632" stroke="#1F4D3A" strokeWidth="2" />
          <text x="21" y="28" textAnchor="middle" fill="#1B2B22" fontSize="21" fontWeight="700">
            B
          </text>
        </g>
        <g transform="translate(338, 288)">
          <rect width="40" height="40" rx="12" fill="#79C262" stroke="#1F4D3A" strokeWidth="2" />
          <text x="20" y="27" textAnchor="middle" fill="#1B2B22" fontSize="20" fontWeight="700">
            C
          </text>
        </g>
      </svg>

      {/* Logo KebunAksara absolute di pojok kiri atas */}
      <div className="absolute top-6 left-6 z-10">
        <Logo size={36} />
      </div>

      {/* Gelembung ucapan Kiko absolute di atas ilustrasi */}
      <div className="absolute top-24 left-6 right-6 z-10">
        <div
          className="inline-block bg-[var(--color-paper)] border-2 border-[#1F4D3A] px-4 py-2.5 max-w-[270px]"
          style={{
            borderRadius: "20px 20px 20px 4px",
            boxShadow: "var(--shadow-small)",
          }}
        >
          <p className="text-[18px] font-bold text-[#1F4D3A] leading-snug">
            {speechText}
          </p>
        </div>
      </div>

      {/* Kiko ukuran besar melambai di bagian bawah kiri panel */}
      <div className="absolute bottom-3 left-5 z-10 pointer-events-none">
        <KikoMascot className="w-40 h-44" animateEar={true} reactToSpeech={false} />
      </div>
    </div>
  );
}