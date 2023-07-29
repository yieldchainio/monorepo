import "css/globals.css";
import { Header } from "components/header";
import { ClassificationContext } from "@yc/yc-models";
import { DataVersions, fetchYC } from "utilities/general/storage/fetch-yc";
import StoreInitiallizor from "utilities/hooks/stores/store-initiallizor";
import WrappedWagmi from "configs/wagmi";
import { ModalProvider } from "components/modals/base/provider";
import { ShallowRouter } from "components/internal/shallow-router";
import { LoggerProvider } from "components/logger";
import { WhitelistProtection } from "components/whitelist-protection";
import { PepeAd } from "components/pepe-ad";
import { PremiumAd } from "components/premium-ad";

export const metadata = {
  title: "Yieldchain",
  description: "Next-Level DeFi",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // First return the data initiallizor, then the entire app
  // Fetch the initial data
  const data: ClassificationContext = await fetchYC(DataVersions.V2);

  return (
    <html lang="en" className="dark">
      <head></head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, minimum-scale=1"
      />
      <StoreInitiallizor context={data} />
      <body className="bg-custom-bg overflow-x-hidden">
        <WrappedWagmi>
          <Header />
          <ShallowRouter />
          <link
            href="fonts/Athletics/stylesheet.css"
            rel="stylesheet"
            type="text/css"
          />
          <WhitelistProtection />
          {children}
          <ModalProvider />
          {/* <PepeAd /> */}
          <PremiumAd />
          <LoggerProvider />
        </WrappedWagmi>
      </body>
    </html>
  );
}
