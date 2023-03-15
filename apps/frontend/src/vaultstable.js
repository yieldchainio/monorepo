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
const material_1 = require("@mui/material");
const styles_1 = require("@mui/material/styles");
const vaultstable_module_css_1 = __importDefault(require("../src/css/vaultstable.module.css"));
const vaults_1 = require("./vaults");
const react_1 = __importStar(require("react"));
const DatabaseContext_1 = require("./Contexts/DatabaseContext");
const TableCell = (0, styles_1.styled)(material_1.TableCell)({
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
    const { fullProtocolsList, fullPoolsList, fullNetworksList, fullTokensList, fullStrategiesList, fullProtocolsNetworksList, } = (0, react_1.useContext)(DatabaseContext_1.DatabaseContext);
    const [vaultsList, setVaultslist] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
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
    return (<div className={vaultstable_module_css_1.default.vaulttable}>
      <div className={vaultstable_module_css_1.default.vaultTitle}>All Vaults</div>
      <material_1.TableContainer sx={{
            margin: 0,
            padding: 0,
        }}>
        <material_1.Table>
          <material_1.TableHead>
            <material_1.TableRow>
              {vaults_1.VaultHeader.map((item, index) => (<TableCell sx={{
                color: "#676771",
                fontFamily: "Athletics",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "24px",
                border: "none",
            }} key={index}>
                  {item}
                </TableCell>))}
            </material_1.TableRow>
          </material_1.TableHead>
          <material_1.TableBody>
            {vaultsList.map((item, index) => (<material_1.TableRow key={index}>
                <TableCell>
                  <div className={vaultstable_module_css_1.default.flexDiv}>
                    <img src={item.vaultMainImg} className={vaultstable_module_css_1.default.tableImg}/>
                    <div>{item.depositToken}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={vaultstable_module_css_1.default.flexDiv}>
                    <span>{item.apy}%</span>
                    <span className={vaultstable_module_css_1.default.prevAPY}>{item.oldApr}%</span>
                  </div>
                </TableCell>
                <TableCell>{item.tvl}</TableCell>
                <TableCell>
                  <div className={vaultstable_module_css_1.default.flexDiv}>
                    <img src={item.vaultNetworkImg} className={vaultstable_module_css_1.default.tableNetworkImg}/>
                    <div>{item.network_name}</div>
                  </div>
                </TableCell>
                <TableCell>{item.tvl}</TableCell>
                <TableCell>1000</TableCell>
                <TableCell>
                  <div className={vaultstable_module_css_1.default.flexDiv}>
                    <div>{item.mainprotocolWebsite}</div>
                    <img src="Vector (11).png"/>
                  </div>
                </TableCell>
                <TableCell>
                  <button className={vaultstable_module_css_1.default.enterBtn}>Enter</button>
                </TableCell>
              </material_1.TableRow>))}
          </material_1.TableBody>
        </material_1.Table>
      </material_1.TableContainer>
    </div>);
};
exports.default = VaultsTable;
//# sourceMappingURL=vaultstable.js.map