/**
 * @notice
 * A component of a tokens modal,
 * showing all tokens, divided by networks
 */

import { useYCStore } from "utilities/hooks/stores/yc-data";
import { TokensModalProps } from "./types";
import WrappedText from "components/wrappers/text";
import { YCNetwork, YCToken } from "@yc/yc-models";
import { forwardRef, useCallback, useMemo, useState } from "react";
import WrappedInput from "components/wrappers/input";
import WrappedImage from "components/wrappers/image";
import { useFilters } from "utilities/hooks/general/useFilters";
import {
  ChoiceFilter,
  FilterInstance,
  FilterTypes,
  OptionsFilter,
  StringFilter,
} from "utilities/hooks/general/useFilters/types";
import { NetworksList } from "./components/networks-list";
import { TokensList } from "./components/tokens-list";
import useDebounce from "utilities/hooks/general/useDebounce";

export const TokensModal = forwardRef<HTMLDivElement, TokensModalProps>(
  (
    {
      allowedNetworks,
      allowedTokens,
      allowedMarkets,
      defaultNetwork,
      handleChoice,
      label = "Swap",
      onClick,
      closeModal,
    }: TokensModalProps,
    ref
  ) => {
    // Get the networks, tokens, protocols from the global store
    const networks = useYCStore((state) => state.context.YCnetworks);
    const tokens: YCToken[] = useYCStore(
      (state) => state.context.YCtokens,
      (a: YCToken[], b: YCToken[]) => a.length === b.length
    );

    /**
     * Memoizing available tokens, networks & markets
     */
    const availableNetworks: YCNetwork[] = useMemo(() => {
      // If it's not specified we assume all are available
      if (!allowedNetworks) return networks;

      // Otherwise, we only provide the allowed networks
      return allowedNetworks;
    }, [networks, networks.length, allowedNetworks, allowedNetworks?.length]);

    const availableTokens: YCToken[] = useMemo(() => {
      // If it's not specified we assume all are available
      if (!allowedTokens) return tokens;

      // Otherwise, we only provide the allowed networks
      return allowedTokens;
    }, [tokens, tokens.length, allowedTokens, allowedTokens?.length]);

    /**
     *  Current chosen (viewed) network
     */
    const [chosenNetwork, setChosenNetwork] = useState<YCNetwork>(
      defaultNetwork || availableNetworks[0]
    );

    // The text input in the user's search bar
    const [input, setInput] = useState<string>("");

    // The debounced input
    const debouncedInput = useDebounce(input, 500);

    /**
     * Filter the tokens ti display
     */

    // Filter by the chosen network
    const filterByNetwork = useMemo(() => {
      return new FilterInstance<YCToken, ChoiceFilter<YCToken, YCNetwork>>({
        name: "network_filter",
        type: FilterTypes.CHOICE,
        choice: chosenNetwork,
        callback: (item: YCToken, config: ChoiceFilter<YCToken, YCNetwork>) =>
          config.choice.id === item.network?.id,
      });
    }, [availableNetworks, availableNetworks.length, chosenNetwork.id]);

    // Filter by the text input
    const filterByInput = useMemo(() => {
      return new FilterInstance<YCToken, StringFilter<YCToken>>({
        name: "input_filter",
        type: FilterTypes.STRING,
        input: debouncedInput,
        callback: (item: YCToken, config: StringFilter<YCToken>) => {
          const lowInput = config.input.toLowerCase();
          return (
            item.address.toLowerCase() == lowInput ||
            item.name.toLowerCase().includes(lowInput) ||
            item.symbol.toLowerCase().includes(lowInput)
          );
        },
      });
    }, [debouncedInput]);

    // The filtering hook
    const tokensToDisplay = useFilters({
      items: availableTokens,
      filters: [filterByNetwork, filterByInput],
    });

    return (
      <div
        className={
          "w-[70%] h-[80%] border-[1px] border-custom-border dark:border-custom-themedBorder flex flex-row overflow-hidden mx-auto rounded-xl animate-modal"
        }
        ref={ref}
        onClick={onClick}
      >
        <div className="w-[40%] h-full bg-custom-darkSubbg flex flex-col py-4 gap-3 px-3">
          <WrappedText fontSize={16} fontStyle="bold">
            {label}
          </WrappedText>
          <NetworksList
            networks={availableNetworks}
            chosenNetwork={chosenNetwork}
            handler={setChosenNetwork}
          />
        </div>
        <div className="w-[60%] h-full bg-custom-bcomponentbg  py-7 px-16 gap-2  ">
          <WrappedInput
            placeholder="Search For A Token's Name, Symbol, Address..."
            onChange={(e) => setInput(e.target.value)}
          ></WrappedInput>
          <TokensList
            tokens={tokensToDisplay}
            handler={(token: YCToken) => {
              handleChoice(token);
              closeModal?.();
            }}
          />
        </div>
      </div>
    );
  }
);
