"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmStrategy = void 0;
const ConfirmStrategy_module_css_1 = __importDefault(require("./css/ConfirmStrategy.module.css"));
const BuildingBlock_1 = require("./BuildingBlock");
const ConfirmStrategy = () => {
    return (<div className={ConfirmStrategy_module_css_1.default.modalDiv}>
      <div className={ConfirmStrategy_module_css_1.default.groupDiv1}>
        <div className={ConfirmStrategy_module_css_1.default.titleDiv}>Confirm Strategy</div>
        <div className={ConfirmStrategy_module_css_1.default.contentDiv}>
          <div className={ConfirmStrategy_module_css_1.default.subtitleDiv}>
            Stake Cake on Pancakeswap, Harvest Cake, Stake 50% Cake on
            Pancakeswap, Swap 50% to MATIC on polygon network.{" "}
            <span className={ConfirmStrategy_module_css_1.default.linkText}>Read more</span>
          </div>
          <div className={ConfirmStrategy_module_css_1.default.inputGrp}>
            <div className={ConfirmStrategy_module_css_1.default.inputGrpTitle}>APY / APR</div>
            <div className={ConfirmStrategy_module_css_1.default.inputSection}>
              <div className={ConfirmStrategy_module_css_1.default.topInputSection}>
                <input placeholder="New APY" className={ConfirmStrategy_module_css_1.default.inputField}/>
                <div className={ConfirmStrategy_module_css_1.default.value}>220%</div>
              </div>
              <div className={ConfirmStrategy_module_css_1.default.bottomInputSection}>
                <input placeholder="Old APY" className={ConfirmStrategy_module_css_1.default.inputField}/>
                <div>120%</div>
              </div>
            </div>
          </div>
          <div className={ConfirmStrategy_module_css_1.default.inputGrp}>
            <div className={ConfirmStrategy_module_css_1.default.inputGrpTitle}>Token Details</div>
            <div className={ConfirmStrategy_module_css_1.default.inputSection}>
              <div className={ConfirmStrategy_module_css_1.default.topInputSection}>
                <input placeholder="Initial Staked Token" className={ConfirmStrategy_module_css_1.default.inputField}/>
                <div className={ConfirmStrategy_module_css_1.default.valueGrp}>
                  <div>BNB</div>
                  <img src="bnb.svg"/>
                </div>
              </div>
              <div className={ConfirmStrategy_module_css_1.default.bottomInputSection}>
                <input placeholder="Reward Token" className={ConfirmStrategy_module_css_1.default.inputField}/>
                <div className={ConfirmStrategy_module_css_1.default.valueGrp}>
                  <div>Cake</div>
                  <img src="cake.svg"/>
                </div>
              </div>
            </div>
          </div>
          <div className={ConfirmStrategy_module_css_1.default.inputGrp}>
            <div className={ConfirmStrategy_module_css_1.default.inputGrpTitle}>Performance Fees</div>
            <div className={ConfirmStrategy_module_css_1.default.inputSection}>
              <div className={ConfirmStrategy_module_css_1.default.bottomInputSection}>
                <input placeholder="Vault Gas Fees" className={ConfirmStrategy_module_css_1.default.inputField}/>
                <div className={ConfirmStrategy_module_css_1.default.valueGrp}>
                  <div>120.78%</div>
                  <img src="Vector.svg"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={ConfirmStrategy_module_css_1.default.btns}>
          <button className={ConfirmStrategy_module_css_1.default.cancelBtn}>Cancel</button>
          <button className={ConfirmStrategy_module_css_1.default.saveBtn}>Save Duration</button>
        </div>
      </div>
      <div className={ConfirmStrategy_module_css_1.default.groupDiv2}>
        <div className={ConfirmStrategy_module_css_1.default.titleDiv}>Building Blocks</div>
        <div className={ConfirmStrategy_module_css_1.default.blocks}>
          <div className={ConfirmStrategy_module_css_1.default.block}>
            <BuildingBlock_1.BuildingBlock src="cake.svg">
              <div className={ConfirmStrategy_module_css_1.default.innerText}>Stake: </div>
              <img src="Ellipse 9.svg"/>
              <img src="arrow.svg"/>
              <img src="Ellipse 9.svg"/>
            </BuildingBlock_1.BuildingBlock>
            <div className={ConfirmStrategy_module_css_1.default.connector}></div>
            <div className={ConfirmStrategy_module_css_1.default.curvedConnector}></div>
          </div>
          <div className={ConfirmStrategy_module_css_1.default.flexBlocks}>
            <div className={ConfirmStrategy_module_css_1.default.block}>
              <BuildingBlock_1.BuildingBlock src="cake.svg">
                <div className={ConfirmStrategy_module_css_1.default.innerText}>Stake: </div>
                <img src="Ellipse 9.svg"/>
                <img src="arrow.svg"/>
                <img src="Ellipse 9.svg"/>
              </BuildingBlock_1.BuildingBlock>
              <div className={ConfirmStrategy_module_css_1.default.connector}></div>
            </div>
            <BuildingBlock_1.BuildingBlock src="cake.svg">
              <div className={ConfirmStrategy_module_css_1.default.innerText}>Stake: </div>
              <img src="Ellipse 9.svg"/>
              <img src="arrow.svg"/>
              <img src="Ellipse 9.svg"/>
            </BuildingBlock_1.BuildingBlock>
          </div>
          <div className={ConfirmStrategy_module_css_1.default.block}>
            <BuildingBlock_1.BuildingBlock src="cake.svg">
              <div className={ConfirmStrategy_module_css_1.default.innerText}>Stake: </div>
              <img src="Ellipse 9.svg"/>
              <img src="arrow.svg"/>
              <img src="Ellipse 9.svg"/>
            </BuildingBlock_1.BuildingBlock>
            <div className={ConfirmStrategy_module_css_1.default.connector}></div>
          </div>
          <div className={ConfirmStrategy_module_css_1.default.block}>
            <BuildingBlock_1.BuildingBlock src="cake.svg">
              <div className={ConfirmStrategy_module_css_1.default.innerText}>Stake: </div>
              <img src="Ellipse 9.svg"/>
              <img src="arrow.svg"/>
              <img src="Ellipse 9.svg"/>
            </BuildingBlock_1.BuildingBlock>
            <div className={ConfirmStrategy_module_css_1.default.connector}></div>
            <div className={ConfirmStrategy_module_css_1.default.curvedConnector}></div>
          </div>
          <div className={ConfirmStrategy_module_css_1.default.flexBlocks}>
            <div className={ConfirmStrategy_module_css_1.default.block}>
              <BuildingBlock_1.BuildingBlock src="cake.svg">
                <div className={ConfirmStrategy_module_css_1.default.innerText}>Stake: </div>
                <img src="Ellipse 9.svg"/>
                <img src="arrow.svg"/>
                <img src="Ellipse 9.svg"/>
              </BuildingBlock_1.BuildingBlock>
              <div className={ConfirmStrategy_module_css_1.default.connector}></div>
            </div>
            <div className={ConfirmStrategy_module_css_1.default.block}>
              <BuildingBlock_1.BuildingBlock src="cake.svg">
                <div className={ConfirmStrategy_module_css_1.default.innerText}>Stake: </div>
                <img src="Ellipse 9.svg"/>
                <img src="arrow.svg"/>
                <img src="Ellipse 9.svg"/>
              </BuildingBlock_1.BuildingBlock>
              <div className={ConfirmStrategy_module_css_1.default.connector}></div>
            </div>
          </div>

          <div className={ConfirmStrategy_module_css_1.default.flexBlocks}>
            <BuildingBlock_1.BuildingBlock src="cake.svg">
              <div className={ConfirmStrategy_module_css_1.default.innerText}>Stake: </div>
              <img src="Ellipse 9.svg"/>
              <img src="arrow.svg"/>
              <img src="Ellipse 9.svg"/>
            </BuildingBlock_1.BuildingBlock>

            <BuildingBlock_1.BuildingBlock src="cake.svg">
              <div className={ConfirmStrategy_module_css_1.default.innerText}>Stake: </div>
              <img src="Ellipse 9.svg"/>
              <img src="arrow.svg"/>
              <img src="Ellipse 9.svg"/>
            </BuildingBlock_1.BuildingBlock>
          </div>
        </div>
      </div>
    </div>);
};
exports.ConfirmStrategy = ConfirmStrategy;
//# sourceMappingURL=ConfirmStrategy.js.map