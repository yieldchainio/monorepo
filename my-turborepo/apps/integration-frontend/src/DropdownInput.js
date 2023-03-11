"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const maincss_module_css_1 = __importDefault(require("./css/maincss.module.css"));
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
function DropdownInput({ options, choiceHandler, style, textStyle, imgStyle, placeholder, itemStyle, dropdownStyle, }) {
    const [selected, setSelected] = (0, react_1.useState)(placeholder || options[0]);
    const [open, setOpen] = (0, react_1.useState)(false);
    const handleChoice = (choice) => {
        setSelected(choice);
        choiceHandler(choice.data);
    };
    const boxRef = (0, react_1.useRef)(null);
    return (<div>
      <framer_motion_1.motion.div className={maincss_module_css_1.default.dropdownBox} whileHover={{
            backgroundColor: "rgb(222, 222, 222)",
        }} transition={{ duration: 0.2 }} onClick={() => setOpen(!open)} style={style ? style : {}} ref={boxRef}>
        {selected.image && (<img src={selected.image} alt="" className={maincss_module_css_1.default.dropdownBoxImage}/>)}
        <div className={maincss_module_css_1.default.dropdownBoxTitle} style={textStyle ? textStyle : {}}>
          {selected.label}
        </div>
        <img src="/triangle.svg" alt="" className={maincss_module_css_1.default.dropdownTriangle}/>
      </framer_motion_1.motion.div>
      {open && (<div className={maincss_module_css_1.default.dropdown} style={{ ...dropdownStyle, position: "absolute" }}>
          {options.map((option) => {
                return (<framer_motion_1.motion.div className={maincss_module_css_1.default.dropdownItem} onClick={() => {
                        setSelected(option);
                        setOpen(false);
                        handleChoice(option);
                    }} whileHover={{
                        backgroundColor: "rgb(222, 222, 222)",
                    }} style={{ ...itemStyle }}>
                {option.image && (<img src={option.image} alt="" className={maincss_module_css_1.default.dropdownBoxImage}/>)}
                <div className={maincss_module_css_1.default.dropdownBoxTitle} style={itemStyle ? itemStyle : {}}>
                  {option.label}
                </div>
              </framer_motion_1.motion.div>);
            })}
        </div>)}
    </div>);
}
exports.default = DropdownInput;
//# sourceMappingURL=DropdownInput.js.map