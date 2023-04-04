/**
 * A generic table implementation
 */

import WrappedText from "components/wrappers/text";
import { TableProps } from "./types";
import { ChildrenProvider } from "components/internal/render-children";

export const Table = <T,>({ sections, items }: TableProps<T>) => {
  return (
    <div className="flex flex-row gap-2 w-max pt-2">
      {sections.map((section, i) => {
        return (
          <div className="flex flex-col gap-2" key={i}>
            <WrappedText fontSize={10} className="text-opacity-30">
              {section.label}
            </WrappedText>
            <ChildrenProvider>{items.map(section.callback)}</ChildrenProvider>
          </div>
        );
      })}
    </div>
  );
};
