/**
 * A generic table implementation
 */

import { TableProps } from "./types";
import { ChildrenProvider } from "components/internal/render-children";

export const Table = <T,>({
  sections,
  items,
  columnsGap,
  rowsGap,
  labelsStyle,
  style,
  className,
}: TableProps<T>) => {
  return (
    <div
      style={{
        gap: columnsGap || "1rem",

        ...(style || {}),
      }}
      className={"flex flex-row w-max pt-2 pb-2 " + " " + (className || "")}
    >
      {sections.map((section, i) => {
        return (
          <div
            className="flex flex-col"
            key={`table_section_${i}`}
            style={{
              gap: rowsGap || "0.5rem",
              ...(section.style || {}),
            }}
          >
            <ChildrenProvider
              textProps={{
                fontSize: 10,
                className: "text-opacity-30",
                style: labelsStyle,
              }}
            >
              {section.label}
            </ChildrenProvider>
            <ChildrenProvider textProps={{ className: "truncate" }}>
              {items.map(section.callback)}
            </ChildrenProvider>
          </div>
        );
      })}
    </div>
  );
};
