import styles from "./css/landingPage.module.css";
import React, { useState, useEffect, useRef } from "react";
import { checkEmail, isSignedUp, randomNumber } from "utils/utils";
import { motion, useTransform } from "framer-motion";
import { useAccount } from "wagmi";

import { ConnectWalletButtonCustom } from "./LandingPage";
import { SignUpModal } from "./SignupModal";
import { LandingHeader } from "./LandingPage";

export const WhitelistingPage = (props: any) => {
  enum SignupStateEnum {
    NOT_SIGNED_UP,
    NOT_CONNECTED,
    SIGNED_UP,
  }
  enum ColorState {
    NOT_SIGNED_UP = "linear-gradient(90deg, rgb(153, 88, 34) 0%,rgba(153, 88, 34) 100%)",
    NOT_CONNECTED = "linear-gradient(90deg, rgb(0, 178, 236) 0%, rgb(217, 202, 15) 100%)",
    SIGNED_UP = "linear-gradient(90deg, rgb(102, 159, 42) 0%, rgb(102, 159, 42) 100%)",
  }
  enum TitleStates {
    NOT_SIGNED_UP = "Nope! :(",
    NOT_CONNECTED = "Connect Your Wallet To See If You Are Whitelisted 👀",
    SIGNED_UP = "Signed Up! ✅",
  }

  enum subTitleStates {
    NOT_SIGNED_UP = "Sign Up To Get In ASAP, We’re Waiting For You <3",
    NOT_CONNECTED = "we are currently running on a private testing phase, so you've got to whitelist (sorry!)",
    SIGNED_UP = "You're all set!",
  }
  const { address, isConnected, isDisconnected } = useAccount();

  const [signupState, setSignupState] = useState<SignupStateEnum>(
    SignupStateEnum.NOT_CONNECTED
  );
  const [colorState, setColorState] = useState<ColorState>(
    ColorState.NOT_CONNECTED
  );

  const [subTitleState, setSubtitleState] = useState<subTitleStates>(
    subTitleStates.NOT_CONNECTED
  );

  const [titleState, setTitleState] = useState<TitleStates>(
    TitleStates.NOT_CONNECTED
  );

  const handleUserUpdate = async () => {
    if (!isConnected) {
      setSignupState(SignupStateEnum.NOT_CONNECTED);
    } else {
      if (await isSignedUp("shitemail", address)) {
        setSignupState(SignupStateEnum.SIGNED_UP);
      } else {
        setSignupState(SignupStateEnum.NOT_SIGNED_UP);
      }
    }
  };

  useEffect(() => {
    handleUserUpdate();
  }, [address, isConnected, isDisconnected]);

  useEffect(() => {
    switch (signupState) {
      case SignupStateEnum.NOT_SIGNED_UP:
        setColorState(ColorState.NOT_SIGNED_UP);
        setTitleState(TitleStates.NOT_SIGNED_UP);
        setSubtitleState(subTitleStates.NOT_SIGNED_UP);
        break;
      case SignupStateEnum.NOT_CONNECTED:
        setColorState(ColorState.NOT_CONNECTED);
        setTitleState(TitleStates.NOT_CONNECTED);
        setSubtitleState(subTitleStates.NOT_CONNECTED);

        break;
      case SignupStateEnum.SIGNED_UP:
        setColorState(ColorState.SIGNED_UP);
        setTitleState(TitleStates.SIGNED_UP);
        setSubtitleState(subTitleStates.SIGNED_UP);

        break;
    }
  }, [signupState]);

  const [modalOpen, setModalOpen] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
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

  return (
    <div>
      <LandingHeader width={windowSize.width} />

      {modalOpen && <SignUpModal handler={setModalOpen} theme={"light"} />}
      <div className={styles.whitelistingPage}>
        <div className={styles.whitelistingPageTextContainer}>
          <div className={styles.whitelistingPageTitleText}>{titleState} </div>
          <div className={styles.whitelistingPageSubtitleText}>
            {subTitleState}
          </div>
          {signupState === SignupStateEnum.SIGNED_UP && (
            <div className={styles.whitelistingPageDescriptionText}>
              Feel free to add additional contact info & share this page with
              others to bump your spot up the list
            </div>
          )}
        </div>
        <div className={styles.whitelistingPageBottomContainer}>
          <div
            style={{
              zIndex: 2,
            }}
          >
            <ConnectWalletButtonCustom
              showNetwork={false}
              whenConnected="signup"
              theme={"light"}
              modalHandler={setModalOpen}
              modalStatus={modalOpen}
            />
          </div>
        </div>
        <motion.div
          className={styles.whitelistingPageBottomBlur}
          layout
          animate={{
            backgroundImage: colorState,
          }}
          transition={{
            duration: 3,
          }}
        ></motion.div>
      </div>
    </div>
  );
};
