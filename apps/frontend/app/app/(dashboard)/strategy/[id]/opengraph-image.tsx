import {
  ClassificationContext,
  JSONStrategy,
  YCClassifications,
  YCStrategy,
} from "@yc/yc-models";
import axios from "axios";
import WrappedImage from "components/wrappers/image";
import { renderToHTML } from "next/dist/server/render";
import { ImageResponse } from "next/server";
import { fetchYC } from "utilities/general/storage/fetch-yc";
import getData from "utilities/meta/image/get-strategy-image";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "YC Strat";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";
// const ReactDOMServer = (await import("react-dom/server")).default;
// const { renderToStaticMarkup } = ReactDOMServer;
// const pp = renderToStaticMarkup(<WrappedImage src={""}></WrappedImage>);

// Image generation
export default async function Image({ params }: { params: { id: string } }) {
  const strategies = await (
    await fetch("https://api.yieldchain.io/v2/strategies", {
      method: "GET",
    })
  ).json();

  const strategy = strategies.strategies.find(
    (s: JSONStrategy) => s.id == params.id
  );

  if (!strategy)
    return new ImageResponse(
      (
        // ImageResponse JSX element
        <div
          style={{
            fontSize: 128,
            background: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Invalid Strategy URL
        </div>
      ),
      // ImageResponse options
      {
        // For convenience, we can re-use the exported opengraph-image
        // size config to also set the ImageResponse's width and height.
        ...size,
      }
    );

  await YCClassifications.getInstance().initiallize(await fetchYC(), true);

  const strat = new YCStrategy(strategy, YCClassifications.getInstance());

  const component = <WrappedImage src={strat.depositToken.logo} />;

  const MaComponent = () => {
    return <div>Hey Ser</div>;
  };

  // const prerenderStaticComponent = await getData(
  //   <WrappedImage src={strat.depositToken.logo} />
  // );

  // console.log("Static component", prerenderStaticComponent);

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
        className="flex flex-col"
      >
        <img width={550} height={550} src={strat.depositToken.logo as string} />
        {/* {prerenderStaticComponent}{" "} */}
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
