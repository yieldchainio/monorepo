import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "./css/landingPage.module.css";
import Marquee from "react-fast-marquee";
import { VerfiedVaultCard } from "./vaultcards";
import { layoutNodes } from "Layouting";
import { NodeStepEnum, SizingEnum } from "StrategyBuilder/Enums";
import { NodeStep } from "StrategyBuilder/StrategyBuilder";
import { AutoLine } from "StrategyBuilder/AutoLine";
import { LoadingScreen } from "./LoadingScreen";
import {
  checkEmail,
  isSignedUp,
  isWhitelisted,
  randomNumber,
} from "utils/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion, useTransform } from "framer-motion";
import axios from "axios";
import { useAccount } from "wagmi";
import { HoverDetails } from "HoverDetails";
import { useScroll, useCycle } from "framer-motion";
import { StaticFrequencyModal } from "StrategyBuilder/FrequencyModal";
import { MediumActionButton } from "StrategyBuilder/MediumNodes";
import { testNodesData } from "./landingpagestrategy";
import { ProtocolCard } from "./ProtocolCard";
import { useNavigate } from "react-router-dom";
import { SignUpModal } from "./SignupModal";
import { DatabaseContext } from "Contexts/DatabaseContext";

export const handleLaunchApp = async (address: any, navigate: any) => {
  let iswhitelisted = await isWhitelisted(address);
  if (iswhitelisted) {
    const domain = window.location.host;
    const port = window.location.port;
    if (domain.includes("localhost"))
      window.open(`http://app.localhost:${port}/`, "_blank");
    else window.open(`https://app.${domain}/`, "_blank");
  } else {
    navigate("/whitelist");
  }
};

export const ConnectWalletButtonCustom = (props: any) => {
  const { whenConnected, showNetwork, showBalance } = props;

  return (
    <div>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          // Note: If your app doesn't use authentication, you
          // can remove all 'authenticationStatus' checks
          const ready = mounted && authenticationStatus !== "loading";
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === "authenticated");

          return (
            <div
              {...(!ready && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <motion.button
                      onClick={openConnectModal}
                      type="button"
                      className={styles.connectWalletButton}
                      whileHover={{
                        scale: 1.05,
                        filter:
                          "drop-shadow(0 0 6px rgba(255, 255, 255, 0.305))",
                      }}
                    >
                      Connect Wallet
                    </motion.button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button onClick={openChainModal} type="button">
                      Unsupported network
                    </button>
                  );
                }

                if (whenConnected == "signup") {
                  return <SignUpButton modalHandler={props.modalHandler} />;
                }
                return (
                  <div style={{ display: "flex", gap: 12 }}>
                    {showNetwork == true || showNetwork == undefined ? (
                      <button
                        onClick={() => console.log("Show network", showNetwork)}
                        style={{ display: "flex", alignItems: "center" }}
                        type="button"
                        className={styles.connectWalletButton}
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 12,
                              height: 12,
                              borderRadius: 999,
                              overflow: "hidden",
                              marginRight: 4,
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl}
                                style={{ width: 12, height: 12 }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </button>
                    ) : null}

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className={styles.connectWalletButton}
                    >
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ""}
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
};

export const LandingHeader = (props: any) => {
  const { width } = props;
  const { address } = useAccount();
  const navigate = useNavigate();

  return (
    <div className={styles.headerContainer} style={{ gap: `${width - 670}px` }}>
      <img src="/yieldchainLogoFull.svg" alt="" className={styles.headerLogo} />
      <div className={styles.headerButtonsContainer}>
        <motion.div
          className={styles.launchAppButton}
          whileHover={{
            scale: 1.05,
          }}
          onClick={() => handleLaunchApp(address, navigate)}
        >
          Launch App
        </motion.div>
        <div className={styles.connectWalletButton}>
          <ConnectWalletButtonCustom showNetwork={false} />
        </div>
      </div>
    </div>
  );
};

export const SignUpButton = (props: any) => {
  return (
    <div>
      <motion.div
        className={styles.signUpButton}
        whileHover={{ scale: 1.05 }}
        onClick={() => props.modalHandler(!props.modalStatus)}
        transition={{
          duration: 0.1,
        }}
      >
        {"Sign Me UP"}
      </motion.div>
    </div>
  );
};

const ActionsProtocolsPageActionButton = (props: any) => {
  return (
    <MediumActionButton
      imgStyle={{
        width: "32px",
        height: "32px",
      }}
      nameStyle={{
        fontSize: "12px",
      }}
      actionDetails={{ name: props.name }}
      style={props.style}
      animate={{
        y: props.y,
      }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        delay: Math.random() * Math.random() * 1,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    />
  );
};
export const LandingPage = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // User's address
  const [page, setPage] = useState<number>(0);

  const [y, cycleY] = useCycle(0, Math.random() * 25, 0);

  useEffect(() => {
    cycleY();
  }, []);

  const changeDimensions = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", changeDimensions);
    return () => {
      window.removeEventListener("resize", changeDimensions);
    };
  }, [windowSize]);

  const pageRef = useRef<any>();
  const cardsPageRef = useRef<any>();
  const { scrollY }: any = useScroll({ container: pageRef });
  const [scrollYState, setScrollYState] = useState<any>(0);

  const [nodesToLayout, setNodesToLayout] = useState([]);

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const layoutedNodes: any = layoutNodes(testNodesData, window.innerWidth);
    setNodesToLayout(layoutedNodes);
  }, []);

  // Random Refs
  const gasCardRef = useRef<any>(null);
  const automationCardRef = useRef<any>(null);
  const composabilityCardRef = useRef<any>(null);

  const redWojakRef = useRef<any>(null);
  const greenWojaksRef = useRef<any>(null);
  const singleGreenWojakRef = useRef<any>(null);
  const greenArrowsRef = useRef<any>(null);
  const floatingAaveRef = useRef<any>(null);
  const floatingUnknownLeftRef = useRef<any>(null);
  const floatingUnknownRightRef = useRef<any>(null);
  const floatingUniswapRef = useRef<any>(null);
  const frequencyModalRef = useRef<any>(null);
  const cogWheelRef = useRef<any>(null);
  const protocolsContainerRef = useRef<any>(null);

  scrollY.onChange((latest: any) => {
    if (latest <= windowSize.height * 5.2) {
      if (latest <= windowSize.height * 4.4) {
        if (latest <= windowSize.height * 3.8) setPage(1);
        else setPage(2);
      } else setPage(3);
    }
    setScrollYState(latest);
  });

  // Variants for animations

  const gasCardStates = {
    visible: {
      left: "5vw",
      top: `20vh`,
    },
    hidden: {
      top: "-100vh",
    },
  };

  const automationCardStates = {
    visible: {
      top: "20vh",
    },
    hidden: {
      top: "-100vh",
    },
    initial: {
      top: "150vh",
    },
  };

  const greenArrowsStates = {
    visible: {
      marginLeft: `${
        greenWojaksRef.current
          ? windowSize.width -
            greenWojaksRef.current.getBoundingClientRect().width +
            (windowSize.width < 537
              ? greenWojaksRef.current.getBoundingClientRect().width / 3
              : 0)
          : 3000
      }px`,
      marginTop: `${
        greenWojaksRef.current
          ? greenWojaksRef.current.getBoundingClientRect().top -
            greenArrowsRef.current.getBoundingClientRect().height / 1.75
          : 3000
      }px`,
    },
    hidden: {
      marginLeft: "125vw",
    },
  };

  const cardTitleStates = {
    initial: {
      fontSize: "94px",
    },
    scrolled: {
      fontSize: "64px",
    },
  };

  const cardDescriptionStates = {
    initial: {
      fontSize: "36px",
      marginTop: "32px",
    },
    scrolled: {
      fontSize: "24px",
      marginTop: "12px",
    },
  };

  const composabilityCardStates = {
    initial: {
      width: "90vw",
      height: "30vh",
      left: "5vw",
      top: "20vh",
    },
    scrolled: {
      width: "80vw",
      height: "21vh",
      left: "10vw",
      top: "10vh",
    },
  };

  const greenWojaksStates = {
    visible: {
      left: `${
        greenWojaksRef.current
          ? windowSize.width -
            greenWojaksRef.current.getBoundingClientRect().width -
            20 +
            (windowSize.width < 537
              ? greenWojaksRef.current.getBoundingClientRect().width / 3
              : 0)
          : 0
      }px`,
      top: `${
        windowSize.height -
        (greenWojaksRef.current
          ? greenWojaksRef.current.getBoundingClientRect().height
          : 3000)
      }px`,
    },
    hidden: {
      top: `${
        windowSize.height -
        (greenWojaksRef.current
          ? greenWojaksRef.current.getBoundingClientRect().height
          : 3000)
      }px`,
      left: `${windowSize.width * 1.1}px`,
    },
  };

  const redWojakStates = {
    visible: {
      left: `-${
        windowSize.width < 537
          ? redWojakRef.current
            ? redWojakRef.current.getBoundingClientRect().width / 3.3
            : 0
          : 0
      }px`,
    },
    hidden: {
      left: `-${
        redWojakRef.current
          ? redWojakRef.current.getBoundingClientRect().width * 1.2
          : 1000
      }px`,
    },
  };

  const staticFrequencyModalStates = {
    visible: {
      marginTop: "45vh",

      width: "50.5vw",
      height: "43.5vh",
      marginLeft: `25vw`,
    },
    hidden: {
      marginTop: "-50vh",
      width: "50.5vw",
      height: "43.5vh",
      marginLeft: `25vw`,
    },
    initial: {
      marginTop: "110vh",
      width: "50.5vw",
      height: "43.5vh",
      marginLeft: `25vw`,
    },
  };

  const robotEmojiStates = {
    visible: {
      left: "2vw",
    },
    hidden: {
      left: "-50vw",
    },
  };

  const cogWheelEmojiStates = {
    visible: {
      left: `calc(100vw - ${
        cogWheelRef.current?.getBoundingClientRect().width /
        (windowSize.width <= 768 ? 1.5 : 1)
      }px)`,
      top: `${
        gasCardRef.current?.getBoundingClientRect().top +
        gasCardRef.current?.getBoundingClientRect().height *
          (windowSize.width <= 768 ? 4 : 4.65)
      }px`,
      position: "absolute",
    },
    hidden: {
      left: "120vw",
      top: `${
        gasCardRef.current?.getBoundingClientRect().top +
        gasCardRef.current?.getBoundingClientRect().height *
          (windowSize.width <= 768 ? 4 : 4.65)
      }px`,
      position: "absolute",
    },
  };

  const floatingLeftStates = {
    visible: {
      left: "16vw",
    },

    hidden: {
      left: `-100vw`,
    },
  };

  const [fullProtocolsList, setFullProtocolsList] = useState<any>(null);
  const [fullStrategiesList, setFullStrategiesList] = useState<any>(null);

  useEffect(() => {
    axios
      .get("https://api.yieldchain.io/strategies")
      .then((res) => setFullStrategiesList(res.data.strategies));
    axios
      .get("https://api.yieldchain.io/protocols")
      .then((res) => setFullProtocolsList(res.data.protocols));
  }, []);

  const [loadingOpen, setLoadingOpen] = useState<boolean>(true);

  const closeLoading = async () => {
    let timeoutPromise: boolean = await new Promise((resolve) => {
      setTimeout(() => {
        console.log("Time out finishe ser");
        resolve(false);
      }, 5000);
    });

    setLoadingOpen(timeoutPromise);
  };

  useEffect(() => {
    if (
      fullStrategiesList !== null &&
      fullProtocolsList !== null &&
      loadingOpen === true
    ) {
      console.log("Closing loading");
      closeLoading();
    }
    return () => {
      setLoadingOpen(true);
    };
  }, [fullStrategiesList, fullProtocolsList]);

  return (
    <div>
      {modalOpen && <SignUpModal handler={setModalOpen} theme="dark" />}
      {loadingOpen && <LoadingScreen handler={setLoadingOpen} />}

      <div
        className={styles.pageDiv}
        style={{
          width: windowSize.width,
          height: windowSize.height,
          zIndex: "10000",
        }}
        ref={pageRef}
      >
        <LandingHeader width={windowSize.width} />
        <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
          <div className={styles.earnTopCyanBlur}></div>
          <div className={styles.heroPageBottomBlackBlur}></div>
        </div>

        <div className={styles.heroPageHigher}>
          <div className={styles.heroPageleftContainer}>
            <motion.div
              className={styles.heroLeftTextContainer}
              initial={{
                scale: 0.1,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                duration: 1.25,
              }}
            >
              <div className={styles.singleRowTextFlex}>
                <div className={styles.heroPageWhiteTextFull}>Can </div>
                <div className={styles.heroPageWhiteTextStrikethrough}>
                  the devs
                </div>
              </div>
              <div className={styles.heroPageGradientText}>YOU</div>
              <div className={styles.heroPageWhiteTextFull}>do something?</div>
            </motion.div>
            <motion.div
              className={styles.heroPageEarlyAccessContainer}
              initial={{
                scale: 0.1,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                duration: 1.25,
              }}
            >
              <div className={styles.heroPageEarlyAccessText}>
                Get Early Access To DeFi ∞.0
              </div>

              <ConnectWalletButtonCustom
                whenConnected={"signup"}
                modalHandler={setModalOpen}
                modalStatus={modalOpen}
              />
            </motion.div>
            <div className={styles.blackBackdropMobile}></div>
          </div>
        </div>
        <div
          className={styles.heroPage}
          style={{ zIndex: "1", overflowX: "hidden" }}
        >
          <div className={styles.heroPageRightContainer}>
            <div className={styles.heroPageBottomYellowBlur}></div>
          </div>
        </div>
        <div className={styles.defiToysBlueBlur}></div>
        <div
          className={styles.nodesContainer}
          style={{
            left: windowSize.width <= 768 ? "30vw" : "47.5vw",
          }}
        >
          {nodesToLayout.length &&
            nodesToLayout.map((step: any, index: number) => {
              let tStyle = {
                top: `${
                  96 +
                  step.position.y +
                  (step.step_identifier == 10
                    ? 0
                    : step.step_identifier <= 6
                    ? 0
                    : windowSize.height / 9)
                }px`,
                left: `${step.position.x + windowSize.width / 10 + 163.5}px`,
                position: "relative",
                zIndex: `1000`,
              };

              let doesHaveStepDetails = step.function_identifiers.length > 0;
              let isPlaceholder = step.type == NodeStepEnum.PLACEHOLDER;
              let nodeChilds = step.children;

              let currentNodeProcessStep;

              if (doesHaveStepDetails) {
                currentNodeProcessStep = NodeStepEnum.COMPLETE;
              } else if (step.type == NodeStepEnum.CHOOSE_ACTION) {
                currentNodeProcessStep = NodeStepEnum.CHOOSE_ACTION;
              } else if (step.type == NodeStepEnum.PLACEHOLDER) {
                currentNodeProcessStep = NodeStepEnum.PLACEHOLDER;
              } else if (step.type == NodeStepEnum.CONFIG_ACTION) {
                currentNodeProcessStep = NodeStepEnum.CONFIG_ACTION;
              }

              return (
                <div>
                  <NodeStep
                    size={SizingEnum.MEDIUM}
                    stepId={step.step_identifier}
                    style={tStyle}
                    processStep={currentNodeProcessStep}
                    key={index}
                    stepDetails={step}
                    optionalAction={{
                      name: "Stake",
                      action_identifier: "1",
                      single_function: false,
                      hidden: false,
                    }}
                  />
                  {nodeChilds
                    ? nodeChilds.map((child: any, indexx: number) => {
                        let newObj = {
                          ...child.data,
                          position: { x: child.x, y: child.y },
                        };
                        return (
                          <AutoLine
                            parentNode={{
                              width: step.width,
                              height: step.height,
                              position: {
                                x:
                                  step.position.x +
                                  windowSize.width / 10 +
                                  163.5,
                                y:
                                  96 +
                                  step.position.y +
                                  (step.step_identifier == 10
                                    ? 0
                                    : step.step_identifier <= 6
                                    ? 0
                                    : windowSize.height / 9),
                              },
                            }}
                            childNode={{
                              width: newObj.width,
                              height: newObj.height,
                              position: {
                                x:
                                  newObj.position.x +
                                  windowSize.width / 10 +
                                  163.5,
                                y:
                                  96 +
                                  newObj.position.y +
                                  (newObj.step_identifier == 10
                                    ? 0
                                    : newObj.step_identifier <= 6
                                    ? 0
                                    : windowSize.height / 9),
                              },
                              type: newObj.type,
                              empty: newObj.empty ? newObj.empty : false,
                            }}
                            key={indexx}
                          />
                        );
                      })
                    : null}
                </div>
              );
            })}
        </div>

        <div className={styles.defiToysPageHigher}>
          <div
            className={styles.blackBackdropMobile}
            style={{
              marginTop: "-10vh",
              filter: "blur(100px)",
            }}
          ></div>
          <div className={styles.defiToysTextContainer}>
            <div className={styles.defiToysTitleText}>DeFi Toys.</div>
            <div className={styles.defiToysDescriptionText}>
              Your mom was WRONG, here is a tree of money{" "}
              {windowSize.width <= 768 ? "🎄💸" : "👉"}
            </div>
            <div className={styles.defiToysDescriptionText}>
              And you are the farmer 🧑‍🌾
            </div>
          </div>
        </div>

        <div className={styles.earnPage}>
          <div className={styles.earnPageGradientBlur}></div>
          <div className={styles.earnTopBlackBlur}></div>
          <div className={styles.earnTextContainer}>
            <div className={styles.earnTitle}>Earn W/ 1 Click</div>
            <div className={styles.earnDescription}>
              Create your own strategies & share them, or browse ones made by
              others.
            </div>
          </div>
          <Marquee
            className={styles.earnVaultsGrid}
            gradient={false}
            speed={windowSize.width / 40}
            style={{
              gap: `${windowSize.width <= 768 ? "10px" : "25px"}}`,
            }}
          >
            {fullStrategiesList
              ? [...fullStrategiesList].map(
                  (strategy: any, index: number, arr: any[]) => {
                    return (
                      <VerfiedVaultCard
                        key={strategy.strategy_identifier}
                        vaultDetails={strategy}
                        style={{
                          marginLeft:
                            index == 0
                              ? "-10px"
                              : `${windowSize.width <= 768 ? "2px" : "15px"}`,
                          overflow: "hidden",
                          scale: `${windowSize.width <= 768 ? 0.8 : 0.9}`,
                        }}
                      />
                    );
                  }
                )
              : null}
          </Marquee>
          <div className={styles.earnBottomBlackBlur}></div>
        </div>

        <div className={styles.gasPage} ref={cardsPageRef}>
          {windowSize.width > 768 && (
            <div
              style={{
                position: "sticky",
                top: "0vh",
                width: "100vw",
                height: "100vh",
              }}
            >
              <motion.div
                className={styles.gasPageRedBlur}
                style={{
                  willChange: "background-color",
                }}
                animate={{
                  backgroundColor:
                    page == 3
                      ? "rgba(59, 42, 249, 0.6)"
                      : page == 2
                      ? "rgba(136, 124, 201, 0.634)"
                      : "rgba(255, 4, 4)",
                }}
                layout
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  type: "spring",
                }}
              ></motion.div>
              <motion.div
                className={styles.gasPageGreenBlur}
                style={{
                  willChange: "background-color",
                }}
                animate={{
                  backgroundColor:
                    page == 3
                      ? "rgba(249, 42, 142, 1)"
                      : page == 2
                      ? "rgba(4, 240, 255, 1)"
                      : "rgba(160, 196, 74, 1)",
                }}
              ></motion.div>
              <motion.div
                ref={gasCardRef}
                className={styles.gasGlassContainer}
                variants={gasCardStates}
                style={{ willChange: "left, top" }}
                animate={page <= 1 ? "visible" : "hidden"}
                layout
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  type: "spring",
                }}
              >
                <div className={styles.moreFrensLessGasText}>
                  More Frens = Less Gas
                </div>
                <div className={styles.gasDescription}>
                  bundle up with anons to save on gas fees ⛽{" "}
                </div>
              </motion.div>
              <motion.div
                className={styles.greenWojaksContainer}
                variants={greenWojaksStates}
                style={{
                  position: "absolute",
                }}
                animate={page <= 1 ? "visible" : "hidden"}
                ref={greenWojaksRef}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  type: "spring",
                }}
              >
                <img
                  src="/greenwojak.svg"
                  alt=""
                  className={styles.greenWojak}
                  ref={singleGreenWojakRef}
                />
                <img
                  src="/greenwojak.svg"
                  alt=""
                  className={styles.greenWojak}
                />
                <img
                  src="/greenwojak.svg"
                  alt=""
                  className={styles.greenWojak}
                />
              </motion.div>
              <motion.div
                className={styles.greenArrowsContainer}
                variants={greenArrowsStates}
                ref={greenArrowsRef}
                animate={page <= 1 ? "visible" : "hidden"}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  type: "spring",
                }}
              >
                <img
                  src="/greenArrowUp.svg"
                  alt=""
                  className={styles.greenArrow}
                />
                <img
                  src="/greenArrowUp.svg"
                  alt=""
                  className={styles.greenArrow}
                />
                <img
                  src="/greenArrowUp.svg"
                  alt=""
                  className={styles.greenArrow}
                />
              </motion.div>
              <div>
                <motion.img
                  ref={redWojakRef}
                  src="/redwojak.svg"
                  alt=""
                  variants={redWojakStates}
                  className={styles.redWojak}
                  animate={page <= 1 ? "visible" : "hidden"}
                  style={{
                    top: `${
                      windowSize.height -
                      redWojakRef.current?.getBoundingClientRect().height
                    }px`,
                  }}
                  layout
                  transition={{
                    duration: 2,
                  }}
                />
              </div>
              <motion.div
                className={styles.metamaskTxidContainer}
                layout
                animate={{
                  left:
                    page <= 1
                      ? `${
                          redWojakRef.current?.getBoundingClientRect().left +
                          redWojakRef.current?.getBoundingClientRect().width -
                          (windowSize.width <= 768 ? 10 : 30)
                        }px`
                      : `-20vw`,

                  top: `${
                    redWojakRef.current &&
                    windowSize.height -
                      redWojakRef.current.getBoundingClientRect().height * 1.12
                  }px`,
                }}
                transition={{
                  duration: 0.75,
                }}
              >
                <img
                  src="/metamask.svg"
                  alt=""
                  className={styles.metaMaskImg}
                />
                <div className={styles.redTextContainer}>
                  <div className={styles.redEthText}>0.4 ETH</div>
                  <div className={styles.redDollarsText}>$251.93</div>
                </div>
                <div className={styles.metamaskButtonsContainer}>
                  <div className={styles.cancelButton}>Cancel</div>
                  <div className={styles.getRektButton}>Get Rekt</div>
                </div>
              </motion.div>
              <motion.div
                ref={automationCardRef}
                className={styles.gasGlassContainer}
                variants={automationCardStates}
                animate={
                  page <= 1 ? "initial" : page == 2 ? "visible" : "hidden"
                }
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  type: "spring",
                }}
              >
                <motion.div className={styles.moreFrensLessGasText}>
                  Wen? 👀 - Your Call ⚡
                </motion.div>
                <div className={styles.gasDescription}>
                  {
                    "Automate your strategies the way you’d like - Execute them on a regular basis.⚙️⚡"
                  }
                </div>
              </motion.div>
              {windowSize.width > 800 && (
                <StaticFrequencyModal
                  variants={staticFrequencyModalStates}
                  animationConiditon={
                    page <= 1 ? "initial" : page == 2 ? "visible" : "hidden"
                  }
                  ref={frequencyModalRef}
                />
              )}
              <motion.img
                alt=""
                src="/hehe.png"
                className={styles.automationPageCogWheel}
                variants={cogWheelEmojiStates}
                ref={cogWheelRef}
                animate={
                  page <= 1 ? "hidden" : page == 2 ? "visible" : "hidden"
                }
                layout
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  type: "spring",
                }}
              />
              <motion.div
                className={styles.automationPageRobot}
                variants={robotEmojiStates}
                style={{
                  position: "absolute",
                  top: `${
                    gasCardRef.current?.getBoundingClientRect().top +
                    gasCardRef.current?.getBoundingClientRect().height *
                      (windowSize.width <= 768 ? 4 : 4.65)
                  }px`,
                  marginLeft: `${windowSize.width <= 768 ? -10 : 0}vw`,
                  transform: "rotate(-13.34deg)",
                }}
                animate={
                  page == 2 ? (page <= 1 ? "hidden" : "visible") : "hidden"
                }
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  type: "spring",
                }}
              >
                🤖
              </motion.div>
              <motion.div
                ref={composabilityCardRef}
                className={styles.gasGlassContainer}
                variants={automationCardStates}
                animate={page < 3 ? "initial" : "visible"}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  type: "spring",
                }}
                style={{
                  padding: "3vw",
                  gap: "3vw",
                }}
              >
                <motion.div
                  className={styles.moreFrensLessGasText}
                  style={{
                    marginTop: `${windowSize.width <= 768 ? 0 : 0}vw`,
                  }}
                >
                  Bluechips-Only? HELL NAH 😎 🙅‍{" "}
                </motion.div>
                <div
                  className={styles.gasDescription}
                  style={{
                    fontSize: `${windowSize.width <= 768 ? "3.5vw" : ""}`,
                    marginTop: `${windowSize.width <= 768 ? -3 : 0}vw`,
                  }}
                >
                  {
                    "A composable system, enabling instant integration of brand new protocols & actions 🤯 🚀"
                  }
                </div>
              </motion.div>
              <motion.div
                variants={floatingLeftStates}
                className={styles.highLeftActionContainer}
                animate={{
                  left:
                    page == 2
                      ? `-${
                          floatingAaveRef.current?.getBoundingClientRect()
                            .width * 1.2
                        }px`
                      : `${
                          composabilityCardRef.current?.getBoundingClientRect()
                            .left * (windowSize.width <= 768 ? 1.15 : 1.5)
                        }px`,

                  scale:
                    windowSize.width <= 768
                      ? 0.5
                      : windowSize.width <= 1000
                      ? 0.7
                      : 1,

                  top: `${
                    composabilityCardRef.current?.getBoundingClientRect().top +
                    floatingAaveRef.current?.getBoundingClientRect().height /
                      (windowSize.width <= 768 ? 3 : 2)
                  }px`,
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  type: "spring",
                }}
                ref={floatingAaveRef}
              >
                <motion.img
                  className={styles.floatingProtocolImg}
                  alt=""
                  src={"/aave.svg"}
                  animate={{
                    y: y,
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: randomNumber(1, 10) * randomNumber(0.05, 0.5),
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
                <ActionsProtocolsPageActionButton
                  name={"Lend"}
                  style={{
                    marginLeft: "200px",
                    marginTop: "-125px",
                    width: "113px",
                    height: "107px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
                  }}
                  y={y}
                />
              </motion.div>
              <motion.div
                className={styles.lowLeftActionContainer}
                animate={{
                  left:
                    page == 2
                      ? `-${
                          floatingUnknownLeftRef.current?.getBoundingClientRect()
                            .width * 10
                        }px`
                      : "-10px",

                  marginLeft: `-${
                    floatingUnknownLeftRef.current?.getBoundingClientRect()
                      .width / 3
                  }px`,

                  scale:
                    windowSize.width <= 768
                      ? 0.75
                      : windowSize.width <= 1000
                      ? 0.875
                      : 1,

                  top: `${
                    composabilityCardRef.current?.getBoundingClientRect().top +
                    composabilityCardRef.current?.getBoundingClientRect()
                      .height +
                    floatingUnknownLeftRef.current?.getBoundingClientRect()
                      .height
                  }px`,
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  type: "spring",
                }}
                ref={floatingUnknownLeftRef}
              >
                <motion.img
                  className={styles.floatingProtocolImg}
                  alt=""
                  src={"/unknownprotocol.svg"}
                  style={{
                    marginLeft: "-20px",
                  }}
                  animate={{
                    y: y,
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: Math.random() * Math.random() * 1,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
                <ActionsProtocolsPageActionButton
                  name={"Stake"}
                  y={y}
                  style={{
                    marginLeft: "-100px",
                    marginTop: "-40vh",
                    marginBottom: "0vw",
                    width: "113px",
                    height: "107px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
                  }}
                />
                <ActionsProtocolsPageActionButton
                  name={"Harvest"}
                  y={y}
                  style={{
                    marginLeft: "-200px",
                    marginTop: "-33vh",
                    marginBottom: "0vw",
                    width: "113px",
                    height: "107px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
                  }}
                />
              </motion.div>
              <motion.div
                className={styles.lowRightActionContainer}
                animate={{
                  left:
                    page < 3
                      ? "120vw"
                      : `${
                          composabilityCardRef.current?.getBoundingClientRect()
                            .left +
                          composabilityCardRef.current?.getBoundingClientRect()
                            .width -
                          floatingUniswapRef.current?.getBoundingClientRect()
                            .width /
                            1.25
                        }px`,
                  scale:
                    windowSize.width <= 768
                      ? 0.7
                      : windowSize.width <= 1000
                      ? 0.8
                      : 1,
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  type: "spring",
                }}
                ref={floatingUniswapRef}
              >
                <motion.img
                  className={styles.floatingProtocolImg}
                  alt=""
                  src={"/uniswap.svg"}
                  animate={{
                    y: y,
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: Math.random() * Math.random() * 1,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
                <ActionsProtocolsPageActionButton
                  name={"LP Zap"}
                  y={y}
                  style={{
                    marginLeft: "-90px",
                    marginTop: "-100px",
                    width: "113px",
                    height: "107px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
                  }}
                />
                <ActionsProtocolsPageActionButton
                  name={"Add Liquidity"}
                  y={y}
                  style={{
                    marginLeft: "-180px",
                    marginTop: "-170px",
                    width: "113px",
                    height: "107px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
                  }}
                />
              </motion.div>
              <motion.div
                ref={floatingUnknownRightRef}
                className={styles.highRightActionContainer}
                animate={{
                  left:
                    page == 2
                      ? "120vw"
                      : `${
                          composabilityCardRef.current?.getBoundingClientRect()
                            .left +
                          composabilityCardRef.current?.getBoundingClientRect()
                            .width -
                          floatingUnknownRightRef.current?.getBoundingClientRect()
                            .width
                        }px`,
                  scale:
                    windowSize.width <= 768
                      ? 0.5
                      : windowSize.width <= 1000
                      ? 0.7
                      : 1,
                  top: `${
                    composabilityCardRef.current?.getBoundingClientRect().top -
                    floatingUnknownRightRef.current?.getBoundingClientRect()
                      .height /
                      (windowSize.width <= 1000
                        ? windowSize.width <= 768
                          ? 4.5
                          : 9.5
                        : -2.5)
                  }px`,
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  type: "spring",
                }}
              >
                <motion.img
                  className={styles.floatingProtocolImg}
                  alt=""
                  src={"/unknownprotocol.svg"}
                  animate={{
                    y: y,
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: Math.random() * Math.random() * 1,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
                <ActionsProtocolsPageActionButton
                  name={"Cross-Chain Swap"}
                  y={y}
                  style={{
                    marginLeft: "-215px",
                    marginTop: "-180px",
                    marginBottom: "0vw",
                    width: "113px",
                    height: "107px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
                    zIndex: "1",
                  }}
                />
              </motion.div>
              {fullProtocolsList && windowSize.width > 800 && (
                <motion.div
                  className={styles.protocolsContainer}
                  ref={protocolsContainerRef}
                  style={{
                    left: `${
                      windowSize.width / 2 -
                      protocolsContainerRef.current?.getBoundingClientRect()
                        .width /
                        (windowSize.width <= 768
                          ? 1
                          : windowSize.width <= 1124
                          ? 1.375
                          : 2)
                    }px`,
                  }}
                >
                  <ProtocolCard protocolDetails={fullProtocolsList[0]} />
                  <ProtocolCard protocolDetails={fullProtocolsList[1]} />
                  <ProtocolCard protocolDetails={fullProtocolsList[2]} />
                </motion.div>
              )}
            </div>
          )}
          {windowSize.width <= 768 && (
            <div
              style={{
                position: "sticky",
                top: "0vh",
                width: "100vw",
                height: "300vh",
              }}
            >
              <div
                style={{
                  position: "sticky",
                  top: "0vh",
                  width: "100vw",
                  height: "100vh",
                }}
              >
                {" "}
                <motion.div
                  className={styles.gasPageRedBlur}
                  style={{
                    willChange: "background-color",
                  }}
                  animate={{
                    backgroundColor:
                      page == 3
                        ? "rgba(59, 42, 249, 0.6)"
                        : page == 2
                        ? "rgba(136, 124, 201, 0.634)"
                        : "rgba(255, 4, 4)",
                  }}
                  layout
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    type: "spring",
                  }}
                ></motion.div>
                <motion.div
                  className={styles.gasPageGreenBlur}
                  style={{
                    willChange: "background-color",
                  }}
                  animate={{
                    backgroundColor:
                      page == 3
                        ? "rgba(249, 42, 142, 1)"
                        : page == 2
                        ? "rgba(4, 240, 255, 1)"
                        : "rgba(160, 196, 74, 1)",
                  }}
                ></motion.div>
              </div>
              <motion.div
                ref={gasCardRef}
                className={styles.gasGlassContainer}
                layout
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  type: "spring",
                }}
                style={{
                  width: "85vw",
                  height: "55vh",
                  justifyContent: "flex-start",
                  paddingTop: "6vh",
                  left: "7.5vw",
                  top: "30vh",
                }}
              >
                <div className={styles.moreFrensLessGasText}>More Frens</div>
                <div className={styles.moreFrensLessGasText}>=</div>
                <div className={styles.moreFrensLessGasText}>Less Gas</div>

                <div
                  className={styles.gasDescription}
                  style={{
                    width: "70vw",
                    textAlign: "center",
                  }}
                >
                  bundle up with anons to save on gas fees ⛽{" "}
                </div>
                <div
                  style={{
                    marginLeft: "auto",
                    marginTop: "auto",
                    alignSelf: "flex-end",
                    position: "relative",
                    bottom: "0vh",
                    order: 3,
                    display: "flex",
                    flexDirection: "row",
                    right: "12vw",
                    zIndex: "20",
                    marginBottom: "-25vh",
                  }}
                >
                  <motion.div
                    className={styles.greenWojaksContainer}
                    ref={greenWojaksRef}
                    style={{
                      marginLeft: "auto",
                      marginTop: "auto",
                      marginRight: "4vw",
                      alignSelf: "flex-end",
                      position: "relative",
                    }}
                  >
                    <img
                      src="/greenwojak.svg"
                      alt=""
                      className={styles.greenWojak}
                      ref={singleGreenWojakRef}
                      style={{
                        width: "20vw",
                      }}
                    />
                    <img
                      src="/greenwojak.svg"
                      alt=""
                      className={styles.greenWojak}
                      style={{
                        width: "20vw",
                      }}
                    />
                    <img
                      src="/greenwojak.svg"
                      alt=""
                      className={styles.greenWojak}
                      style={{
                        width: "20vw",
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className={styles.greenArrowsContainer}
                    ref={greenArrowsRef}
                    style={{
                      marginRight: "-25.5vw",
                      marginTop: "auto",
                      alignSelf: "flex-end",
                      position: "relative",
                      bottom: "7vh",
                    }}
                  >
                    <img
                      src="/greenArrowUp.svg"
                      alt=""
                      className={styles.greenArrow}
                    />
                    <img
                      src="/greenArrowUp.svg"
                      alt=""
                      className={styles.greenArrow}
                    />
                    <img
                      src="/greenArrowUp.svg"
                      alt=""
                      className={styles.greenArrow}
                    />
                  </motion.div>
                </div>
                <div
                  style={{
                    marginTop: "auto",
                    alignSelf: "flex-start",
                    position: "relative",
                    bottom: "0vh",
                    order: 4,
                    display: "flex",
                    flexDirection: "row",
                    zIndex: "20",
                  }}
                >
                  <motion.img
                    ref={redWojakRef}
                    src="/redwojak.svg"
                    alt=""
                    className={styles.redWojak}
                    style={{
                      position: "relative",
                      top: "0px",
                      left: "0px",
                      width: "25vw",
                    }}
                  />
                  <motion.div
                    className={styles.metamaskTxidContainer}
                    style={{
                      position: "relative",
                      top: "0px",
                      left: "-5vw",
                    }}
                  >
                    <img
                      src="/metamask.svg"
                      alt=""
                      className={styles.metaMaskImg}
                    />
                    <div className={styles.redTextContainer}>
                      <div className={styles.redEthText}>0.4 ETH</div>
                      <div className={styles.redDollarsText}>$251.93</div>
                    </div>
                    <div className={styles.metamaskButtonsContainer}>
                      <div className={styles.cancelButton}>Cancel</div>
                      <div className={styles.getRektButton}>Get Rekt</div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div
                ref={automationCardRef}
                className={styles.gasGlassContainer}
                style={{
                  top: "130vh",
                  width: "85vw",
                  height: "55vh",
                  justifyContent: "flex-start",
                  paddingTop: "6vh",
                  left: "7.5vw",
                }}
              >
                <div className={styles.moreFrensLessGasText}>Wen? 👀</div>
                <div className={styles.moreFrensLessGasText}>-</div>
                <div className={styles.moreFrensLessGasText}>Your Call ⚡</div>
                <div className={styles.gasDescription}>
                  {
                    "Automate your strategies the way you’d like - Execute them on a regular basis.⚙️⚡"
                  }
                </div>
              </motion.div>

              <motion.img
                alt=""
                src="/hehe.png"
                className={styles.automationPageCogWheel}
                ref={cogWheelRef}
                animate={{
                  top: `calc(130vh + ${
                    automationCardRef.current?.getBoundingClientRect().height /
                      2 -
                    scrollYState / 5 +
                    800
                  }px)`,
                }}
                style={{
                  zIndex: "100",
                  width: "35vw",
                  left: "70%",
                  position: "absolute",
                }}
                layout
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  type: "spring",
                }}
              />
              <motion.div
                className={styles.automationPageRobot}
                variants={robotEmojiStates}
                style={{
                  zIndex: "100",
                  width: "35vw",
                  left: "0%",
                  position: "absolute",
                  transform: "rotate(-13.34deg)",
                  fontSize: "25.8333vw",
                }}
                animate={{
                  top: `calc(130vh + ${
                    automationCardRef.current?.getBoundingClientRect().height /
                      2 -
                    scrollYState / 5 +
                    800
                  }px)`,
                }}
              >
                🤖
              </motion.div>
              <motion.div
                ref={composabilityCardRef}
                className={styles.gasGlassContainer}
                style={{
                  top: "230vh",
                  width: "85vw",
                  height: "55vh",
                  justifyContent: "flex-start",
                  paddingTop: "6vh",
                  left: "7.5vw",
                }}
              >
                <motion.div
                  className={styles.moreFrensLessGasText}
                  style={{
                    fontSize: "9vw",
                  }}
                >
                  Bluechips-Only?
                </motion.div>
                <motion.div
                  className={styles.moreFrensLessGasText}
                  style={{
                    fontSize: "10vw",
                  }}
                >
                  HELL NAH 😎 🙅‍
                </motion.div>
                <div className={styles.gasDescription}>
                  {
                    "A composable system, enabling instant integration of brand new protocols & actions 🤯 🚀"
                  }
                </div>
              </motion.div>
              <motion.div
                variants={floatingLeftStates}
                className={styles.highLeftActionContainer}
                style={{
                  scale: 0.5,
                  top: "230vh",
                }}
                ref={floatingAaveRef}
              >
                <motion.img
                  className={styles.floatingProtocolImg}
                  alt=""
                  src={"/aave.svg"}
                  animate={{
                    y: y,
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: randomNumber(1, 10) * randomNumber(0.05, 0.5),
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
                <ActionsProtocolsPageActionButton
                  name={"Lend"}
                  style={{
                    marginLeft: "200px",
                    marginTop: "-125px",
                    width: "113px",
                    height: "107px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
                  }}
                  y={y}
                />
              </motion.div>
              <motion.div
                className={styles.lowLeftActionContainer}
                style={{
                  scale: 0.5,
                  top: "288vh",
                  marginLeft: "-20vw",
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  type: "spring",
                }}
                ref={floatingUnknownLeftRef}
              >
                <motion.img
                  className={styles.floatingProtocolImg}
                  alt=""
                  src={"/unknownprotocol.svg"}
                  style={{
                    marginLeft: "-20px",
                  }}
                  animate={{
                    y: y,
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: Math.random() * Math.random() * 1,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
                <ActionsProtocolsPageActionButton
                  name={"Stake"}
                  y={y}
                  style={{
                    marginLeft: "-100px",
                    marginTop: "-40vh",
                    marginBottom: "0vw",
                    width: "113px",
                    height: "107px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
                  }}
                />
                <ActionsProtocolsPageActionButton
                  name={"Harvest"}
                  y={y}
                  style={{
                    marginLeft: "-200px",
                    marginTop: "-33vh",
                    marginBottom: "0vw",
                    width: "113px",
                    height: "107px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
                  }}
                />
              </motion.div>
              <motion.div
                className={styles.lowRightActionContainer}
                style={{
                  scale: 0.5,
                  top: "287.6vh",
                  marginLeft: "68vw",
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  type: "spring",
                }}
                ref={floatingUniswapRef}
              >
                <motion.img
                  className={styles.floatingProtocolImg}
                  alt=""
                  src={"/uniswap.svg"}
                  animate={{
                    y: y,
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: Math.random() * Math.random() * 1,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
                <ActionsProtocolsPageActionButton
                  name={"LP Zap"}
                  y={y}
                  style={{
                    marginLeft: "-90px",
                    marginTop: "-100px",
                    width: "113px",
                    height: "107px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
                  }}
                />
                <ActionsProtocolsPageActionButton
                  name={"Add Liquidity"}
                  y={y}
                  style={{
                    marginLeft: "-180px",
                    marginTop: "-170px",
                    width: "113px",
                    height: "107px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
                  }}
                />
              </motion.div>
              <motion.div
                ref={floatingUnknownRightRef}
                className={styles.highRightActionContainer}
                style={{
                  scale: 0.5,
                  top: "227.6vh",
                  marginLeft: "60vw",
                }}
              >
                <motion.img
                  className={styles.floatingProtocolImg}
                  alt=""
                  src={"/unknownprotocol.svg"}
                  animate={{
                    y: y,
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: Math.random() * Math.random() * 1,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
                <ActionsProtocolsPageActionButton
                  name={"Cross-Chain Swap"}
                  y={y}
                  style={{
                    marginLeft: "-215px",
                    marginTop: "-180px",
                    marginBottom: "0vw",
                    width: "113px",
                    height: "107px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
                    zIndex: "1",
                  }}
                />
              </motion.div>
              {fullProtocolsList && windowSize.width > 800 && (
                <motion.div
                  className={styles.protocolsContainer}
                  ref={protocolsContainerRef}
                  style={{
                    left: `${
                      windowSize.width / 2 -
                      protocolsContainerRef.current?.getBoundingClientRect()
                        .width /
                        (windowSize.width <= 768
                          ? 1
                          : windowSize.width <= 1124
                          ? 1.375
                          : 2)
                    }px`,
                  }}
                >
                  <ProtocolCard protocolDetails={fullProtocolsList[0]} />
                  <ProtocolCard protocolDetails={fullProtocolsList[1]} />
                  <ProtocolCard protocolDetails={fullProtocolsList[2]} />
                </motion.div>
              )}
            </div>
          )}
          <div className={styles.finalPage}>
            <motion.div
              className={styles.finalPageGradientBlur}
              initial={{
                background: "linear-gradient(20deg, #00b2ec 0%, #d9ca0f 100%)",
              }}
              animate={{
                background: "linear-gradient(180deg, #00b2ec 0%, #d9ca0f 100%)",
              }}
              transition={{
                duration: 3.8,
                repeat: Infinity,
                delay: Math.random() * Math.random() * 1,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            ></motion.div>
            <div className={styles.finalPageContentContainer}>
              <div className={styles.finalPageTextContainer}>
                <div
                  className={styles.finalPageTitleText}
                >{`Re-Define Your DeFi Experience, Today.`}</div>
                <div className={styles.finalPageDescriptionText}>
                  (probably not like, today-today, because we are in a private
                  alpha phase currently, but you can sign up to get in as early
                  as possible :D)
                </div>
              </div>
              <div className={styles.finalPageBottomContainer}>
                <div className={styles.finalPageSignUpContainer}>
                  <div className={styles.finalPageSubTitleText}>
                    Sign Up For Early Access
                  </div>
                  <ConnectWalletButtonCustom
                    showNetwork={false}
                    whenConnected={"signup"}
                    modalHandler={setModalOpen}
                    modalStatus={modalOpen}
                  />
                </div>
                <div className={styles.finalPageDivisingLine}></div>
                <div className={styles.finalPageSmContainer}>
                  <div className={styles.finalPageSubTitleText}>
                    Join Us On Social Media {`(plz ser)`}
                  </div>
                  <div className={styles.finalPageSmButtonsContainer}>
                    <motion.div
                      className={styles.finalPageSocialMediaButton}
                      whileHover={{ scale: 1.05 }}
                      onClick={() =>
                        window.open("https://twitter.com/yield_chain")
                      }
                    >
                      <div
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        Twitter
                      </div>
                      <img
                        src="/finalpagetwitter.svg"
                        alt=""
                        style={{
                          cursor: "pointer",
                        }}
                      />
                    </motion.div>
                    <motion.div
                      className={styles.finalPageSocialMediaButton}
                      whileHover={{ scale: 1.05 }}
                      onClick={() =>
                        window.open("https://discord.gg/uFGweYZCpB")
                      }
                    >
                      <div
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        Discord
                      </div>
                      <img
                        src="/discord.svg"
                        alt=""
                        style={{
                          cursor: "pointer",
                        }}
                      />
                    </motion.div>
                    <motion.div
                      className={styles.finalPageSocialMediaButton}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => window.open("https://yieldchain.t.me")}
                    >
                      <div
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        Telegram
                      </div>
                      <img
                        src="/telegram.svg"
                        alt=""
                        style={{
                          cursor: "pointer",
                        }}
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
