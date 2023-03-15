"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoverDetails = void 0;
const globalStyles_module_css_1 = __importDefault(require("./css/globalStyles.module.css"));
const framer_motion_1 = require("framer-motion");
const react_1 = require("react");
const HoverDetails = (props) => {
    const variant = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    };
    const [isHovering, setIsHovering] = (0, react_1.useState)(false);
    const [currentWidth, setCurrentWidth] = (0, react_1.useState)(0);
    const currentRef = (0, react_1.useRef)(null);
    let { text, top, left } = props;
    (0, react_1.useLayoutEffect)(() => {
        setCurrentWidth(currentRef.current.offsetWidth);
        return () => {
            setCurrentWidth(0);
        };
    }, []);
    return (<framer_motion_1.AnimatePresence>
      {text || isHovering ? (<framer_motion_1.motion.div className={globalStyles_module_css_1.default.miniHoverDetailsContainer} ref={currentRef} style={{
                top: `${top - 35}px`,
                left: `${left}px`,
                zIndex: "99999999999999999999",
            }} variants={variant} key="container" initial="initial" animate="animate" exit="exit" onMouseEnter={() => setIsHovering(true)}>
          <framer_motion_1.motion.div className={globalStyles_module_css_1.default.miniHoverDetailsText} variants={variant} key="containerText" initial="initial" animate="animate" exit="exit" onMouseEnter={(e) => e.stopPropagation()}>
            {text}
          </framer_motion_1.motion.div>
        </framer_motion_1.motion.div>) : null}
    </framer_motion_1.AnimatePresence>);
};
exports.HoverDetails = HoverDetails;
//# sourceMappingURL=HoverDetails.js.map