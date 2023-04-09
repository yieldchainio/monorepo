/**
 * A dot menu icon
 */

import { forwardRef } from "react";
import { IconProps } from "./types";

export const DotMenuIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ iconClassname, className, onClick, ...props }: IconProps, ref) => {
    return (
      <svg
        width={24}
        height={24}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        onClick={onClick}
        {...props}
        ref={ref}
      >
        <g clipPath="url(#prefix__clip0_1772_2145)">
          <g clipPath="url(#prefix__clip1_1772_2145)">
            <path
              d="M16 12a2 2 0 114 0 2 2 0 01-4 0zm-6 0a2 2 0 114 0 2 2 0 01-4 0zm-6 0a2 2 0 114 0 2 2 0 01-4 0z"
              fill="currentColor"
              className={iconClassname}
            />
          </g>
        </g>
        <defs>
          <clipPath id="prefix__clip0_1772_2145">
            <path fill="#fff" d="M0 0h24v24H0z" />
          </clipPath>
          <clipPath id="prefix__clip1_1772_2145">
            <path fill="#fff" d="M0 0h24v24H0z" />
          </clipPath>
        </defs>
      </svg>
    );
  }
);
