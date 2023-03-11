import { ClassificationContext } from "@yc/yc-models";
import { DataVersions, fetchYC } from "utilities/storage/yc-data";
import StoreInitiallizor, {
  StoreInitiallizorProps,
} from "utilities/stores/store-initiallizor";

export default async function Home() {
  // Fetch the initial data
  const data: ClassificationContext = await fetchYC(DataVersions.V1);

  return (
    <main className="">
      <StoreInitiallizor context={data} />
    </main>
  );
}
