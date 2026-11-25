interface LogoProps {
  size?: number;
}

export default function Logo({ size = 40 }: LogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        aria-hidden="true"
        className="shrink-0"
      >
        <g transform="translate(-5 4)">
          <circle
            cx="52"
            cy="68"
            r="22"
            fill="none"
            stroke="#1F4D3A"
            strokeWidth="12"
          />
          <line
            x1="74"
            y1="46"
            x2="74"
            y2="90"
            stroke="#1F4D3A"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M74 42C58 42 44 34 42 18C58 18 74 26 74 42Z"
            fill="#5FA84A"
          />
          <path
            d="M74 42C74 26 88 16 106 16C106 32 92 42 74 42Z"
            fill="#F2B632"
          />
        </g>
      </svg>
      <span className="text-[22px] font-bold text-[var(--color-forest)] leading-none">
        KebunAksara
      </span>
    </span>
  );
}