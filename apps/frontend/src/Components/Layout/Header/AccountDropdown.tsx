import React from "react";
import {
  FunctionComponent,
  useCallback,
  useRef,
  useState,
  useEffect,
  useContext,
} from "react";
import styles from "../../../css/MainDashboard.module.css";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { DatabaseContext } from "../../../Contexts/DatabaseContext";
import { ConnectWalletButtonCustom } from "../../../LandingPage";
import { ConnectButton } from "@rainbow-me/rainbowkit";
declare var window: any;
const ethereum = window.ethereum as MetaMaskInpageProvider;

const AccountDropdown: FunctionComponent = () => {
  /**
   * Gets Web3 Account Available Currently Through Window.Ethereum
   */

  const { accountAddress, setAccountAddress } = useContext(DatabaseContext);
  const getAccounts = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      return account;
    }
  };

  let context;

  // Checks if the user is authenticated currently through a web3 wallet.
  const [isAuthenticated, setIsAuthenticated] = useState(
    ethereum?.isConnected()
  );

  // Keeps track of the user hovering the button
  const [isHovering, setIsHovering] = useState(false);

  // The user's address
  // const [accountAddress, setAccountAddress] = useState("Just A Sec...");

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  // Fetches The Account Address On Mount, If already authenticated previously
  useEffect(() => {
    (async () => {
      const accounts: any = await getAccounts().then((res: any) =>
        setAccountAddress(res)
      );
    })();

    return () => {
      // Component unmount code.
    };
  }, []);

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  // Handles the connect button click, prompts the user to connect their wallet
  const connectButtonOnClick = () => {
    if (typeof window !== "undefined") {
      getAccounts().then((response: any) => {
        setAccountAddress(response);
        setIsAuthenticated(!isAuthenticated);
      });
    }
  };

  // Handles the disconnect button click, simply makes the address goes away (To properly disconnent, the user must disconnect directly within wallet)
  const disconnectButtonOnClick = () => {
    setIsAuthenticated(!isAuthenticated);
  };

  return (
    <div style={{ position: "absolute", left: "1030px", top: "40px" }}>
      <ConnectWalletButtonCustom showNetwork={false} />
    </div>
  );
};

export default AccountDropdown;
