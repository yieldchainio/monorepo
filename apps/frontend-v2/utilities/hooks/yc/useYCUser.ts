import {
  address,
  DBUser,
  Endpoints,
  YCClassifications,
  YCStrategy,
  YCUser,
} from "@yc/yc-models";
import { useYCStore } from "utilities/stores/yc-data";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import Jazzicon from "@raugfer/jazzicon";
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
  const { data: ensName } = useEnsName({ address, chainId: 1 });

  // ENS Avater of the user
  const { data: ensAvatar } = useEnsAvatar({ address, chainId: 1 });

  // The YCUser instnace
  const [user, setUser] = useState<YCUser | null>(null);

  // Jazzicon PFP
  const [jazziconPFP, setJazzicon] = useState<string | null>(
    address ? buildDataUrl(address) : null
  );

  /**
   * User's username
   */
  const [userName, setUsername] = useState<string>(
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
      (ensAvatar ? ensAvatar : address ? buildDataUrl(address) : null)
  );

  // Get the current YC User
  const users: YCUser[] = useYCStore((state) => {
    return state.context.YCusers;
  });

  // Refresher function for the context
  const refresher = useYCStore((state) => state.refresh);

  /**
   * useEffect running every time the @users update, in an attempt to update our @user,
   * and optionally sign them up if they are new
   */
  useEffect(() => {
    // We attempt to find the user in the users array
    console.log("All Users ser", users);
    if (!users.length)
      (async () => {
        await refresher(Endpoints.USERS);
      })();
    let _user =
      users.find(
        (user) => user.address.toLowerCase() === address?.toLowerCase()
      ) || null;

    let dbUser: DBUser | null = null;

    // If the user was not found (and the address exists)
    if (!_user && address) {
      // We call an async function to sign them up
      (async () => {
        console.log("Calling signup with this UUID:", uuidv4());
        // Sign the user up using their address
        // dbUser = await YCUser.signUp({
        //   address,
        // });
      })();
    }

    // If user exists, set the user
    if (_user) setUser(_user);
    // Else if DBUser exists (we got it from signing up)
    else if (dbUser) {
      // Set the user to a new YCUser instantiated with that dbUser
      setUser(new YCUser(dbUser, YCClassifications.getInstance()));

      // Refresh the context
      (async () => {
        await refresher(Endpoints.USERS);
      })();
    }

    // Cleanup
    return () => {
      setUser(null);
    };
  }, [users]);

  /**
   * useEffect for handling an address change (i.e new user)
   */

  useEffect(() => {
    if (user?.address !== address) {
      // Find an existing user in our users array
      // @notice if user was just registered, we wont find it and the signup useEffect will handle this update instead
      const _user = users.find(
        (user_) => user_.address.toLowerCase() === address?.toLowerCase()
      );

      // Set the new user
      if (_user) setUser(_user);
    }
  }, [address]);

  // Some more details about the user
  const [createdVaults, setCreatedVaults] = useState<YCStrategy[]>([]);

  /**
   * useEffect(s) responsible for running each time the user or one of the details change,
   * in order to potentially change some of our states
   */

  // useEffect for the username
  useEffect(() => {
    // Set the username with the usual priority
    setUsername(
      user?.username && user.username !== "Anon"
        ? user?.username
        : ensName || "Anon"
    );
  }, [user?.username, ensName]);

  // useEffect for the profile pic
  useEffect(() => {
    // Set the profile picture with the usual priority
    setProfilePic(ensAvatar || jazziconPFP);
  }, [user?.profilePic, ensAvatar, jazziconPFP]);

  // Jazzicon useEffect (listens to address)
  useEffect(() => {
    if (address) setJazzicon(buildDataUrl(address));
  }, [address]);

  // useEffect for the created vaults
  useEffect(() => {
    if (user) setCreatedVaults(user.createdVaults);
  }, [user?.createdVaults]);

  // Return our states
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
