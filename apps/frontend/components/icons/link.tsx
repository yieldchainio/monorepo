import { IconProps } from "./types";
function LinkIcon({ className, iconClassname }: IconProps) {
  return (
    <svg
      width={11}
      height={11}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className || ""}
    >
      <path
        d="M8.598.5a.391.391 0 00-.044.004H6.258a.391.391 0 100 .782h1.403L3.635 5.312a.391.391 0 10.553.553L8.214 1.84v1.403a.391.391 0 10.782 0V.945A.391.391 0 008.598.5zM.782 2.07A.788.788 0 000 2.85v5.867c0 .427.355.782.782.782H6.65a.788.788 0 00.783-.782v-4.92l-.783.782v4.138H.782V2.85H4.92l.782-.782H.782z"
        fill="currentColor"
        className={iconClassname || ""}
      />
    </svg>
  );
}

export default LinkIcon;
