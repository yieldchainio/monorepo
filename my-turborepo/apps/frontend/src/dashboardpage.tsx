import styles from "./css/dashboardpage.module.css";
import HeroSection from "./herosection";
import VaultSection from "./vaultSection";
import VaultsTable from "./vaultstable";
import { VaultModal } from "./vaultModal";
import React, { useState, useEffect } from "react";
import { useLockedBody } from "usehooks-ts";
import { useSigner } from "wagmi";
import { isWhitelisted } from "./utils/utils.js";
import { LoadingScreen } from "LoadingScreen";

const DashBoardPage = () => {
  const { data: signer, isError, isLoading } = useSigner();

  const [currentVaultModal, setCurrentVaultModal] = useState(undefined);
  const [locked, setLocked] = useLockedBody(false, "root");
  const [state, setState] = useState("loading");
  // const [mousePosition, setMousePosition] = useState("");

  const toggleLocked = () => {
    setLocked(!locked);
  };
  const [whitelisted, setWhitelisted] = useState(false);

  useEffect(() => {
    (async () => {
      if (signer) {
        console.log("Singer mofo", signer, "get address", signer.getAddress());
        const didUserGetWhitelisted = await isWhitelisted(
          await signer.getAddress()
        );
        console.log("Did user get whitlisted? ", didUserGetWhitelisted);
        setWhitelisted(didUserGetWhitelisted);
      }
    })();

    return () => {
      setWhitelisted(false);
    };
  }, [signer]);

  if (!whitelisted) {
    setTimeout(() => {
      if (!whitelisted) {
        setState("notWhitelisted");
      }
    }, 5000);

    if (state === "notWhitelisted") {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            color: "white",
          }}
        >
          <h1>Sorry, you're not currently whitelisted</h1>
        </div>
      );
    }

    return <LoadingScreen />;
  }

  return (
    <div
      className={styles.dashboardpage}
      style={
        !!currentVaultModal ? { overflow: "hidden" } : { overflow: "default" }
      }
    >
      {/* {currentVaultModal !== undefined ? toggleLocked : null} */}
      <HeroSection />
      <VaultSection
        modalHandler={setCurrentVaultModal}

        // positionHandler={setMousePosition}
      />
      {currentVaultModal !== undefined ? (
        <VaultModal
          vaultDetails={currentVaultModal}
          modalHandler={setCurrentVaultModal}
        />
      ) : undefined}
      <VaultsTable />
    </div>
  );
};

export default DashBoardPage;
