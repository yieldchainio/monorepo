import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import styles from "./css/strategyBuilder.module.css";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { DatabaseContext, StrategyContext } from "./Contexts/DatabaseContext";
import { ButtonVariants } from "./MotionVariants";
import { HoverDetails } from "./HoverDetails";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  Grid,
} from "react-virtualized";
import { style } from "@mui/system";
import axios from "axios";

const NetworkChip = (props: any) => {
  const [isHovered, setIsHovered] = useState<any>(false);

  const { networkDetails, choiceHandler, isChosen } = props;

  const handleClick = () => {
    choiceHandler(networkDetails.chain_id);
  };

  return (
    <motion.div
      className={styles.tokenModalNetworkChipOff}
      whileTap={{ scale: 0.975 }}
      onClick={() => handleClick()}
      style={
        isChosen
          ? {
              background:
                "linear-gradient(#202023, #202023) padding-box,linear-gradient(90deg, #00b2ec 0%, #d9ca0f 100%) border-box",
              border: "1px solid transparent",
            }
          : {}
      }
    >
      <img
        src={networkDetails.logo}
        alt=""
        className={styles.tokenModalNetworkChipIcon}
        style={{ cursor: "pointer" }}
      />
      <div style={{ cursor: "pointer" }}>{networkDetails.name}</div>
    </motion.div>
  );
};

const TokenRow = (props: any) => {
  const { tokenDetails, style, target } = props;
  return (
    <motion.div
      className={styles.tokenModalTokenRowContainer}
      style={{ ...style, scrollbarWidth: "none" }}
      whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
      onClick={() => props.choiceHandler(tokenDetails, target)}
    >
      <div className={styles.tokenModalTokenRowBorderFlex}>
        <img
          src={tokenDetails.logo}
          alt=""
          className={styles.tokenModalTokenRowIcon}
        />
        <div className={styles.tokenModalTokenRowDetailsContainer}>
          <div className={styles.tokenModalTokenRowSymbol}>
            {tokenDetails.symbol}
          </div>
          <div className={styles.tokenModalTokenRowName}>
            {tokenDetails.name}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const TokenSwapModal = (props: any) => {
  const [currentChainChoice, setCurrentChainChoice] = useState<any>("56");
  const [filteredTokens, setFilteredTokens] = useState<any>(null);
  const [searchInput, setSearchInput] = useState<any>("");

  const { fullNetworksList, fullTokensList } = useContext(DatabaseContext);
  const { actionableTokens, setActionableTokens, strategyNetworks } =
    useContext(StrategyContext);

  const { choiceHandler, target, handleModal, tokensList, isStrategy } = props;

  const networkChoiceHandler = (chain: any) => {
    setCurrentChainChoice(chain);
  };

  const handleTokenChoice = (token: any, target: any) => {
    choiceHandler(token, target);
    handleModal(false);
  };

  useEffect(() => {
    if (fullTokensList) {
      const filteredTokens = fullTokensList.filter((token: any, index: any) => {
        let isOnChain = currentChainChoice == token.chain_id;
        let isDuplicate =
          fullTokensList.findIndex(
            (token2: any) =>
              token2.address == token.address &&
              token.chain_id == token2.chain_id
          ) != index;

        let includesFiltering =
          token.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          token.symbol.toLowerCase().includes(searchInput.toLowerCase()) ||
          token.address.toLowerCase().includes(searchInput.toLowerCase());

        // TODO: Commented out part should be commented in. Commented out for testing
        // TODO: (this is to check if the token is in the actionable tokens list)
        let doesHaveAccess =
          target == "from"
            ? actionableTokens.find(
                (token2: any) => token2.address == token.address
              )
            : true;

        let filterByNetwork = !isStrategy
          ? true
          : target !== "from"
          ? true
          : strategyNetworks.find(
              (network: any) => network.chain_id == token.chain_id
            );

        return (
          isOnChain &&
          !isDuplicate &&
          includesFiltering &&
          doesHaveAccess &&
          filterByNetwork
        );
      });

      setFilteredTokens(filteredTokens);
    }
  }, [fullTokensList, searchInput, currentChainChoice]);

  return (
    <div
      className={styles.tokenModalBlurWrapper}
      style={{ zIndex: "99999999999999999" }}
      onClick={() => handleModal(false)}
    >
      <div
        className={styles.tokenModalContainer}
        style={{ zIndex: "999999999999999999" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.tokenModalTitleContainer}>
          <div>Swap From</div>
          <motion.img
            src="/closeicon.svg"
            alt=""
            className=""
            whileHover={{ scale: 0.925 }}
            style={{ color: "white", cursor: "pointer", zIndex: "150" }}
            onClick={() => handleModal(false)}
          />
        </div>
        <div className={styles.tokenModaltokensFlex}>
          <div className={styles.tokenModalSearchBarFlex}>
            <img
              src="/tokensearchicon.svg"
              alt=""
              className={styles.searchIcon}
            />
          </div>
          <input
            className={styles.tokenModalSearchBarContainer}
            placeholder="Search For A Token"
            onChange={(e: any) => setSearchInput(e.target.value)}
          />
          {!filteredTokens ? null : (
            <div
              style={{
                width: "100%",
                height: "100%",
                scrollbarWidth: "none",
                marginTop: "40px",
              }}
              className={styles.listOfTokens}
            >
              <AutoSizer>
                {({ width, height }) => (
                  <List
                    height={height}
                    width={width + width / 10}
                    rowHeight={90}
                    rowCount={filteredTokens.length}
                    rowRenderer={({ key, index, style, parent }) => {
                      return (
                        <TokenRow
                          tokenDetails={filteredTokens[index]}
                          style={style}
                          choiceHandler={handleTokenChoice}
                          target={target}
                          key={key}
                        />
                      );
                    }}
                  />
                )}
              </AutoSizer>
            </div>
          )}
        </div>
        <div className={styles.tokenModalChainsFlex}>
          {fullNetworksList
            ? fullNetworksList
                .filter((network: any) => {
                  let notAllNetworks = network.chain_id !== -500;
                  let isFrom = target == "from";
                  let isStrategyNetwork = !isStrategy
                    ? true
                    : strategyNetworks.find(
                        (network2: any) => network2.chain_id == network.chain_id
                      );

                  if (isStrategy) {
                    if (isFrom) {
                      return notAllNetworks && isStrategyNetwork;
                    } else {
                      return notAllNetworks;
                    }
                  } else {
                    return notAllNetworks;
                  }
                })
                .map((network: any, i: number) => {
                  return (
                    <NetworkChip
                      choiceHandler={networkChoiceHandler}
                      networkDetails={network}
                      isChosen={
                        currentChainChoice == network.chain_id ? true : false
                      }
                      key={i}
                    />
                  );
                })
            : null}
        </div>
      </div>
    </div>
  );
};
