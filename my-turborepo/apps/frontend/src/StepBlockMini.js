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
exports.MiniStepBlock = exports.StepBlockMini = void 0;
const react_1 = __importStar(require("react"));
const vaultmodal_module_css_1 = __importDefault(require("./css/vaultmodal.module.css"));
const strategyBuilder_module_css_1 = __importDefault(require("./css/strategyBuilder.module.css"));
const utils_1 = require("utils/utils");
const StepBlockMini = (props) => {
    const { stepDetails } = props;
    const { type, inflows, outflows, percentage, additional_args, protocol_details, step_identifier, parent_step_identifier, } = stepDetails;
    if (stepDetails) {
        return (<div style={props.style}>
        <div className={strategyBuilder_module_css_1.default.miniNodeContainer}>
          <img src={protocol_details.logo} alt="" className={strategyBuilder_module_css_1.default.miniNodeProtocolImg}/>
          <div className={strategyBuilder_module_css_1.default.miniNodeActionContainer}>
            <div className={strategyBuilder_module_css_1.default.miniNodeActionText}>
              {(0, utils_1.toTitleCase)(type).length > 7
                ? (0, utils_1.toTitleCase)(type).slice(0, 7) + "..."
                : (0, utils_1.toTitleCase)(type)}
            </div>
            <div className={strategyBuilder_module_css_1.default.miniNodeFlowsContainer}>
              <div className={strategyBuilder_module_css_1.default.miniNodeInnerflowContainer}>
                {outflows.length > 0
                ? outflows.map((flow, index, arr) => (<img src={flow.token_details.logo} alt="" className={strategyBuilder_module_css_1.default.miniNodeTokenImg}/>))
                : null}
              </div>
              <img className={strategyBuilder_module_css_1.default.miniNodeFlowsArrow} alt="" src="/miniNodeArrow.svg"/>
              <div className={strategyBuilder_module_css_1.default.miniNodeInnerflowContainer}>
                {inflows.length > 0
                ? inflows.map((flow, index, arr) => (<img src={flow.token_details.logo} alt="" className={strategyBuilder_module_css_1.default.miniNodeTokenImg}/>))
                : null}
              </div>
            </div>
          </div>
          <img src="/horizontaldots.svg" alt="" className={strategyBuilder_module_css_1.default.miniNode3Dots}/>
        </div>
      </div>);
    }
    else {
        return null;
    }
};
exports.StepBlockMini = StepBlockMini;
const MiniStepBlock = (props) => {
    const { type, divisor, function_identifiers, address_identifiers, protocol_identifier, additional_args, flows_identifiers, step_identifier, outflows, inflows, percentage, protocol_details, } = props.stepDetails;
    const [loading, setIsLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        if ((type &&
            divisor &&
            function_identifiers &&
            address_identifiers &&
            protocol_identifier &&
            additional_args &&
            flows_identifiers &&
            step_identifier !== null) ||
            (undefined && outflows && inflows && percentage)) {
            setIsLoading(false);
        }
        else {
        }
    }, [
        type,
        divisor,
        function_identifiers,
        address_identifiers,
        protocol_identifier,
        additional_args,
        flows_identifiers,
        step_identifier,
        outflows,
        inflows,
        percentage,
        protocol_details,
    ]);
    /**
     * Current Step's Details
     */
    if (!loading) {
        return (<div>
        <div className={vaultmodal_module_css_1.default.stepBlockMini} style={props.style}>
          <img src={protocol_details.logo} alt="" className={vaultmodal_module_css_1.default.stepBlockMiniMainImg}/>

          <div className={vaultmodal_module_css_1.default.stepBlockMiniActionContainer}>
            <div className={vaultmodal_module_css_1.default.stepBlockMiniActionName}>
              {(0, utils_1.toTitleCase)(type)}
            </div>
            <div className={vaultmodal_module_css_1.default.stepBlockMiniFlowsContainer}>
              {outflows.length > 0 ? (outflows.map((flow, index, arr) => (<div>
                    <img src={flow.token_details.logo} alt="" className={vaultmodal_module_css_1.default.stepBlockMiniActionFlowImg} style={arr.length > 1 ? { border: "1px solid #353535" } : {}}/>
                  </div>))) : (<img src={"/thin-x.svg"} alt="" className={vaultmodal_module_css_1.default.stepBlockMiniActionFlowImg}/>)}
            </div>

            <img src="realArrowLeft.SVG" alt="" className={vaultmodal_module_css_1.default.stepBlockMiniArrowLeft}/>
            <div className={vaultmodal_module_css_1.default.stepBlockMiniFlowsContainer}>
              {inflows.length > 0 ? (inflows.map((flow, index, arr) => (<div>
                    <img src={flow.token_details.logo} alt="" className={vaultmodal_module_css_1.default.stepBlockMiniActionFlowImg} style={arr.length > 1 ? { border: "1px solid #353535" } : {}}/>
                  </div>))) : (<img src={"/thin-x.svg"} alt="" className={vaultmodal_module_css_1.default.stepBlockMiniActionFlowImg}/>)}
            </div>
          </div>
          <img src="horizontaldots.svg" alt="" className={vaultmodal_module_css_1.default.stepBlockMiniHorizontalDots}/>
        </div>
      </div>);
    }
    else {
        return null;
    }
};
exports.MiniStepBlock = MiniStepBlock;
//# sourceMappingURL=StepBlockMini.js.map