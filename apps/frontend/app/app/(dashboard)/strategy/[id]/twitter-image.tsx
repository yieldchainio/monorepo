import { DBStrategy, YCClassifications, YCStrategy } from "@yc/yc-models";
import axios from "axios";
import WrappedImage from "components/wrappers/image";
import { ImageResponse } from "next/server";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "YC Strat";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Font
const interSemiBold = fetch(
  new URL("./Inter-SemiBold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

// Image generation
export default async function Image({ params }: { params: { slug: string } }) {
  const strategies = (
    await axios.get("https://api.yieldchain.io/v2/strategies")
  ).data.strategies;
  const strategy = strategies.find((s: DBStrategy) => s.id == params.slug);

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
        fonts: [
          {
            name: "Inter",
            data: await interSemiBold,
            style: "normal",
            weight: 400,
          },
        ],
      }
    );

  await YCClassifications.getInstance().initiallize();

  const strat = new YCStrategy(strategy, YCClassifications.getInstance());

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
        Strategy: {strat.title}
        <div className="flex flex-row items-center gap-1">
          <div style={{ fontSize: 32 }}>Deposit Token:</div>
          <WrappedImage src={strat.depositToken.logo} />
          <div className="text-[32px]">{strat.depositToken.symbol}</div>
        </div>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: "Inter",
          data: await interSemiBold,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
