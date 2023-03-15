import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from "react";
import styles from "./css/strategyInitiation.module.css";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { DatabaseContext, StrategyContext } from "./Contexts/DatabaseContext";
import { ChooseTokenModal } from "./ChooseToken";
import { RightLine } from "./Lines";
import { TokenSwapModal } from "TokenSwapModal";

export const StrategyInitiation = (props: any) => {
  /***************************************************************************
   * Navigation Decleration
   **************************************************************************/

  const navigate = useNavigate();

  /***************************************************************************
   * @Strategy - Current Session's Strategy Context
   **************************************************************************/
  const {
    strategyName,
    setStrategyName,
    depositToken,
    setDepositToken,
    setShowPercentageBox,
    showPercentageBox,
    strategyProcessLocation,
    setStrategyProcessLocation,
    StrategyProcessSteps,
  } = useContext(StrategyContext);

  /**************************************************************************
   * @Database - Database Context
   *************************************************************************/
  const {
    fullProtocolsList,
    fullAddressesList,
    fullTokensList,
    fullNetworksList,
    fullStrategiesList,
    fullProtocolsNetworksList,
    protocolsAddressesList,
    accountAddress,
    setAccountAddress,
    baseStrategyABI,
    erc20ABI,
    provider,
    signer,
  } = useContext(DatabaseContext);

  /**
   * @Styling States
   */

  const [isHoveringBack, setIsHoveringBack] = useState<boolean>(false);
  const [dropdownStatus, setDropdownStatus] = useState<boolean>(false);
  const [isHoveringDropdown, setIsHoveringDropdown] = useState<boolean>(false);

  /**
   * @StrategyUtility States
   */
  const [name, setName] = useState<any>(undefined);
  const [localDepositToken, setlocalDepositToken] = useState<any>(undefined);

  /**
   * @Styling Functions
   */

  const handleTokenDropDown = () => {
    setDropdownStatus(!dropdownStatus);
  };

  const handleProceed = () => {
    setStrategyName(name);
    setDepositToken(localDepositToken);
    navigate("/protocols");
    setStrategyProcessLocation(StrategyProcessSteps.BASE_STRATEGY);
  };

  useEffect(() => {
    if (!strategyName) {
      setStrategyName("Do Kwon Ate My Homework");
      setStrategyProcessLocation(StrategyProcessSteps.INITIALLIZING);
    }
  }, [strategyName]);

  return (
    <div style={{ overflow: "hidden" }}>
      {!dropdownStatus ? null : (
        <TokenSwapModal
          handleModal={setDropdownStatus}
          titleText={"Select Deposit Token"}
          choiceHandler={setlocalDepositToken}
          onClick={() => {
            setShowPercentageBox(true);
          }}
          isStrategy={false}
        />
      )}
      <div className={styles.background} style={{ overflow: "hidden" }}>
        <div
          className={styles.topColorElipse}
          style={{ overflow: "hidden" }}
        ></div>
        <div
          className={styles.bottomColorElipse}
          style={{ overflow: "hidden" }}
        ></div>
        <motion.div
          className={styles.bacBtnContainer}
          style={{ overflow: "hidden" }}
          onClick={() => navigate("/")}
        >
          <motion.div
            className={styles.backBtnText}
            layout
            style={isHoveringBack ? { scale: 1.05 } : { scale: 1 }}
            onMouseEnter={() => setIsHoveringBack(true)}
            onMouseLeave={() => setIsHoveringBack(false)}
          >
            Back
          </motion.div>
          <motion.img
            layout
            src="/leftarrowback.svg"
            alt=""
            className={styles.backBtnArrow}
            style={isHoveringBack ? { scale: 1.05 } : { scale: 1 }}
            onMouseEnter={() => setIsHoveringBack(true)}
            onMouseLeave={() => setIsHoveringBack(false)}
          />
        </motion.div>
        <img
          src="/ycsinglelogo.svg"
          alt=""
          className={styles.ycLogo}
          style={{ overflow: "hidden" }}
        />
        <div className={styles.headText} style={{ overflow: "hidden" }}>
          Lets get started 👋🏽
        </div>
        <div className={styles.descriptionText}>
          Lets begin building your vault - Enter The Details Requested Below!
        </div>
        <div>
          <div className={styles.depositTokenTitle}>Deposit Token</div>
          <div className={styles.depositTokenDescription}>
            This Is The Token You & Other Users Will Deposit Into Your Vault
          </div>
        </div>
        <motion.div
          className={styles.chooseTokenContainer}
          onClick={() => handleTokenDropDown()}
          onMouseEnter={() => setIsHoveringDropdown(true)}
          onMouseLeave={() => setIsHoveringDropdown(false)}
          style={isHoveringDropdown ? { opacity: 0.8 } : {}}
        >
          {!localDepositToken ? (
            <motion.div
              className={styles.chooseTokenPlaceHolderText}
              onClick={() => handleTokenDropDown()}
              style={isHoveringDropdown ? { opacity: 0.8 } : {}}
              onMouseEnter={() => setIsHoveringDropdown(true)}
              onMouseLeave={() => setIsHoveringDropdown(false)}
            >
              Choose Token
            </motion.div>
          ) : (
            <div>
              <motion.img
                src={localDepositToken.logo}
                alt=""
                onClick={() => handleTokenDropDown()}
                style={isHoveringDropdown ? { opacity: 0.8 } : {}}
                onMouseEnter={() => setIsHoveringDropdown(true)}
                onMouseLeave={() => setIsHoveringDropdown(false)}
                className={styles.chooseTokenImg}
              />
              <motion.div
                className={styles.chooseTokenPlaceHolderText}
                onClick={() => handleTokenDropDown()}
                style={
                  isHoveringDropdown
                    ? { opacity: 0.8, left: "25px" }
                    : { left: "25px" }
                }
                onMouseEnter={() => setIsHoveringDropdown(true)}
                onMouseLeave={() => setIsHoveringDropdown(false)}
              >
                {localDepositToken.symbol}
              </motion.div>
            </div>
          )}

          <motion.img
            src="/arrowdowndropdown.svg"
            alt=""
            className={styles.chooseTokenDropdownArrow}
            onClick={() => handleTokenDropDown()}
            onMouseEnter={() => setIsHoveringDropdown(true)}
            onMouseLeave={() => setIsHoveringDropdown(false)}
            style={isHoveringDropdown ? { opacity: 0.8 } : {}}
          />
        </motion.div>
        <div className={styles.strategyNameTitle}>Strategy Name</div>
        <div className={styles.strategyNameDescription}>
          Give Your Strategy A Unique Name - One That Stands out! (Or Use The
          Default One Below)
        </div>
        <input
          type="text"
          className={styles.strategyNameInputContainer}
          placeholder="Do Kwon Cum Farming"
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
      </div>
      <motion.button
        className={styles.proceedBtn}
        style={
          localDepositToken
            ? {}
            : {
                background:
                  "linear-gradient(90deg,  rgba(0, 178, 236, 0.3) 0%,  rgba(217, 202, 15, 0.3) 100%)",
                cursor: "default",
              }
        }
        onClick={() => handleProceed()}
        whileHover={
          localDepositToken
            ? {
                background:
                  "linear-gradient(black, black) padding-box,linear-gradient(90deg, #00b2ec 0%, #d9ca0f 100%) border-box",
                border: "1px solid transparent",
                color: "white",
              }
            : {}
        }
        whileTap={localDepositToken ? { scale: 0.95 } : {}}
      >
        {localDepositToken ? "Continue" : "Choose Deposit Token"}
      </motion.button>
    </div>
  );
};
