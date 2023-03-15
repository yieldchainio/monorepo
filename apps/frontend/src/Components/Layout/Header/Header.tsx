import { FunctionComponent, useState } from "react";
import styles from "../../../css/MainDashboard.module.css";
import styles1 from "../../../css/ProtocolList.module.css";
import styles2 from "../../../css/landingPage.module.css";
import { useNavigate, NavLink } from "react-router-dom";
import NetworkDropdown from "./NetworkDropdown";
import AccountDropdown from "./AccountDropdown";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header: FunctionComponent = () => {
  const navigate = useNavigate();
  const [network, setNetwork] = useState("Ethereum");

  function onCreateVaultSelect() {
    navigate("/protocolList");
  }
  const location = useLocation();
  if (location.pathname === ("/landing" || "/whitelist")) {
    return <div>{null}</div>;
  } else {
    return (
      <div
        style={{
          zIndex: 10,
          backgroundColor: "rgba(0, 0, 0, 1)",
          overflow: "hidden !important",
          overflowX: "hidden",
        }}
      >
        <div>
          <button
            className={styles.yieldchainLogo1}
            onClick={() => navigate("/")}
            style={{ zIndex: "20" }}
          />
        </div>
        <div className={styles.frameDiv128}>
          <div className={styles.frameDiv129}>
            <NavLink style={{ zIndex: "20" }} to="/">
              Vault
            </NavLink>
          </div>
          <div className={styles.frameDiv130} style={{ zIndex: "20" }}>
            <div className={styles.groupDiv69} style={{ zIndex: "20" }}>
              <NavLink
                style={{ zIndex: "20" }}
                to="/protocolList"
                className={({ isActive }) =>
                  isActive ? styles.vaultB : styles.portfolioDiv
                }
              >
                Portfolio
              </NavLink>
            </div>
          </div>
          <div className={styles.frameDiv130} style={{ zIndex: "20" }}>
            <NavLink
              style={{ zIndex: "20" }}
              to="/CreateStrategy"
              className={({ isActive }) =>
                isActive ? styles.vaultB : styles.etherumDiv
              }
            >
              My Vault
            </NavLink>
          </div>
          <div className={styles.frameDiv130} style={{ zIndex: 100 }}>
            <NavLink
              style={{ zIndex: "20" }}
              to="/Protocols"
              className={({ isActive }) =>
                isActive ? styles.vaultB : styles.etherumDiv
              }
            >
              Stake YC
            </NavLink>
          </div>
        </div>
        <div className={styles.frameDiv} style={{ zIndex: "20" }}>
          <div className={styles.frameDiv1} style={{ zIndex: "20" }}>
            {/* <img
            className={styles.simpleIconslitecoin}
            alt=""
            src="simpleiconslitecoin@2x.png"
          /> */}

            {/* <select name="networks" id="networks" className={styles.dropdown}>
            <option value="Ethereum">Ethereum</option>
            <option value="Binance">Binance</option>
            <option value="Avalanche">Avalanche</option>
            <option value="Polygon">Polygon</option>
          </select> */}
            <NetworkDropdown />
          </div>
        </div>
        {/* <div className={styles.groupDiv}>
        <img className={styles.ellipseIcon} alt="" src="ellipse@2x.png" />
        <div className={styles.groupDiv1}>
          <div className={styles.metamaskDiv}>Metamask</div>
          <div className={styles.iD65FG646Div}>ID65.....FG646</div>
        </div>
        <img className={styles.chevronDownIcon} alt="" src="chevrondown4.svg" />
      </div> */}
        <AccountDropdown />
        <div className={styles1.frameDiv52} style={{ zIndex: "20" }}>
          <div className={styles1.frameDiv53} style={{ zIndex: "20" }}>
            <motion.div
              onClick={() => navigate("/initiate")}
              className={styles1.headerCreateVault}
              style={{ zIndex: "20" }}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.025 }}
            >
              Create Vault
            </motion.div>
          </div>
        </div>
      </div>
    );
  }
};

export default Header;
