/**
 * Dropdown for harvest  positions,
 * a button showing the choice, and a modal (in /modal) that opens when clicked, showing the origin function's
 * outflows, the harvest's inflows, and the protocol
 */

import { useYCStore } from "utilities/hooks/stores/yc-data";
import { PositionsDropdownProps } from "../../types";
import { useMemo } from "react";
import { TokensBundle } from "components/tokens/bundle";
import Dropdown from "components/dropdown";
import { PositionsModal } from "./modal";
import WrappedText from "components/wrappers/text";

export const PositionsDropdown = ({
  functions,
  choice,
  setChoice,
  dropdownProps,
  portal,
  style,
  className,
}: PositionsDropdownProps) => {
  // ===========
  //    MEMOS
  // ===========
  /**
   * Memoize our choice's style for the dropdown
   */
  const memoChoice = useMemo(() => {
    // Return some undefined choice if none
    if (!choice || !choice.dependencyFunction)
      return { text: undefined, image: undefined, data: undefined };

    // Get the dependancy
    const dependancy = choice.dependencyFunction;

    // Return the choice (showing the inflows of the harvest, and outflows of dependancy in small)
    return {
      image: (
        <div className="flex flex-row items-center gap-1">
          <TokensBundle
            tokens={choice.inflows}
            imageProps={{
              width: 24,
              height: 24,
            }}
            showAdditionalText={false}
          />
          <TokensBundle
            showAdditionalText={false}
            tokens={dependancy.outflows}
            imageProps={{
              width: 18,
              height: 18,
              className: "border-[1px] border-custom-bcomponentbg",
            }}
            style={{
              marginLeft: "-6px",
              transform: "translate(-20%, 50%)",
            }}
            maxImages={1}
            textProps={{
              style: {
                transform: "translate(-30%, 60%)",
              },
              fontSize: 10,
            }}
          />
          <WrappedText>
            {choice.inflows[0]?.symbol +
              (choice.inflows.length > 1
                ? `, +${choice.inflows.length - 1}`
                : "")}
          </WrappedText>
        </div>
      ),
      text: "",
      data: undefined,
    };
  }, [choice, choice?.id]);

  // Return JSX
  return (
    <Dropdown
      buttonProps={{
        style: {
          width: "100%",
          gap: "0px",
          ...style,
        },
        className,
      }}
      choice={memoChoice}
      options={[]}
      manualModal
    >
      <PositionsModal claimFunctions={functions} handleChoice={setChoice} />
    </Dropdown>
  );
};
