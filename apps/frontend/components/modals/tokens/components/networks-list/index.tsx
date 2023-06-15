import { YCNetwork } from "@yc/yc-models";
import WrappedImage from "components/wrappers/image";
import WrappedText from "components/wrappers/text";
import { useMemo, useState } from "react";
import { useYCStore } from "utilities/hooks/stores/yc-data";

/**
 * The component rendering all of the network cards
 */
export const NetworksList = ({
  networks,
  handler,
  chosenNetwork,
}: {
  networks: YCNetwork[];
  handler: (networkID: YCNetwork) => void;
  chosenNetwork: YCNetwork;
}) => {
  // Memoizing the networks to not rerender each time
  const memoizedNetworks = useMemo(() => {
    return networks;
  }, [networks, networks.length]);

  // State keeping track of chosen networks
  // @notice for some reason if i used the drilled state it was slow AF. So using this for styling.
  const [networkChosen, setNetworkChosen] = useState(networks[0].id);
  return (
    <div className="flex flex-col items-center gap-2 w-full overflow-scroll scrollbar-hide bg-inherit">
      {memoizedNetworks.map((network, i) => (
        <div
          key={i}
          className={
            "w-full tablet:w-max p-[1px] rounded-xl transition duration-500 ease-in-out   " +
            " " +
            (networkChosen == network.id
              ? "bg-gradient-to-r from-custom-ycllb to-custom-ycly "
              : "bg-inherit hover:bg-custom-themedBorder hover:scale-[0.99]")
          }
          onClick={() => {
            setNetworkChosen(network.id);
            handler(network);
          }}
        >
          <div className="flex flex-row tablet:flex-col items-center justify-start w-full tablet:w-max py-4 px-4 tablet:py-2 tablet:px-2 rounded-xl gap-2  cursor-pointer bg-custom-darkSubbg transition duration-200 ease-in-out ">
            <WrappedImage
              src={network.logo}
              width={34}
              height={34}
              className="rounded-full tablet:scale-[0.85]"
            />
            <WrappedText
              fontSize={16}
              className={
                networkChosen == network.id ? "tablet:hidden " : "tablet:hidden"
              }
            >
              {network.name}
            </WrappedText>
          </div>
        </div>
      ))}
    </div>
  );
};
