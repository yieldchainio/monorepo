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
        content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no"
      />
      <StoreInitiallizor context={data} />
      <body className="h-max z-100 bg-custom-bg">
        <WrappedWagmi>
          <ShallowRouter />
          <WhitelistProtection />
          {children}
          <Header />
          <ModalProvider />
          <LoggerProvider />
        </WrappedWagmi>
      </body>
    </html>
  );
}