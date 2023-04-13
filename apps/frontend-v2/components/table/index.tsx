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
}: TableProps<T>) => {
  return (
    <div
      className="flex flex-row gap-4 w-max pt-2 pb-2"
      style={{
        gap: columnsGap || "1rem",
      }}
    >
      {sections.map((section, i) => {
        return (
          <div
            className="flex flex-col"
            key={i}
            style={{
              gap: rowsGap || "0.5rem",
              ...(section.style || {}),
            }}
          >
            <ChildrenProvider
              textProps={{
                fontSize: 10,
                className: "text-opacity-30",
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
