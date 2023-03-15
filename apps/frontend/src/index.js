"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_dom_1 = __importDefault(require("react-dom"));
const App_1 = __importDefault(require("./App"));
const react_router_dom_1 = require("react-router-dom");
const material_1 = require("@mui/material");
require("./css/index.css");
const theme = (0, material_1.createTheme)();
react_dom_1.default.render(<react_router_dom_1.BrowserRouter>
    <material_1.StyledEngineProvider injectFirst>
      <material_1.ThemeProvider theme={theme}>
        <material_1.CssBaseline />
        <link href="fonts/Athletics/stylesheet.css" rel="stylesheet" type="text/css"/>
        <App_1.default />
      </material_1.ThemeProvider>
    </material_1.StyledEngineProvider>
  </react_router_dom_1.BrowserRouter>, document.getElementById("root"));
//# sourceMappingURL=index.js.map