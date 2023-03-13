import { IconProps } from "./types";
const Icon = ({ className, iconClassname }: IconProps) => {
  return (
    <svg
      width={26}
      height={22}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className || ""}
    >
      <g filter="url(#prefix__filter0_d_2312_2084)">
        <path
          d="M8 15.556V8.444A4.444 4.444 0 0112.444 4h7.112A4.444 4.444 0 0124 8.444v7.112A4.444 4.444 0 0119.556 20h-7.112A4.444 4.444 0 018 15.556z"
          stroke="#000"
          strokeWidth={0.77}
          className={iconClassname || ""}
        />
        <path
          d="M15.882 15.906a3.556 3.556 0 100-7.111 3.556 3.556 0 000 7.111z"
          fill="#fff"
          stroke="#000"
          strokeWidth={0.77}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none"
        />
        <path d="M20.115 7.47l.008-.009z" fill="#fff" />
        <path
          d="M20.115 7.47l.008-.009"
          stroke="#000"
          strokeWidth={0.77}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <filter
          id="prefix__filter0_d_2312_2084"
          x={0.615}
          y={0.615}
          width={30.77}
          height={30.77}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={4} />
          <feGaussianBlur stdDeviation={3.5} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2312_2084"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_2312_2084"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default Icon;
