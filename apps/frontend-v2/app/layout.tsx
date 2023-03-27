import "../css/globals.css";
import { Header } from "../components/header";
import { ClassificationContext } from "@yc/yc-models";
import { DataVersions, fetchYC } from "utilities/general/storage/fetch-yc";
import StoreInitiallizor from "utilities/hooks/stores/store-initiallizor";
import WrappedWagmi from "configs/wagmi";
import { ModalProvider } from "components/modal-provider";
import { ShallowRouter } from "components/internal/shallow-router";

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
  const data: ClassificationContext = await fetchYC(DataVersions.V1);

  return (
    <html lang="en" className="dark">
      <head></head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <StoreInitiallizor context={data} />
      <ShallowRouter />
      <WrappedWagmi>
        <ModalProvider />
        {/* <div className="w-[100vw] h-[100vh] bg-white/80 fixed z-10000000000000"></div> */}

        <body className="h-max z-100 bg-custom-bg">
          {children}
          <Header />
        </body>
      </WrappedWagmi>
    </html>
  );
}
