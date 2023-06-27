import { ReactElement } from "react";

const getData = async (component: ReactElement) => {
  const ReactDOMServer = (await import("react-dom/server")).default;
  const staticMarkup = ReactDOMServer.renderToString(component);
  return staticMarkup;
};
export default getData;
