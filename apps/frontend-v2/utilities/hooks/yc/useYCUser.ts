import { address, Endpoints, YCStrategy, YCUser } from "@yc/yc-models";
import { useYCStore } from "utilities/stores/yc-data";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import Jazzicon from "@raugfer/jazzicon";
import WrappedImage, { ImageProps } from "components/wrappers/image";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export interface YCUserHookReturn {
  address: address | undefined;
  profilePic: string | null;
  userName: string;
  createdVaults: YCStrategy[];
}

/**
 * A hook for accessing a YC User's details
 */
const useYCUser = (): YCUserHookReturn => {
  // Current connected wallet's details
  const { address, connector, status } = useAccount();

  // ENS Name of the user
  const { data: ensName } = useEnsName({ address });

  // ENS Avater of the user
  const { data: ensAvater } = useEnsAvatar({ address });

  // Jazzicon PFP
  const [jazziconPFP, setJazzicon] = useState<string | null>(
    address ? buildDataUrl(address) : null
  );

  const [user, setUser] = useState<YCUser | null>(null);

  // Get the current YC User
  const users: YCUser[] = useYCStore((state) => {
    return state.context.users;
  });

  const refresher = useYCStore((state) => state.refresh);

  useEffect(() => {
    console.log(
      "users rerender!, user's addresses:",
      users.map((user) => user.address),
      "User found:",
      users.find((user) => user.address.toLowerCase() === address),
      "Current Address:",
      address
    );
    let user =
      users.find(
        (user) => user.address.toLowerCase() === address?.toLowerCase()
      ) || null;
    if (!user && address) {
      (async () => {
        console.log("Calling signup with this UUID:", uuidv4());
        // Sign the user up

        await YCUser.signUp({
          address,
        });

        // Refresh the user data
        await refresher(Endpoints.USERS);
      })();
    }
    if (user) setUser(user);
  }, [users]);

  /**
   * @notice
   * useEffect that handles a user that has not yet been registered.
   * If we got an address and the user is nullish (we didnt find any),
   * we sign them up.
   */

  /**
   * User's username
   */
  const [userName, setUsername] = useState<string>(
    user?.username || ensName || "Anon"
  );

  useEffect(() => {
    console.log(
      "Rerendering on user change for username, user's username:",
      user
    );
    setUsername(user?.username || ensName || "Anon");
  }, [user, ensName]);

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

  // Some more details about the user
  const [createdVaults, setCreatedVaults] = useState<YCStrategy[]>([]);

  useEffect(() => {
    if (user) setCreatedVaults(user.createdVaults);
  }, [user]);

  return { address, profilePic, userName, createdVaults };
};

export default useYCUser;

/**
 * Generate Jazzicon image
 */

// builds an image data url for embedding
function buildDataUrl(address: string): string {
  return "data:image/svg+xml;base64," + btoa(Jazzicon(address));
}
