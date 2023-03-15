import React, { useState, useEffect, useRef } from "react";
import styles from "./css/landingPage.module.css";
import Marquee from "react-fast-marquee";
import { VerfiedVaultCard } from "./vaultcards";
import { layoutNodes } from "Layouting";
import { NodeStepEnum, SizingEnum } from "StrategyBuilder/Enums";
import { NodeStep } from "StrategyBuilder/StrategyBuilder";
import { AutoLine } from "StrategyBuilder/AutoLine";
import { checkEmail, isSignedUp, randomNumber } from "utils/utils";
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
export const SignUpModal = (props: any) => {
  const { handler } = props;
  const [emailInput, setEmailInput] = useState<any>("");
  const { address } = useAccount();

  const handleComplete = async () => {
    if (checkEmail(emailInput)) {
      console.log("email valid");

      if (await isSignedUp(emailInput, address)) {
        setHoveringDone("You've already signed up!");
        setTimeout(() => {
          setHoveringDone(false);
        }, 2000);

        return;
      }
      await axios.post("https://api.yieldchain.io/signup", {
        email: emailInput,
        address: `${address}`,
      });
      setHoveringDone("Signed Up Successfully!");
      setTimeout(() => {
        setHoveringDone(false);
      }, 2000);
      handler(false);
    } else {
      setHoveringDone("Email Is Invalid, Try Again");
      setTimeout(() => {
        setHoveringDone(false);
      }, 2000);
    }
  };

  const buttonRef = useRef<any>();
  const [hoveringDone, setHoveringDone] = useState<any>(false);

  const { theme } = props;

  return (
    <div className={styles.signUpBlurWrapper} onClick={() => handler(false)}>
      {hoveringDone && (
        <HoverDetails
          top={buttonRef.current.getBoundingClientRect().top - 5}
          left={buttonRef.current.getBoundingClientRect().left - 20}
          text={hoveringDone}
        />
      )}
      <div
        className={styles.signUpModalBody}
        onClick={(e: any) => e.stopPropagation()}
        style={{
          backgroundImage:
            theme === "dark"
              ? "linear-gradient(95.87deg, rgba(53, 53, 53, 1) 100%, rgb(53, 53, 53, 1) 100%)"
              : "linear-gradient(95.87deg, rgba(219, 219, 219, 1) 100%, rgba(205, 205, 205, 1) 100%)",
        }}
      >
        <div className={styles.signUpModalTextFlex}>
          <div
            className={styles.signUpModalTitleText}
            style={{
              color: theme === "dark" ? "white" : "black",
            }}
          >
            Give Us A Way To Contact You
          </div>
          <div
            className={styles.signUpModalDescriptionText}
            style={{
              color: theme === "dark" ? "#676671" : "#202023",
            }}
          >
            We're gonna have to reach out one way or another, anon
          </div>
        </div>
        <div className={styles.signUpModalBottomFlex}>
          <div className={styles.signUpModalEmailFlex}>
            <div
              className={styles.signUpModalEmailTitleText}
              style={{
                color: theme === "dark" ? "#676671" : "#202023",
              }}
            >
              Email:
            </div>
            <input
              className={styles.signUpModalEmailInputContainer}
              placeholder="e.g: SBFxxxCaroline@ftx.com"
              onChange={(e: any) => setEmailInput(e.target.value)}
              style={{
                background: theme === "dark" ? "#111111" : "white",
                borderColor: theme === "dark" ? "#363636" : "#DCDCDC",
              }}
            />
          </div>
          <motion.div
            className={styles.signUpModalButton}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleComplete()}
            ref={buttonRef}
          >
            Done
          </motion.div>
        </div>
      </div>
    </div>
  );
};
