"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const durationModal_module_css_1 = __importDefault(require("./css/durationModal.module.css"));
const DurationModal = () => {
    const [duration, setDuration] = (0, react_1.useState)({
        figure: "",
        time: "",
    });
    const { figure, time } = duration;
    const handleChange = (event) => {
        const { value, name } = event.target;
        setDuration({ ...duration, [name]: value });
    };
    const saveDuration = () => {
        alert(`${figure} and ${time}`);
        setDuration({
            figure: "",
            time: "",
        });
        // cancelModal();
    };
    return (<>
      <div className={durationModal_module_css_1.default.modalDiv} style={{ zIndex: "999999999999999999" }}>
        <div className={durationModal_module_css_1.default.frameDiv1}>
          <div className={durationModal_module_css_1.default.modalTitle}>
            Strategy Created Successfully 🎉
          </div>
          <div className={durationModal_module_css_1.default.modalSubtitle}>
            Your strategy has been created, please set how frequently you want
            the strategy to keep running e.g every 3 days, 8 hours, or every 2
            weeks etc.
          </div>
          <div className={durationModal_module_css_1.default.inputTitle}>Duration</div>

          <div className={durationModal_module_css_1.default.inputGrp}>
            <input type="number" name="figure" value={figure} placeholder="Enter Number" className={durationModal_module_css_1.default.durationInput} onChange={handleChange} required/>
            <select name="time" id="duration" value={time} className={durationModal_module_css_1.default.durationDropdown} onChange={handleChange}>
              <option>Days</option>
              <option>Weeks</option>
              <option>Months</option>
            </select>
          </div>
          <div className={durationModal_module_css_1.default.btns}>
            <button className={durationModal_module_css_1.default.cancelBtn}>Cancel</button>
            <button type="submit" className={durationModal_module_css_1.default.saveBtn} onClick={saveDuration}>
              Save Duration
            </button>
          </div>
        </div>
        <div className={durationModal_module_css_1.default.frameDiv2}>
          <img src="modal-img.png" alt="" className={durationModal_module_css_1.default.image}/>
        </div>
      </div>
      <div className={durationModal_module_css_1.default.wrapper}></div>
    </>);
};
exports.default = DurationModal;
//# sourceMappingURL=durationModal.js.map