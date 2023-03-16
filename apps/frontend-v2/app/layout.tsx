import "../css/globals.css";
import { Header } from "../components/header";
import { ClassificationContext } from "@yc/yc-models";
import { DataVersions, fetchYC } from "utilities/storage/fetch-yc";
import StoreInitiallizor from "utilities/stores/store-initiallizor";
import WrappedWagmi from "configs/wagmi";

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
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <StoreInitiallizor context={data} />
      <body className="bg-custom-bg h-[200vh] z-100">
        <WrappedWagmi>
          {children}
          <Header />
        </WrappedWagmi>
      </body>
    </html>
  );
}
