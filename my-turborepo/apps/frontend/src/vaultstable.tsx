import {
  Table,
  TableBody,
  TableCell as BaseTableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import styles from "../src/css/vaultstable.module.css";
import { VaultHeader } from "./vaults";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { DatabaseContext } from "./Contexts/DatabaseContext";

const TableCell = styled(BaseTableCell)({
  color: "#fff",
  border: "none",
  padding: 0,
  paddingTop: "30px",
  fontFamily: "Athletics",
  fontweight: 700,
  fontSize: "16px",
  lineHeight: "24px",
});

const VaultsTable = () => {
  const {
    fullProtocolsList,
    fullPoolsList,
    fullNetworksList,
    fullTokensList,
    fullStrategiesList,
    fullProtocolsNetworksList,
  } = useContext(DatabaseContext);

  const [vaultsList, setVaultslist] = useState([]);

  useEffect(() => {
    if (fullStrategiesList !== undefined) {
      setVaultslist(fullStrategiesList);
    }
  }, [fullStrategiesList]);

  // useEffect(() => {
  //   (async () => {
  //     const vaults = await axios.get("http://localhost:1337/strategies");
  //     setVaultslist(vaults.data.strategies);
  //
  //
  //   })();

  //   return () => {
  //     // this now gets called when the component unmounts
  //   };
  // }, []);
  return (
    <div className={styles.vaulttable}>
      <div className={styles.vaultTitle}>All Vaults</div>
      <TableContainer
        sx={{
          margin: 0,
          padding: 0,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {VaultHeader.map((item: any, index: number) => (
                <TableCell
                  sx={{
                    color: "#676771",
                    fontFamily: "Athletics",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "24px",
                    border: "none",
                  }}
                  key={index}
                >
                  {item}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {vaultsList.map((item: any, index: any) => (
              <TableRow key={index}>
                <TableCell>
                  <div className={styles.flexDiv}>
                    <img src={item.vaultMainImg} className={styles.tableImg} />
                    <div>{item.depositToken}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={styles.flexDiv}>
                    <span>{item.apy}%</span>
                    <span className={styles.prevAPY}>{item.oldApr}%</span>
                  </div>
                </TableCell>
                <TableCell>{item.tvl}</TableCell>
                <TableCell>
                  <div className={styles.flexDiv}>
                    <img
                      src={item.vaultNetworkImg}
                      className={styles.tableNetworkImg}
                    />
                    <div>{item.network_name}</div>
                  </div>
                </TableCell>
                <TableCell>{item.tvl}</TableCell>
                <TableCell>1000</TableCell>
                <TableCell>
                  <div className={styles.flexDiv}>
                    <div>{item.mainprotocolWebsite}</div>
                    <img src="Vector (11).png" />
                  </div>
                </TableCell>
                <TableCell>
                  <button className={styles.enterBtn}>Enter</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default VaultsTable;
