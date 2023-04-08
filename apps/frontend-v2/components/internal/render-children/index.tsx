/**
 * Internal utility component used in utility components to render children.
 *
 * It checks to see if the child is a string, and if it is it returns a wrappedtext.
 *
 * if it isnt it renders it regulerly or with a provided callback
 */

import WrappedText from "components/wrappers/text";
import { TextProps } from "components/wrappers/types";
import { Children, isValidElement } from "react";

interface ChildrenProviderProps {
  children: React.ReactNode;
  callback?: (child: React.ReactNode, i: number) => React.ReactNode;
  textProps?: Omit<TextProps, "children">;
}
export const ChildrenProvider = ({
  children,
  callback = (child) => child,
  textProps,
}: ChildrenProviderProps) => {
  return (
    <>
      {Children.map(children, (child, i) => {
        if (typeof child === "string")
          return <WrappedText {...textProps} key={i}>{child}</WrappedText>;

        return callback(child, i);
      })}
    </>
  );
};
