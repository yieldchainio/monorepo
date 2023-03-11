import "../css/globals.css";
import { Header } from "../components/header";
import StoreInitiallizor from "utilities/stores/store-initiallizor";

export const metadata = {
  title: "Yieldchain",
  description: "Next-Level DeFi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // First return the data initiallizor, then the entire app
  return (
    <html lang="en" className="dark">
      <body className="bg-custom-bg h-[200vh]">
        <Header />
        {children}
      </body>
    </html>
  );
}
