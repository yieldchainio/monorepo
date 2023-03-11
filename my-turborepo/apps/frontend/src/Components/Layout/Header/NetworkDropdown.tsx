import { MetaMaskInpageProvider } from "@metamask/providers";
import React, { FunctionComponent, useCallback, useRef, useState } from "react";
import styles from "../../../css/MainDashboard.module.css";
import { networks } from "../../../data/Networks.js";
const ethereum = window.ethereum as MetaMaskInpageProvider;

declare var window: any;
const NetworkDropdown: FunctionComponent = () => {
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [network, setNetwork] = useState({
    name: "Ethereum",
    img: "group-Ethereum.svg",
  });
  const dropdownHandler = () => {
    setIsActive(!isActive);
  };

  const handleNetworkChange = async (e: any, networkObject: any) => {
    const networkDropDownHandler = (
      e: React.MouseEvent<HTMLLIElement, MouseEvent>
    ) => {
      setNetwork({
        ...network,
        name: "" + (e.target as HTMLElement).textContent,
        img: "group-" + (e.target as HTMLElement).textContent + ".svg",
      });
      setIsActive(!isActive);
    };

    if (window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: networkObject.chainId }],
        });
        networkDropDownHandler(e);
      } catch (err: any) {
        if (err.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainName: networkObject.chainName,
                chainId: networkObject.chainId,
                nativeCurrency: {
                  name: networkObject.nativeCurrency.name,
                  decimals: networkObject.nativeCurrency.decimals,
                  symbol: networkObject.nativeCurrency.symbol,
                },
                rpcUrls: [networkObject.rpcUrls],
              },
            ],
          });
        }
      }
    }
  };

  return (
    <div style={{ zIndex: "100" }}>
      <div className={styles.menuContainer}>
        <button className={styles.menuTrigger} onClick={dropdownHandler}>
          <img
            src={`/${network.img}`}
            className={styles.simpleIconslitecoin}
            alt="Network"
          />
          <span style={{ paddingLeft: "5px" }}>{network.name}</span>
          <img style={{ marginLeft: "5px" }} alt="" src="chevrondown4.svg" />
        </button>
        {isActive && (
          <>
            <nav
              ref={dropdownRef}
              className={`menu ${isActive ? "active" : "inactive"}`}
            >
              <ul className={styles.dropdown}>
                <li
                  onClick={(e) => handleNetworkChange(e, networks[0].avalanche)}
                  className={styles.dropdown}
                >
                  Avalanche
                </li>
                <li
                  onClick={(e) => handleNetworkChange(e, networks[0].bsc)}
                  className={styles.dropdown}
                >
                  Binance
                </li>
                <li
                  onClick={(e) => handleNetworkChange(e, networks[0].ethereum)}
                  className={styles.dropdown}
                >
                  Ethereum
                </li>
                <li
                  onClick={(e) => handleNetworkChange(e, networks[0].polygon)}
                  className={styles.dropdown}
                >
                  Polygon
                </li>
              </ul>
            </nav>
          </>
        )}
      </div>
    </div>
  );
};
export default NetworkDropdown;
