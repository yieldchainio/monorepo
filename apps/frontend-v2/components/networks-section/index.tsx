import { Chip } from "components/chip";
import { useYCStore } from "utilities/stores/yc-data";

export {};

/**
 * A component for a section of networks/chains chips to use with filtering
 */

export const NetworksChipsSection = () => {
  // The networks state
  const networks = useYCStore((state) => state.context.YCnetworks);

  // return the chips
  return (
    <div className="w-[100%] flex flex-row items-center justify-center gap-3">
      {networks.map((network) => (
        <Chip image={network.logo} text={network.name} color={network.color} />
      ))}
    </div>
  );
};
