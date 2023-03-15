"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingPage = exports.SignUpButton = exports.LandingHeader = exports.ConnectWalletButtonCustom = exports.handleLaunchApp = void 0;
const react_1 = __importStar(require("react"));
const landingPage_module_css_1 = __importDefault(require("./css/landingPage.module.css"));
const react_fast_marquee_1 = __importDefault(require("react-fast-marquee"));
const vaultcards_1 = require("./vaultcards");
const Layouting_1 = require("Layouting");
const Enums_1 = require("StrategyBuilder/Enums");
const StrategyBuilder_1 = require("StrategyBuilder/StrategyBuilder");
const AutoLine_1 = require("StrategyBuilder/AutoLine");
const LoadingScreen_1 = require("./LoadingScreen");
const utils_1 = require("utils/utils");
const rainbowkit_1 = require("@rainbow-me/rainbowkit");
const framer_motion_1 = require("framer-motion");
const axios_1 = __importDefault(require("axios"));
const wagmi_1 = require("wagmi");
const framer_motion_2 = require("framer-motion");
const FrequencyModal_1 = require("StrategyBuilder/FrequencyModal");
const MediumNodes_1 = require("StrategyBuilder/MediumNodes");
const landingpagestrategy_1 = require("./landingpagestrategy");
const ProtocolCard_1 = require("./ProtocolCard");
const react_router_dom_1 = require("react-router-dom");
const SignupModal_1 = require("./SignupModal");
const handleLaunchApp = async (address, navigate) => {
    let iswhitelisted = await (0, utils_1.isWhitelisted)(address);
    if (iswhitelisted) {
        const domain = window.location.host;
        const port = window.location.port;
        if (domain.includes("localhost"))
            window.open(`http://app.localhost:${port}/`, "_blank");
        else
            window.open(`https://app.${domain}/`, "_blank");
    }
    else {
        navigate("/whitelist");
    }
};
exports.handleLaunchApp = handleLaunchApp;
const ConnectWalletButtonCustom = (props) => {
    const { whenConnected, showNetwork, showBalance } = props;
    return (<div>
      <rainbowkit_1.ConnectButton.Custom>
        {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted, }) => {
            // Note: If your app doesn't use authentication, you
            // can remove all 'authenticationStatus' checks
            const ready = mounted && authenticationStatus !== "loading";
            const connected = ready &&
                account &&
                chain &&
                (!authenticationStatus || authenticationStatus === "authenticated");
            return (<div {...(!ready && {
                "aria-hidden": true,
                style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                },
            })}>
              {(() => {
                    var _a;
                    if (!connected) {
                        return (<framer_motion_1.motion.button onClick={openConnectModal} type="button" className={landingPage_module_css_1.default.connectWalletButton} whileHover={{
                                scale: 1.05,
                                filter: "drop-shadow(0 0 6px rgba(255, 255, 255, 0.305))",
                            }}>
                      Connect Wallet
                    </framer_motion_1.motion.button>);
                    }
                    if (chain.unsupported) {
                        return (<button onClick={openChainModal} type="button">
                      Unsupported network
                    </button>);
                    }
                    if (whenConnected == "signup") {
                        return <exports.SignUpButton modalHandler={props.modalHandler}/>;
                    }
                    return (<div style={{ display: "flex", gap: 12 }}>
                    {showNetwork == true || showNetwork == undefined ? (<button onClick={() => console.log("Show network", showNetwork)} style={{ display: "flex", alignItems: "center" }} type="button" className={landingPage_module_css_1.default.connectWalletButton}>
                        {chain.hasIcon && (<div style={{
                                    background: chain.iconBackground,
                                    width: 12,
                                    height: 12,
                                    borderRadius: 999,
                                    overflow: "hidden",
                                    marginRight: 4,
                                }}>
                            {chain.iconUrl && (<img alt={(_a = chain.name) !== null && _a !== void 0 ? _a : "Chain icon"} src={chain.iconUrl} style={{ width: 12, height: 12 }}/>)}
                          </div>)}
                        {chain.name}
                      </button>) : null}

                    <button onClick={openAccountModal} type="button" className={landingPage_module_css_1.default.connectWalletButton}>
                      {account.displayName}
                      {account.displayBalance
                            ? ` (${account.displayBalance})`
                            : ""}
                    </button>
                  </div>);
                })()}
            </div>);
        }}
      </rainbowkit_1.ConnectButton.Custom>
    </div>);
};
exports.ConnectWalletButtonCustom = ConnectWalletButtonCustom;
const LandingHeader = (props) => {
    const { width } = props;
    const { address } = (0, wagmi_1.useAccount)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    return (<div className={landingPage_module_css_1.default.headerContainer} style={{ gap: `${width - 670}px` }}>
      <img src="/yieldchainLogoFull.svg" alt="" className={landingPage_module_css_1.default.headerLogo}/>
      <div className={landingPage_module_css_1.default.headerButtonsContainer}>
        <framer_motion_1.motion.div className={landingPage_module_css_1.default.launchAppButton} whileHover={{
            scale: 1.05,
        }} onClick={() => (0, exports.handleLaunchApp)(address, navigate)}>
          Launch App
        </framer_motion_1.motion.div>
        <div className={landingPage_module_css_1.default.connectWalletButton}>
          <exports.ConnectWalletButtonCustom showNetwork={false}/>
        </div>
      </div>
    </div>);
};
exports.LandingHeader = LandingHeader;
const SignUpButton = (props) => {
    return (<div>
      <framer_motion_1.motion.div className={landingPage_module_css_1.default.signUpButton} whileHover={{ scale: 1.05 }} onClick={() => props.modalHandler(!props.modalStatus)} transition={{
            duration: 0.1,
        }}>
        {"Sign Me UP"}
      </framer_motion_1.motion.div>
    </div>);
};
exports.SignUpButton = SignUpButton;
const ActionsProtocolsPageActionButton = (props) => {
    return (<MediumNodes_1.MediumActionButton imgStyle={{
            width: "32px",
            height: "32px",
        }} nameStyle={{
            fontSize: "12px",
        }} actionDetails={{ name: props.name }} style={props.style} animate={{
            y: props.y,
        }} transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: Math.random() * Math.random() * 1,
            repeatType: "reverse",
            ease: "easeInOut",
        }}/>);
};
const LandingPage = () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
    const [windowSize, setWindowSize] = (0, react_1.useState)({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    // User's address
    const [page, setPage] = (0, react_1.useState)(0);
    const [y, cycleY] = (0, framer_motion_2.useCycle)(0, Math.random() * 25, 0);
    (0, react_1.useEffect)(() => {
        cycleY();
    }, []);
    const changeDimensions = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };
    (0, react_1.useEffect)(() => {
        window.addEventListener("resize", changeDimensions);
        return () => {
            window.removeEventListener("resize", changeDimensions);
        };
    }, [windowSize]);
    const pageRef = (0, react_1.useRef)();
    const cardsPageRef = (0, react_1.useRef)();
    const { scrollY } = (0, framer_motion_2.useScroll)({ container: pageRef });
    const [scrollYState, setScrollYState] = (0, react_1.useState)(0);
    const [nodesToLayout, setNodesToLayout] = (0, react_1.useState)([]);
    const [modalOpen, setModalOpen] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const layoutedNodes = (0, Layouting_1.layoutNodes)(landingpagestrategy_1.testNodesData, window.innerWidth);
        setNodesToLayout(layoutedNodes);
    }, []);
    // Random Refs
    const gasCardRef = (0, react_1.useRef)(null);
    const automationCardRef = (0, react_1.useRef)(null);
    const composabilityCardRef = (0, react_1.useRef)(null);
    const redWojakRef = (0, react_1.useRef)(null);
    const greenWojaksRef = (0, react_1.useRef)(null);
    const singleGreenWojakRef = (0, react_1.useRef)(null);
    const greenArrowsRef = (0, react_1.useRef)(null);
    const floatingAaveRef = (0, react_1.useRef)(null);
    const floatingUnknownLeftRef = (0, react_1.useRef)(null);
    const floatingUnknownRightRef = (0, react_1.useRef)(null);
    const floatingUniswapRef = (0, react_1.useRef)(null);
    const frequencyModalRef = (0, react_1.useRef)(null);
    const cogWheelRef = (0, react_1.useRef)(null);
    const protocolsContainerRef = (0, react_1.useRef)(null);
    scrollY.onChange((latest) => {
        if (latest <= windowSize.height * 5.2) {
            if (latest <= windowSize.height * 4.4) {
                if (latest <= windowSize.height * 3.8)
                    setPage(1);
                else
                    setPage(2);
            }
            else
                setPage(3);
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
            marginLeft: `${greenWojaksRef.current
                ? windowSize.width -
                    greenWojaksRef.current.getBoundingClientRect().width +
                    (windowSize.width < 537
                        ? greenWojaksRef.current.getBoundingClientRect().width / 3
                        : 0)
                : 3000}px`,
            marginTop: `${greenWojaksRef.current
                ? greenWojaksRef.current.getBoundingClientRect().top -
                    greenArrowsRef.current.getBoundingClientRect().height / 1.75
                : 3000}px`,
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
            left: `${greenWojaksRef.current
                ? windowSize.width -
                    greenWojaksRef.current.getBoundingClientRect().width -
                    20 +
                    (windowSize.width < 537
                        ? greenWojaksRef.current.getBoundingClientRect().width / 3
                        : 0)
                : 0}px`,
            top: `${windowSize.height -
                (greenWojaksRef.current
                    ? greenWojaksRef.current.getBoundingClientRect().height
                    : 3000)}px`,
        },
        hidden: {
            top: `${windowSize.height -
                (greenWojaksRef.current
                    ? greenWojaksRef.current.getBoundingClientRect().height
                    : 3000)}px`,
            left: `${windowSize.width * 1.1}px`,
        },
    };
    const redWojakStates = {
        visible: {
            left: `-${windowSize.width < 537
                ? redWojakRef.current
                    ? redWojakRef.current.getBoundingClientRect().width / 3.3
                    : 0
                : 0}px`,
        },
        hidden: {
            left: `-${redWojakRef.current
                ? redWojakRef.current.getBoundingClientRect().width * 1.2
                : 1000}px`,
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
            left: `calc(100vw - ${((_a = cogWheelRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect().width) /
                (windowSize.width <= 768 ? 1.5 : 1)}px)`,
            top: `${((_b = gasCardRef.current) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect().top) +
                ((_c = gasCardRef.current) === null || _c === void 0 ? void 0 : _c.getBoundingClientRect().height) *
                    (windowSize.width <= 768 ? 4 : 4.65)}px`,
            position: "absolute",
        },
        hidden: {
            left: "120vw",
            top: `${((_d = gasCardRef.current) === null || _d === void 0 ? void 0 : _d.getBoundingClientRect().top) +
                ((_e = gasCardRef.current) === null || _e === void 0 ? void 0 : _e.getBoundingClientRect().height) *
                    (windowSize.width <= 768 ? 4 : 4.65)}px`,
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
    const [fullProtocolsList, setFullProtocolsList] = (0, react_1.useState)(null);
    const [fullStrategiesList, setFullStrategiesList] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        axios_1.default
            .get("https://api.yieldchain.io/strategies")
            .then((res) => setFullStrategiesList(res.data.strategies));
        axios_1.default
            .get("https://api.yieldchain.io/protocols")
            .then((res) => setFullProtocolsList(res.data.protocols));
    }, []);
    const [loadingOpen, setLoadingOpen] = (0, react_1.useState)(true);
    const closeLoading = async () => {
        let timeoutPromise = await new Promise((resolve) => {
            setTimeout(() => {
                console.log("Time out finishe ser");
                resolve(false);
            }, 5000);
        });
        setLoadingOpen(timeoutPromise);
    };
    (0, react_1.useEffect)(() => {
        if (fullStrategiesList !== null &&
            fullProtocolsList !== null &&
            loadingOpen === true) {
            console.log("Closing loading");
            closeLoading();
        }
        return () => {
            setLoadingOpen(true);
        };
    }, [fullStrategiesList, fullProtocolsList]);
    return (<div>
      {modalOpen && <SignupModal_1.SignUpModal handler={setModalOpen} theme="dark"/>}
      {loadingOpen && <LoadingScreen_1.LoadingScreen handler={setLoadingOpen}/>}

      <div className={landingPage_module_css_1.default.pageDiv} style={{
            width: windowSize.width,
            height: windowSize.height,
            zIndex: "10000",
        }} ref={pageRef}>
        <exports.LandingHeader width={windowSize.width}/>
        <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
          <div className={landingPage_module_css_1.default.earnTopCyanBlur}></div>
          <div className={landingPage_module_css_1.default.heroPageBottomBlackBlur}></div>
        </div>

        <div className={landingPage_module_css_1.default.heroPageHigher}>
          <div className={landingPage_module_css_1.default.heroPageleftContainer}>
            <framer_motion_1.motion.div className={landingPage_module_css_1.default.heroLeftTextContainer} initial={{
            scale: 0.1,
            opacity: 0,
        }} animate={{
            scale: 1,
            opacity: 1,
        }} transition={{
            duration: 1.25,
        }}>
              <div className={landingPage_module_css_1.default.singleRowTextFlex}>
                <div className={landingPage_module_css_1.default.heroPageWhiteTextFull}>Can </div>
                <div className={landingPage_module_css_1.default.heroPageWhiteTextStrikethrough}>
                  the devs
                </div>
              </div>
              <div className={landingPage_module_css_1.default.heroPageGradientText}>YOU</div>
              <div className={landingPage_module_css_1.default.heroPageWhiteTextFull}>do something?</div>
            </framer_motion_1.motion.div>
            <framer_motion_1.motion.div className={landingPage_module_css_1.default.heroPageEarlyAccessContainer} initial={{
            scale: 0.1,
            opacity: 0,
        }} animate={{
            scale: 1,
            opacity: 1,
        }} transition={{
            duration: 1.25,
        }}>
              <div className={landingPage_module_css_1.default.heroPageEarlyAccessText}>
                Get Early Access To DeFi ∞.0
              </div>

              <exports.ConnectWalletButtonCustom whenConnected={"signup"} modalHandler={setModalOpen} modalStatus={modalOpen}/>
            </framer_motion_1.motion.div>
            <div className={landingPage_module_css_1.default.blackBackdropMobile}></div>
          </div>
        </div>
        <div className={landingPage_module_css_1.default.heroPage} style={{ zIndex: "1", overflowX: "hidden" }}>
          <div className={landingPage_module_css_1.default.heroPageRightContainer}>
            <div className={landingPage_module_css_1.default.heroPageBottomYellowBlur}></div>
          </div>
        </div>
        <div className={landingPage_module_css_1.default.defiToysBlueBlur}></div>
        <div className={landingPage_module_css_1.default.nodesContainer} style={{
            left: windowSize.width <= 768 ? "30vw" : "47.5vw",
        }}>
          {nodesToLayout.length &&
            nodesToLayout.map((step, index) => {
                let tStyle = {
                    top: `${96 +
                        step.position.y +
                        (step.step_identifier == 10
                            ? 0
                            : step.step_identifier <= 6
                                ? 0
                                : windowSize.height / 9)}px`,
                    left: `${step.position.x + windowSize.width / 10 + 163.5}px`,
                    position: "relative",
                    zIndex: `1000`,
                };
                let doesHaveStepDetails = step.function_identifiers.length > 0;
                let isPlaceholder = step.type == Enums_1.NodeStepEnum.PLACEHOLDER;
                let nodeChilds = step.children;
                let currentNodeProcessStep;
                if (doesHaveStepDetails) {
                    currentNodeProcessStep = Enums_1.NodeStepEnum.COMPLETE;
                }
                else if (step.type == Enums_1.NodeStepEnum.CHOOSE_ACTION) {
                    currentNodeProcessStep = Enums_1.NodeStepEnum.CHOOSE_ACTION;
                }
                else if (step.type == Enums_1.NodeStepEnum.PLACEHOLDER) {
                    currentNodeProcessStep = Enums_1.NodeStepEnum.PLACEHOLDER;
                }
                else if (step.type == Enums_1.NodeStepEnum.CONFIG_ACTION) {
                    currentNodeProcessStep = Enums_1.NodeStepEnum.CONFIG_ACTION;
                }
                return (<div>
                  <StrategyBuilder_1.NodeStep size={Enums_1.SizingEnum.MEDIUM} stepId={step.step_identifier} style={tStyle} processStep={currentNodeProcessStep} key={index} stepDetails={step} optionalAction={{
                        name: "Stake",
                        action_identifier: "1",
                        single_function: false,
                        hidden: false,
                    }}/>
                  {nodeChilds
                        ? nodeChilds.map((child, indexx) => {
                            let newObj = {
                                ...child.data,
                                position: { x: child.x, y: child.y },
                            };
                            return (<AutoLine_1.AutoLine parentNode={{
                                    width: step.width,
                                    height: step.height,
                                    position: {
                                        x: step.position.x +
                                            windowSize.width / 10 +
                                            163.5,
                                        y: 96 +
                                            step.position.y +
                                            (step.step_identifier == 10
                                                ? 0
                                                : step.step_identifier <= 6
                                                    ? 0
                                                    : windowSize.height / 9),
                                    },
                                }} childNode={{
                                    width: newObj.width,
                                    height: newObj.height,
                                    position: {
                                        x: newObj.position.x +
                                            windowSize.width / 10 +
                                            163.5,
                                        y: 96 +
                                            newObj.position.y +
                                            (newObj.step_identifier == 10
                                                ? 0
                                                : newObj.step_identifier <= 6
                                                    ? 0
                                                    : windowSize.height / 9),
                                    },
                                    type: newObj.type,
                                    empty: newObj.empty ? newObj.empty : false,
                                }} key={indexx}/>);
                        })
                        : null}
                </div>);
            })}
        </div>

        <div className={landingPage_module_css_1.default.defiToysPageHigher}>
          <div className={landingPage_module_css_1.default.blackBackdropMobile} style={{
            marginTop: "-10vh",
            filter: "blur(100px)",
        }}></div>
          <div className={landingPage_module_css_1.default.defiToysTextContainer}>
            <div className={landingPage_module_css_1.default.defiToysTitleText}>DeFi Toys.</div>
            <div className={landingPage_module_css_1.default.defiToysDescriptionText}>
              Your mom was WRONG, here is a tree of money{" "}
              {windowSize.width <= 768 ? "🎄💸" : "👉"}
            </div>
            <div className={landingPage_module_css_1.default.defiToysDescriptionText}>
              And you are the farmer 🧑‍🌾
            </div>
          </div>
        </div>

        <div className={landingPage_module_css_1.default.earnPage}>
          <div className={landingPage_module_css_1.default.earnPageGradientBlur}></div>
          <div className={landingPage_module_css_1.default.earnTopBlackBlur}></div>
          <div className={landingPage_module_css_1.default.earnTextContainer}>
            <div className={landingPage_module_css_1.default.earnTitle}>Earn W/ 1 Click</div>
            <div className={landingPage_module_css_1.default.earnDescription}>
              Create your own strategies & share them, or browse ones made by
              others.
            </div>
          </div>
          <react_fast_marquee_1.default className={landingPage_module_css_1.default.earnVaultsGrid} gradient={false} speed={windowSize.width / 40} style={{
            gap: `${windowSize.width <= 768 ? "10px" : "25px"}}`,
        }}>
            {fullStrategiesList
            ? [...fullStrategiesList].map((strategy, index, arr) => {
                return (<vaultcards_1.VerfiedVaultCard key={strategy.strategy_identifier} vaultDetails={strategy} style={{
                        marginLeft: index == 0
                            ? "-10px"
                            : `${windowSize.width <= 768 ? "2px" : "15px"}`,
                        overflow: "hidden",
                        scale: `${windowSize.width <= 768 ? 0.8 : 0.9}`,
                    }}/>);
            })
            : null}
          </react_fast_marquee_1.default>
          <div className={landingPage_module_css_1.default.earnBottomBlackBlur}></div>
        </div>

        <div className={landingPage_module_css_1.default.gasPage} ref={cardsPageRef}>
          {windowSize.width > 768 && (<div style={{
                position: "sticky",
                top: "0vh",
                width: "100vw",
                height: "100vh",
            }}>
              <framer_motion_1.motion.div className={landingPage_module_css_1.default.gasPageRedBlur} style={{
                willChange: "background-color",
            }} animate={{
                backgroundColor: page == 3
                    ? "rgba(59, 42, 249, 0.6)"
                    : page == 2
                        ? "rgba(136, 124, 201, 0.634)"
                        : "rgba(255, 4, 4)",
            }} layout transition={{
                duration: 2,
                ease: "easeInOut",
                type: "spring",
            }}></framer_motion_1.motion.div>
              <framer_motion_1.motion.div className={landingPage_module_css_1.default.gasPageGreenBlur} style={{
                willChange: "background-color",
            }} animate={{
                backgroundColor: page == 3
                    ? "rgba(249, 42, 142, 1)"
                    : page == 2
                        ? "rgba(4, 240, 255, 1)"
                        : "rgba(160, 196, 74, 1)",
            }}></framer_motion_1.motion.div>
              <framer_motion_1.motion.div ref={gasCardRef} className={landingPage_module_css_1.default.gasGlassContainer} variants={gasCardStates} style={{ willChange: "left, top" }} animate={page <= 1 ? "visible" : "hidden"} layout transition={{
                duration: 2,
                ease: "easeInOut",
                type: "spring",
            }}>
                <div className={landingPage_module_css_1.default.moreFrensLessGasText}>
                  More Frens = Less Gas
                </div>
                <div className={landingPage_module_css_1.default.gasDescription}>
                  bundle up with anons to save on gas fees ⛽{" "}
                </div>
              </framer_motion_1.motion.div>
              <framer_motion_1.motion.div className={landingPage_module_css_1.default.greenWojaksContainer} variants={greenWojaksStates} style={{
                position: "absolute",
            }} animate={page <= 1 ? "visible" : "hidden"} ref={greenWojaksRef} transition={{
                duration: 2,
                ease: "easeInOut",
                type: "spring",
            }}>
                <img src="/greenwojak.svg" alt="" className={landingPage_module_css_1.default.greenWojak} ref={singleGreenWojakRef}/>
                <img src="/greenwojak.svg" alt="" className={landingPage_module_css_1.default.greenWojak}/>
                <img src="/greenwojak.svg" alt="" className={landingPage_module_css_1.default.greenWojak}/>
              </framer_motion_1.motion.div>
              <framer_motion_1.motion.div className={landingPage_module_css_1.default.greenArrowsContainer} variants={greenArrowsStates} ref={greenArrowsRef} animate={page <= 1 ? "visible" : "hidden"} transition={{
                duration: 2,
                ease: "easeInOut",
                type: "spring",
            }}>
                <img src="/greenArrowUp.svg" alt="" className={landingPage_module_css_1.default.greenArrow}/>
                <img src="/greenArrowUp.svg" alt="" className={landingPage_module_css_1.default.greenArrow}/>
                <img src="/greenArrowUp.svg" alt="" className={landingPage_module_css_1.default.greenArrow}/>
              </framer_motion_1.motion.div>
              <div>
                <framer_motion_1.motion.img ref={redWojakRef} src="/redwojak.svg" alt="" variants={redWojakStates} className={landingPage_module_css_1.default.redWojak} animate={page <= 1 ? "visible" : "hidden"} style={{
                top: `${windowSize.height -
                    ((_f = redWojakRef.current) === null || _f === void 0 ? void 0 : _f.getBoundingClientRect().height)}px`,
            }} layout transition={{
                duration: 2,
            }}/>
              </div>
              <framer_motion_1.motion.div className={landingPage_module_css_1.default.metamaskTxidContainer} layout animate={{
                left: page <= 1
                    ? `${((_g = redWojakRef.current) === null || _g === void 0 ? void 0 : _g.getBoundingClientRect().left) +
                        ((_h = redWojakRef.current) === null || _h === void 0 ? void 0 : _h.getBoundingClientRect().width) -
                        (windowSize.width <= 768 ? 10 : 30)}px`
                    : `-20vw`,
                top: `${redWojakRef.current &&
                    windowSize.height -
                        redWojakRef.current.getBoundingClientRect().height * 1.12}px`,
            }} transition={{
                duration: 0.75,
            }}>
                <img src="/metamask.svg" alt="" className={landingPage_module_css_1.default.metaMaskImg}/>
                <div className={landingPage_module_css_1.default.redTextContainer}>
                  <div className={landingPage_module_css_1.default.redEthText}>0.4 ETH</div>
                  <div className={landingPage_module_css_1.default.redDollarsText}>$251.93</div>
                </div>
                <div className={landingPage_module_css_1.default.metamaskButtonsContainer}>
                  <div className={landingPage_module_css_1.default.cancelButton}>Cancel</div>
                  <div className={landingPage_module_css_1.default.getRektButton}>Get Rekt</div>
                </div>
              </framer_motion_1.motion.div>
              <framer_motion_1.motion.div ref={automationCardRef} className={landingPage_module_css_1.default.gasGlassContainer} variants={automationCardStates} animate={page <= 1 ? "initial" : page == 2 ? "visible" : "hidden"} transition={{
                duration: 2,
                ease: "easeInOut",
                type: "spring",
            }}>
                <framer_motion_1.motion.div className={landingPage_module_css_1.default.moreFrensLessGasText}>
                  Wen? 👀 - Your Call ⚡
                </framer_motion_1.motion.div>
                <div className={landingPage_module_css_1.default.gasDescription}>
                  {"Automate your strategies the way you’d like - Execute them on a regular basis.⚙️⚡"}
                </div>
              </framer_motion_1.motion.div>
              {windowSize.width > 800 && (<FrequencyModal_1.StaticFrequencyModal variants={staticFrequencyModalStates} animationConiditon={page <= 1 ? "initial" : page == 2 ? "visible" : "hidden"} ref={frequencyModalRef}/>)}
              <framer_motion_1.motion.img alt="" src="/hehe.png" className={landingPage_module_css_1.default.automationPageCogWheel} variants={cogWheelEmojiStates} ref={cogWheelRef} animate={page <= 1 ? "hidden" : page == 2 ? "visible" : "hidden"} layout transition={{
                duration: 2,
                ease: "easeInOut",
                type: "spring",
            }}/>
              <framer_motion_1.motion.div className={landingPage_module_css_1.default.automationPageRobot} variants={robotEmojiStates} style={{
                position: "absolute",
                top: `${((_j = gasCardRef.current) === null || _j === void 0 ? void 0 : _j.getBoundingClientRect().top) +
                    ((_k = gasCardRef.current) === null || _k === void 0 ? void 0 : _k.getBoundingClientRect().height) *
                        (windowSize.width <= 768 ? 4 : 4.65)}px`,
                marginLeft: `${windowSize.width <= 768 ? -10 : 0}vw`,
                transform: "rotate(-13.34deg)",
            }} animate={page == 2 ? (page <= 1 ? "hidden" : "visible") : "hidden"} transition={{
                duration: 2,
                ease: "easeInOut",
                type: "spring",
            }}>
                🤖
              </framer_motion_1.motion.div>
              <framer_motion_1.motion.div ref={composabilityCardRef} className={landingPage_module_css_1.default.gasGlassContainer} variants={automationCardStates} animate={page < 3 ? "initial" : "visible"} transition={{
                duration: 2,
                ease: "easeInOut",
                type: "spring",
            }} style={{
                padding: "3vw",
                gap: "3vw",
            }}>
                <framer_motion_1.motion.div className={landingPage_module_css_1.default.moreFrensLessGasText} style={{
                marginTop: `${windowSize.width <= 768 ? 0 : 0}vw`,
            }}>
                  Bluechips-Only? HELL NAH 😎 🙅‍{" "}
                </framer_motion_1.motion.div>
                <div className={landingPage_module_css_1.default.gasDescription} style={{
                fontSize: `${windowSize.width <= 768 ? "3.5vw" : ""}`,
                marginTop: `${windowSize.width <= 768 ? -3 : 0}vw`,
            }}>
                  {"A composable system, enabling instant integration of brand new protocols & actions 🤯 🚀"}
                </div>
              </framer_motion_1.motion.div>
              <framer_motion_1.motion.div variants={floatingLeftStates} className={landingPage_module_css_1.default.highLeftActionContainer} animate={{
                left: page == 2
                    ? `-${((_l = floatingAaveRef.current) === null || _l === void 0 ? void 0 : _l.getBoundingClientRect().width) * 1.2}px`
                    : `${((_m = composabilityCardRef.current) === null || _m === void 0 ? void 0 : _m.getBoundingClientRect().left) * (windowSize.width <= 768 ? 1.15 : 1.5)}px`,
                scale: windowSize.width <= 768
                    ? 0.5
                    : windowSize.width <= 1000
                        ? 0.7
                        : 1,
                top: `${((_o = composabilityCardRef.current) === null || _o === void 0 ? void 0 : _o.getBoundingClientRect().top) +
                    ((_p = floatingAaveRef.current) === null || _p === void 0 ? void 0 : _p.getBoundingClientRect().height) /
                        (windowSize.width <= 768 ? 3 : 2)}px`,
            }} transition={{
                duration: 2,
                ease: "easeInOut",
                type: "spring",
            }} ref={floatingAaveRef}>
                <framer_motion_1.motion.img className={landingPage_module_css_1.default.floatingProtocolImg} alt="" src={"/aave.svg"} animate={{
                y: y,
            }} transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: (0, utils_1.randomNumber)(1, 10) * (0, utils_1.randomNumber)(0.05, 0.5),
                repeatType: "reverse",
                ease: "easeInOut",
            }}/>
                <ActionsProtocolsPageActionButton name={"Lend"} style={{
                marginLeft: "200px",
                marginTop: "-125px",
                width: "113px",
                height: "107px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
            }} y={y}/>
              </framer_motion_1.motion.div>
              <framer_motion_1.motion.div className={landingPage_module_css_1.default.lowLeftActionContainer} animate={{
                left: page == 2
                    ? `-${((_q = floatingUnknownLeftRef.current) === null || _q === void 0 ? void 0 : _q.getBoundingClientRect().width) * 10}px`
                    : "-10px",
                marginLeft: `-${((_r = floatingUnknownLeftRef.current) === null || _r === void 0 ? void 0 : _r.getBoundingClientRect().width) / 3}px`,
                scale: windowSize.width <= 768
                    ? 0.75
                    : windowSize.width <= 1000
                        ? 0.875
                        : 1,
                top: `${((_s = composabilityCardRef.current) === null || _s === void 0 ? void 0 : _s.getBoundingClientRect().top) +
                    ((_t = composabilityCardRef.current) === null || _t === void 0 ? void 0 : _t.getBoundingClientRect().height) +
                    ((_u = floatingUnknownLeftRef.current) === null || _u === void 0 ? void 0 : _u.getBoundingClientRect().height)}px`,
            }} transition={{
                duration: 2,
                ease: "easeInOut",
                type: "spring",
            }} ref={floatingUnknownLeftRef}>
                <framer_motion_1.motion.img className={landingPage_module_css_1.default.floatingProtocolImg} alt="" src={"/unknownprotocol.svg"} style={{
                marginLeft: "-20px",
            }} animate={{
                y: y,
            }} transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: Math.random() * Math.random() * 1,
                repeatType: "reverse",
                ease: "easeInOut",
            }}/>
                <ActionsProtocolsPageActionButton name={"Stake"} y={y} style={{
                marginLeft: "-100px",
                marginTop: "-40vh",
                marginBottom: "0vw",
                width: "113px",
                height: "107px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
            }}/>
                <ActionsProtocolsPageActionButton name={"Harvest"} y={y} style={{
                marginLeft: "-200px",
                marginTop: "-33vh",
                marginBottom: "0vw",
                width: "113px",
                height: "107px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
            }}/>
              </framer_motion_1.motion.div>
              <framer_motion_1.motion.div className={landingPage_module_css_1.default.lowRightActionContainer} animate={{
                left: page < 3
                    ? "120vw"
                    : `${((_v = composabilityCardRef.current) === null || _v === void 0 ? void 0 : _v.getBoundingClientRect().left) +
                        ((_w = composabilityCardRef.current) === null || _w === void 0 ? void 0 : _w.getBoundingClientRect().width) -
                        ((_x = floatingUniswapRef.current) === null || _x === void 0 ? void 0 : _x.getBoundingClientRect().width) /
                            1.25}px`,
                scale: windowSize.width <= 768
                    ? 0.7
                    : windowSize.width <= 1000
                        ? 0.8
                        : 1,
            }} transition={{
                duration: 2,
                ease: "easeInOut",
                type: "spring",
            }} ref={floatingUniswapRef}>
                <framer_motion_1.motion.img className={landingPage_module_css_1.default.floatingProtocolImg} alt="" src={"/uniswap.svg"} animate={{
                y: y,
            }} transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: Math.random() * Math.random() * 1,
                repeatType: "reverse",
                ease: "easeInOut",
            }}/>
                <ActionsProtocolsPageActionButton name={"LP Zap"} y={y} style={{
                marginLeft: "-90px",
                marginTop: "-100px",
                width: "113px",
                height: "107px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
            }}/>
                <ActionsProtocolsPageActionButton name={"Add Liquidity"} y={y} style={{
                marginLeft: "-180px",
                marginTop: "-170px",
                width: "113px",
                height: "107px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
            }}/>
              </framer_motion_1.motion.div>
              <framer_motion_1.motion.div ref={floatingUnknownRightRef} className={landingPage_module_css_1.default.highRightActionContainer} animate={{
                left: page == 2
                    ? "120vw"
                    : `${((_y = composabilityCardRef.current) === null || _y === void 0 ? void 0 : _y.getBoundingClientRect().left) +
                        ((_z = composabilityCardRef.current) === null || _z === void 0 ? void 0 : _z.getBoundingClientRect().width) -
                        ((_0 = floatingUnknownRightRef.current) === null || _0 === void 0 ? void 0 : _0.getBoundingClientRect().width)}px`,
                scale: windowSize.width <= 768
                    ? 0.5
                    : windowSize.width <= 1000
                        ? 0.7
                        : 1,
                top: `${((_1 = composabilityCardRef.current) === null || _1 === void 0 ? void 0 : _1.getBoundingClientRect().top) -
                    ((_2 = floatingUnknownRightRef.current) === null || _2 === void 0 ? void 0 : _2.getBoundingClientRect().height) /
                        (windowSize.width <= 1000
                            ? windowSize.width <= 768
                                ? 4.5
                                : 9.5
                            : -2.5)}px`,
            }} transition={{
                duration: 2,
                ease: "easeInOut",
                type: "spring",
            }}>
                <framer_motion_1.motion.img className={landingPage_module_css_1.default.floatingProtocolImg} alt="" src={"/unknownprotocol.svg"} animate={{
                y: y,
            }} transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: Math.random() * Math.random() * 1,
                repeatType: "reverse",
                ease: "easeInOut",
            }}/>
                <ActionsProtocolsPageActionButton name={"Cross-Chain Swap"} y={y} style={{
                marginLeft: "-215px",
                marginTop: "-180px",
                marginBottom: "0vw",
                width: "113px",
                height: "107px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
                zIndex: "1",
            }}/>
              </framer_motion_1.motion.div>
              {fullProtocolsList && windowSize.width > 800 && (<framer_motion_1.motion.div className={landingPage_module_css_1.default.protocolsContainer} ref={protocolsContainerRef} style={{
                    left: `${windowSize.width / 2 -
                        ((_3 = protocolsContainerRef.current) === null || _3 === void 0 ? void 0 : _3.getBoundingClientRect().width) /
                            (windowSize.width <= 768
                                ? 1
                                : windowSize.width <= 1124
                                    ? 1.375
                                    : 2)}px`,
                }}>
                  <ProtocolCard_1.ProtocolCard protocolDetails={fullProtocolsList[0]}/>
                  <ProtocolCard_1.ProtocolCard protocolDetails={fullProtocolsList[1]}/>
                  <ProtocolCard_1.ProtocolCard protocolDetails={fullProtocolsList[2]}/>
                </framer_motion_1.motion.div>)}
            </div>)}
          {windowSize.width <= 768 && (<div style={{
                position: "sticky",
                top: "0vh",
                width: "100vw",
                height: "300vh",
            }}>
              <div style={{
                position: "sticky",
                top: "0vh",
                width: "100vw",
                height: "100vh",
            }}>
                {" "}
                <framer_motion_1.motion.div className={landingPage_module_css_1.default.gasPageRedBlur} style={{
                willChange: "background-color",
            }} animate={{
                backgroundColor: page == 3
                    ? "rgba(59, 42, 249, 0.6)"
                    : page == 2
                        ? "rgba(136, 124, 201, 0.634)"
                        : "rgba(255, 4, 4)",
            }} layout transition={{
                duration: 2,
                ease: "easeInOut",
                type: "spring",
            }}></framer_motion_1.motion.div>
                <framer_motion_1.motion.div className={landingPage_module_css_1.default.gasPageGreenBlur} style={{
                willChange: "background-color",
            }} animate={{
                backgroundColor: page == 3
                    ? "rgba(249, 42, 142, 1)"
                    : page == 2
                        ? "rgba(4, 240, 255, 1)"
                        : "rgba(160, 196, 74, 1)",
            }}></framer_motion_1.motion.div>
              </div>
              <framer_motion_1.motion.div ref={gasCardRef} className={landingPage_module_css_1.default.gasGlassContainer} layout transition={{
                duration: 2,
                ease: "easeInOut",
                type: "spring",
            }} style={{
                width: "85vw",
                height: "55vh",
                justifyContent: "flex-start",
                paddingTop: "6vh",
                left: "7.5vw",
                top: "30vh",
            }}>
                <div className={landingPage_module_css_1.default.moreFrensLessGasText}>More Frens</div>
                <div className={landingPage_module_css_1.default.moreFrensLessGasText}>=</div>
                <div className={landingPage_module_css_1.default.moreFrensLessGasText}>Less Gas</div>

                <div className={landingPage_module_css_1.default.gasDescription} style={{
                width: "70vw",
                textAlign: "center",
            }}>
                  bundle up with anons to save on gas fees ⛽{" "}
                </div>
                <div style={{
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
            }}>
                  <framer_motion_1.motion.div className={landingPage_module_css_1.default.greenWojaksContainer} ref={greenWojaksRef} style={{
                marginLeft: "auto",
                marginTop: "auto",
                marginRight: "4vw",
                alignSelf: "flex-end",
                position: "relative",
            }}>
                    <img src="/greenwojak.svg" alt="" className={landingPage_module_css_1.default.greenWojak} ref={singleGreenWojakRef} style={{
                width: "20vw",
            }}/>
                    <img src="/greenwojak.svg" alt="" className={landingPage_module_css_1.default.greenWojak} style={{
                width: "20vw",
            }}/>
                    <img src="/greenwojak.svg" alt="" className={landingPage_module_css_1.default.greenWojak} style={{
                width: "20vw",
            }}/>
                  </framer_motion_1.motion.div>
                  <framer_motion_1.motion.div className={landingPage_module_css_1.default.greenArrowsContainer} ref={greenArrowsRef} style={{
                marginRight: "-25.5vw",
                marginTop: "auto",
                alignSelf: "flex-end",
                position: "relative",
                bottom: "7vh",
            }}>
                    <img src="/greenArrowUp.svg" alt="" className={landingPage_module_css_1.default.greenArrow}/>
                    <img src="/greenArrowUp.svg" alt="" className={landingPage_module_css_1.default.greenArrow}/>
                    <img src="/greenArrowUp.svg" alt="" className={landingPage_module_css_1.default.greenArrow}/>
                  </framer_motion_1.motion.div>
                </div>
                <div style={{
                marginTop: "auto",
                alignSelf: "flex-start",
                position: "relative",
                bottom: "0vh",
                order: 4,
                display: "flex",
                flexDirection: "row",
                zIndex: "20",
            }}>
                  <framer_motion_1.motion.img ref={redWojakRef} src="/redwojak.svg" alt="" className={landingPage_module_css_1.default.redWojak} style={{
                position: "relative",
                top: "0px",
                left: "0px",
                width: "25vw",
            }}/>
                  <framer_motion_1.motion.div className={landingPage_module_css_1.default.metamaskTxidContainer} style={{
                position: "relative",
                top: "0px",
                left: "-5vw",
            }}>
                    <img src="/metamask.svg" alt="" className={landingPage_module_css_1.default.metaMaskImg}/>
                    <div className={landingPage_module_css_1.default.redTextContainer}>
                      <div className={landingPage_module_css_1.default.redEthText}>0.4 ETH</div>
                      <div className={landingPage_module_css_1.default.redDollarsText}>$251.93</div>
                    </div>
                    <div className={landingPage_module_css_1.default.metamaskButtonsContainer}>
                      <div className={landingPage_module_css_1.default.cancelButton}>Cancel</div>
                      <div className={landingPage_module_css_1.default.getRektButton}>Get Rekt</div>
                    </div>
                  </framer_motion_1.motion.div>
                </div>
              </framer_motion_1.motion.div>
              <framer_motion_1.motion.div ref={automationCardRef} className={landingPage_module_css_1.default.gasGlassContainer} style={{
                top: "130vh",
                width: "85vw",
                height: "55vh",
                justifyContent: "flex-start",
                paddingTop: "6vh",
                left: "7.5vw",
            }}>
                <div className={landingPage_module_css_1.default.moreFrensLessGasText}>Wen? 👀</div>
                <div className={landingPage_module_css_1.default.moreFrensLessGasText}>-</div>
                <div className={landingPage_module_css_1.default.moreFrensLessGasText}>Your Call ⚡</div>
                <div className={landingPage_module_css_1.default.gasDescription}>
                  {"Automate your strategies the way you’d like - Execute them on a regular basis.⚙️⚡"}
                </div>
              </framer_motion_1.motion.div>

              <framer_motion_1.motion.img alt="" src="/hehe.png" className={landingPage_module_css_1.default.automationPageCogWheel} ref={cogWheelRef} animate={{
                top: `calc(130vh + ${((_4 = automationCardRef.current) === null || _4 === void 0 ? void 0 : _4.getBoundingClientRect().height) /
                    2 -
                    scrollYState / 5 +
                    800}px)`,
            }} style={{
                zIndex: "100",
                width: "35vw",
                left: "70%",
                position: "absolute",
            }} layout transition={{
                duration: 2,
                ease: "easeInOut",
                type: "spring",
            }}/>
              <framer_motion_1.motion.div className={landingPage_module_css_1.default.automationPageRobot} variants={robotEmojiStates} style={{
                zIndex: "100",
                width: "35vw",
                left: "0%",
                position: "absolute",
                transform: "rotate(-13.34deg)",
                fontSize: "25.8333vw",
            }} animate={{
                top: `calc(130vh + ${((_5 = automationCardRef.current) === null || _5 === void 0 ? void 0 : _5.getBoundingClientRect().height) /
                    2 -
                    scrollYState / 5 +
                    800}px)`,
            }}>
                🤖
              </framer_motion_1.motion.div>
              <framer_motion_1.motion.div ref={composabilityCardRef} className={landingPage_module_css_1.default.gasGlassContainer} style={{
                top: "230vh",
                width: "85vw",
                height: "55vh",
                justifyContent: "flex-start",
                paddingTop: "6vh",
                left: "7.5vw",
            }}>
                <framer_motion_1.motion.div className={landingPage_module_css_1.default.moreFrensLessGasText} style={{
                fontSize: "9vw",
            }}>
                  Bluechips-Only?
                </framer_motion_1.motion.div>
                <framer_motion_1.motion.div className={landingPage_module_css_1.default.moreFrensLessGasText} style={{
                fontSize: "10vw",
            }}>
                  HELL NAH 😎 🙅‍
                </framer_motion_1.motion.div>
                <div className={landingPage_module_css_1.default.gasDescription}>
                  {"A composable system, enabling instant integration of brand new protocols & actions 🤯 🚀"}
                </div>
              </framer_motion_1.motion.div>
              <framer_motion_1.motion.div variants={floatingLeftStates} className={landingPage_module_css_1.default.highLeftActionContainer} style={{
                scale: 0.5,
                top: "230vh",
            }} ref={floatingAaveRef}>
                <framer_motion_1.motion.img className={landingPage_module_css_1.default.floatingProtocolImg} alt="" src={"/aave.svg"} animate={{
                y: y,
            }} transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: (0, utils_1.randomNumber)(1, 10) * (0, utils_1.randomNumber)(0.05, 0.5),
                repeatType: "reverse",
                ease: "easeInOut",
            }}/>
                <ActionsProtocolsPageActionButton name={"Lend"} style={{
                marginLeft: "200px",
                marginTop: "-125px",
                width: "113px",
                height: "107px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
            }} y={y}/>
              </framer_motion_1.motion.div>
              <framer_motion_1.motion.div className={landingPage_module_css_1.default.lowLeftActionContainer} style={{
                scale: 0.5,
                top: "288vh",
                marginLeft: "-20vw",
            }} transition={{
                duration: 2,
                ease: "easeInOut",
                type: "spring",
            }} ref={floatingUnknownLeftRef}>
                <framer_motion_1.motion.img className={landingPage_module_css_1.default.floatingProtocolImg} alt="" src={"/unknownprotocol.svg"} style={{
                marginLeft: "-20px",
            }} animate={{
                y: y,
            }} transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: Math.random() * Math.random() * 1,
                repeatType: "reverse",
                ease: "easeInOut",
            }}/>
                <ActionsProtocolsPageActionButton name={"Stake"} y={y} style={{
                marginLeft: "-100px",
                marginTop: "-40vh",
                marginBottom: "0vw",
                width: "113px",
                height: "107px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
            }}/>
                <ActionsProtocolsPageActionButton name={"Harvest"} y={y} style={{
                marginLeft: "-200px",
                marginTop: "-33vh",
                marginBottom: "0vw",
                width: "113px",
                height: "107px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
            }}/>
              </framer_motion_1.motion.div>
              <framer_motion_1.motion.div className={landingPage_module_css_1.default.lowRightActionContainer} style={{
                scale: 0.5,
                top: "287.6vh",
                marginLeft: "68vw",
            }} transition={{
                duration: 2,
                ease: "easeInOut",
                type: "spring",
            }} ref={floatingUniswapRef}>
                <framer_motion_1.motion.img className={landingPage_module_css_1.default.floatingProtocolImg} alt="" src={"/uniswap.svg"} animate={{
                y: y,
            }} transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: Math.random() * Math.random() * 1,
                repeatType: "reverse",
                ease: "easeInOut",
            }}/>
                <ActionsProtocolsPageActionButton name={"LP Zap"} y={y} style={{
                marginLeft: "-90px",
                marginTop: "-100px",
                width: "113px",
                height: "107px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
            }}/>
                <ActionsProtocolsPageActionButton name={"Add Liquidity"} y={y} style={{
                marginLeft: "-180px",
                marginTop: "-170px",
                width: "113px",
                height: "107px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
            }}/>
              </framer_motion_1.motion.div>
              <framer_motion_1.motion.div ref={floatingUnknownRightRef} className={landingPage_module_css_1.default.highRightActionContainer} style={{
                scale: 0.5,
                top: "227.6vh",
                marginLeft: "60vw",
            }}>
                <framer_motion_1.motion.img className={landingPage_module_css_1.default.floatingProtocolImg} alt="" src={"/unknownprotocol.svg"} animate={{
                y: y,
            }} transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: Math.random() * Math.random() * 1,
                repeatType: "reverse",
                ease: "easeInOut",
            }}/>
                <ActionsProtocolsPageActionButton name={"Cross-Chain Swap"} y={y} style={{
                marginLeft: "-215px",
                marginTop: "-180px",
                marginBottom: "0vw",
                width: "113px",
                height: "107px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.32)",
                zIndex: "1",
            }}/>
              </framer_motion_1.motion.div>
              {fullProtocolsList && windowSize.width > 800 && (<framer_motion_1.motion.div className={landingPage_module_css_1.default.protocolsContainer} ref={protocolsContainerRef} style={{
                    left: `${windowSize.width / 2 -
                        ((_6 = protocolsContainerRef.current) === null || _6 === void 0 ? void 0 : _6.getBoundingClientRect().width) /
                            (windowSize.width <= 768
                                ? 1
                                : windowSize.width <= 1124
                                    ? 1.375
                                    : 2)}px`,
                }}>
                  <ProtocolCard_1.ProtocolCard protocolDetails={fullProtocolsList[0]}/>
                  <ProtocolCard_1.ProtocolCard protocolDetails={fullProtocolsList[1]}/>
                  <ProtocolCard_1.ProtocolCard protocolDetails={fullProtocolsList[2]}/>
                </framer_motion_1.motion.div>)}
            </div>)}
          <div className={landingPage_module_css_1.default.finalPage}>
            <framer_motion_1.motion.div className={landingPage_module_css_1.default.finalPageGradientBlur} initial={{
            background: "linear-gradient(20deg, #00b2ec 0%, #d9ca0f 100%)",
        }} animate={{
            background: "linear-gradient(180deg, #00b2ec 0%, #d9ca0f 100%)",
        }} transition={{
            duration: 3.8,
            repeat: Infinity,
            delay: Math.random() * Math.random() * 1,
            repeatType: "reverse",
            ease: "easeInOut",
        }}></framer_motion_1.motion.div>
            <div className={landingPage_module_css_1.default.finalPageContentContainer}>
              <div className={landingPage_module_css_1.default.finalPageTextContainer}>
                <div className={landingPage_module_css_1.default.finalPageTitleText}>{`Re-Define Your DeFi Experience, Today.`}</div>
                <div className={landingPage_module_css_1.default.finalPageDescriptionText}>
                  (probably not like, today-today, because we are in a private
                  alpha phase currently, but you can sign up to get in as early
                  as possible :D)
                </div>
              </div>
              <div className={landingPage_module_css_1.default.finalPageBottomContainer}>
                <div className={landingPage_module_css_1.default.finalPageSignUpContainer}>
                  <div className={landingPage_module_css_1.default.finalPageSubTitleText}>
                    Sign Up For Early Access
                  </div>
                  <exports.ConnectWalletButtonCustom showNetwork={false} whenConnected={"signup"} modalHandler={setModalOpen} modalStatus={modalOpen}/>
                </div>
                <div className={landingPage_module_css_1.default.finalPageDivisingLine}></div>
                <div className={landingPage_module_css_1.default.finalPageSmContainer}>
                  <div className={landingPage_module_css_1.default.finalPageSubTitleText}>
                    Join Us On Social Media {`(plz ser)`}
                  </div>
                  <div className={landingPage_module_css_1.default.finalPageSmButtonsContainer}>
                    <framer_motion_1.motion.div className={landingPage_module_css_1.default.finalPageSocialMediaButton} whileHover={{ scale: 1.05 }} onClick={() => window.open("https://twitter.com/yield_chain")}>
                      <div style={{
            cursor: "pointer",
        }}>
                        Twitter
                      </div>
                      <img src="/finalpagetwitter.svg" alt="" style={{
            cursor: "pointer",
        }}/>
                    </framer_motion_1.motion.div>
                    <framer_motion_1.motion.div className={landingPage_module_css_1.default.finalPageSocialMediaButton} whileHover={{ scale: 1.05 }} onClick={() => window.open("https://discord.gg/uFGweYZCpB")}>
                      <div style={{
            cursor: "pointer",
        }}>
                        Discord
                      </div>
                      <img src="/discord.svg" alt="" style={{
            cursor: "pointer",
        }}/>
                    </framer_motion_1.motion.div>
                    <framer_motion_1.motion.div className={landingPage_module_css_1.default.finalPageSocialMediaButton} whileHover={{ scale: 1.05 }} onClick={() => window.open("https://yieldchain.t.me")}>
                      <div style={{
            cursor: "pointer",
        }}>
                        Telegram
                      </div>
                      <img src="/telegram.svg" alt="" style={{
            cursor: "pointer",
        }}/>
                    </framer_motion_1.motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
exports.LandingPage = LandingPage;
//# sourceMappingURL=LandingPage.js.map