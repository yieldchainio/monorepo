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
exports.ProtocolCard = void 0;
const protocolscards_module_css_1 = __importDefault(require("./css/protocolscards.module.css"));
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const fast_average_color_1 = require("fast-average-color");
const framer_motion_1 = require("framer-motion");
const DatabaseContext_1 = require("./Contexts/DatabaseContext");
const axios_1 = __importDefault(require("axios"));
/* Card component for a verified vault card */
const ProtocolCard = (props) => {
    const { fullNetworksList, fullProtocolsNetworksList } = (0, react_1.useContext)(DatabaseContext_1.DatabaseContext);
    (0, react_1.useEffect)(() => {
        console.log("Ful lprotocols networks list inside protocl card,", fullProtocolsNetworksList);
    }, [fullProtocolsNetworksList]);
    let navigate = (0, react_router_dom_1.useNavigate)();
    let { protocolName } = (0, react_router_dom_1.useParams)();
    const handleCopy = async (_text) => {
        navigator.clipboard
            .writeText(`${_text}`)
            .then((res) => alert("Copied TO Clipboard"));
    };
    const [dominantColor, setDominantColor] = (0, react_1.useState)(undefined);
    const [modifiedDomColor, setModifiedDomColor] = (0, react_1.useState)(undefined);
    const [isDomColorDark, setIsDomColorDark] = (0, react_1.useState)(undefined);
    const [networksList, setNetworksList] = (0, react_1.useState)(undefined);
    const [poolsAmt, setPoolsAmt] = (0, react_1.useState)(0);
    const fac = new fast_average_color_1.FastAverageColor();
    (0, react_1.useEffect)(() => {
        if (fullProtocolsNetworksList !== undefined) {
            console.log("Protocols networks list is not undefined se");
            let currentProtocolNetworks = fullProtocolsNetworksList.filter((item) => item.protocol_identifier == props.protocolDetails.protocol_identifier);
            setNetworksList(currentProtocolNetworks);
        }
        else {
            console.log("Protocols networks list is undefined se", fullProtocolsNetworksList);
        }
    }, [fullProtocolsNetworksList, props.protocolDetails]);
    const getColor = async () => {
        if (!props.protocolDetails.color) {
            let domColor = await fac
                .getColorAsync(props.protocolDetails.logo)
                .then(async (color) => {
                await axios_1.default.post(`https://api.yieldchain.io/protocolColor/${props.protocolDetails.protocol_identifier}/'${color.hex.toString().split("#")[1]}'`);
                if (dominantColor == undefined) {
                    setDominantColor(color);
                }
                else {
                    let someArr = await dominantColor.hex
                        .split("")
                        .filter((item, index) => index > 2);
                    await someArr.unshift("#", "0", "0");
                    await someArr.push("6", "0");
                    let modDomColor = await someArr.join("");
                    setModifiedDomColor(modDomColor);
                    !dominantColor.isDark
                        ? setIsDomColorDark(true)
                        : setIsDomColorDark(false);
                }
            });
            return;
        }
        else {
            setDominantColor(props.protocolDetails.color);
            return;
        }
    };
    (0, react_1.useEffect)(() => {
        getColor().then(() => {
            return;
        });
    }, [props.protocolDetails]);
    return (<framer_motion_1.motion.div className={protocolscards_module_css_1.default.vaultCard} whileHover={{ scale: 1.025 }} style={props.style ? props.style : {}}>
      {/* <div>{vaultModal && <VaultModal protocolDetails={props} />}</div> */}

      <div className={protocolscards_module_css_1.default.apyvalues} style={dominantColor !== undefined
            ? {
                background: `linear-gradient(90deg, #${dominantColor}, #50af951a`,
            }
            : {}}>
        <div className={protocolscards_module_css_1.default.apyvalue}>
          ~APY: {props.protocolDetails.avgapy}%
        </div>

        <div>
          {props.protocolDetails.is_verified == 1 ? (<img src="verifiedtag.svg" alt=""/>) : null}
        </div>
      </div>

      <div className={protocolscards_module_css_1.default.cardContent}>
        <div className={protocolscards_module_css_1.default.pairname}>{props.protocolDetails.name}</div>
        <div className={protocolscards_module_css_1.default.network}>
          {networksList == undefined
            ? undefined
            : networksList.map((networkObj, index, arr) => `${fullNetworksList[fullNetworksList.findIndex((item) => item.chainId == networkObj.chainId)].network_name}${index == arr.length - 1 ? "" : ", "}`)}
        </div>

        <div className={protocolscards_module_css_1.default.imgBorder}>
          <div className={protocolscards_module_css_1.default.imgBorderGradient} style={dominantColor !== undefined
            ? { background: `#${dominantColor}` }
            : {}}></div>
          <img src={props.protocolDetails.logo} className={protocolscards_module_css_1.default.img}/>
          <img src={props.protocolDetails.logo} className={protocolscards_module_css_1.default.img2}/>
        </div>

        <framer_motion_1.motion.ul className={protocolscards_module_css_1.default.cardlists} key={props.protocolDetails.website}>
          <li className={protocolscards_module_css_1.default.cardlist}>
            <span className={protocolscards_module_css_1.default.key}>Total Value Locked</span>
            <span className={protocolscards_module_css_1.default.value}>
              ${props.protocolDetails.aggregated_tvl}
            </span>
          </li>
          <li className={protocolscards_module_css_1.default.cardlist}>
            <span className={protocolscards_module_css_1.default.key}>Website</span>
            <span className={protocolscards_module_css_1.default.value} onClick={async () => handleCopy(props.protocolDetails.website)}>
              {props.protocolDetails.website}
              <img src="copy.png" className={protocolscards_module_css_1.default.copyImg}/>
            </span>
          </li>
          <li className={protocolscards_module_css_1.default.cardlist}>
            <span className={protocolscards_module_css_1.default.key}>Deployed Vaults</span>
            <span className={protocolscards_module_css_1.default.value}>
              {props.protocolDetails.yc_vaults_num}
            </span>
          </li>
        </framer_motion_1.motion.ul>
        <button className={protocolscards_module_css_1.default.cardBtn} onClick={() => navigate(`/protocols/${props.protocolDetails.protocol_identifier}`)}>
          Enter Protocol
        </button>
      </div>
    </framer_motion_1.motion.div>);
};
exports.ProtocolCard = ProtocolCard;
//# sourceMappingURL=ProtocolCard.js.map