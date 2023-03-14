import { address, YCUser } from "@yc/yc-models";
import { useYCStore } from "utilities/stores/yc-data";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import Jazzicon from "@raugfer/jazzicon";
import WrappedImage, { ImageProps } from "components/wrappers/image";
import { useEffect, useState } from "react";

export interface YCUserHookReturn {
  address: address | undefined;
  profilePic: string | null;
  userName: string;
}

/**
 * A hook for accessing a YC User's details
 */
const useYCUser = (): YCUserHookReturn => {
  // Current connected wallet's details
  const { address, connector, status } = useAccount();

  /**
   * Retreive additional onchain details
   */
  // ENS Name of the user
  const { data: ensName } = useEnsName({ address });

  // ENS Avater of the user
  const { data: ensAvater } = useEnsAvatar({ address });

  // Jazzicon PFP
  const [jazziconPFP, setJazzicon] = useState<string | null>(
    address ? buildDataUrl(address) : null
  );

  // Get the current YC User
  const user: YCUser | null = useYCStore((state) => {
    return (
      state.context.users.find(
        (user: YCUser) => user.address.toLowerCase() == address?.toLowerCase()
      ) || null
    );
  });

  /**
   * @notice
   * useEffect that handles a user that has not yet been registered.
   * If we got an address and the user is nullish (we didnt find any),
   * we sign them up.
   */
  useEffect(() => {
    if (user === null) {
        YCUser.signUp()
    }
  }, [user]);

  console.log("user ser", user);

  /**
   * User's username
   */
  const [userName, seUsername] = useState<string>(
    user?.username || ensName || "Anon"
  );

  /**
   * profile pic of the user,
   * return priorities:
   *
   * 1) User's profile pic from the database
   * 2) User's ENS avater
   * 3) User's MM Jazzicon
   */
  const [profilePic, setProfilePic] = useState<string | null>(
    user?.profilePic ||
      (ensAvater ? ensAvater : address ? buildDataUrl(address) : null)
  );

  // useEffect to update it
  useEffect(() => {
    if (user?.profilePic) setProfilePic(user?.profilePic);
    else if (ensAvater) setProfilePic(ensAvater);
    else if (jazziconPFP) setProfilePic(jazziconPFP);
  }, [user?.profilePic, ensAvater, jazziconPFP]);

  return { address, profilePic, userName };
};

export default useYCUser;

/**
 * Generate Jazzicon image
 */

// builds an image data url for embedding
function buildDataUrl(address: string): string {
  return "data:image/svg+xml;base64," + btoa(Jazzicon(address));
}
