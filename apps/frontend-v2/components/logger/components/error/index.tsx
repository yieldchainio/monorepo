/**
 * A generic "Error" message component for the logger
 */
import { ChildrenProvider } from "components/internal/render-children";
import { BaseComponentProps } from "components/types";
import { LogMessageProps } from "../types";
import { EXButton } from "components/close-button";
import { useLogs } from "utilities/hooks/stores/logger";

export const ErrorMessage = ({ children, id }: LogMessageProps) => {
  const remove = useLogs((state) => state.remove);
  return (
    <div className="w-full h-max min-w-[40vw] min-h-[5vh] bg-red-600 backdrop-blur-sm bg-opacity-90 rounded-lg flex flex-row items-center justify-center px-6 animate-log pointer-events-auto ">
      <div className="flex flex-col  items-center justify-center">
        <ChildrenProvider textProps={{ fontColor: "white" }}>
          {children}
        </ChildrenProvider>
      </div>
      <EXButton
        onClick={() => remove(id)}
        className="ml-auto"
        width={16}
        height={16}
      />
    </div>
  );
};
