import {
  address,
  DBUser,
  Endpoints,
  UserUpdateArguments,
  YCClassifications,
  YCStrategy,
  YCUser,
} from "@yc/yc-models";
import { useYCStore } from "utilities/stores/yc-data";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import Jazzicon from "@raugfer/jazzicon";
import { useEffect, useState } from "react";
import { useInternalYCUser } from "utilities/stores/yc-data";
import { shallow } from "zustand/shallow";
export interface YCUserHookReturn {
  address: address | undefined;
  profilePic: string | null;
  userName: string;
  createdVaults: YCStrategy[];
  updateDetails: (
    newDetails: Partial<UserUpdateArguments>
  ) => Promise<DBUser | null>;
}

/**
 * A hook for accessing a YC User's details
 */
const useYCUser = (): YCUserHookReturn => {
  // Current connected wallet's details
  const { address, connector, status } = useAccount();

  const [causeRerender, setCauseRerender] = useState<boolean>(false);

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

  // Function to update user's details
  const updateDetails = async (newDetails: Partial<UserUpdateArguments>) => {
    if (!user) return null;
    // We call the update details function, spread out the new details
    // and make sure we input the current user's ID
    const res = await YCUser.updateDetails({ ...newDetails, id: user.id });

    if (res) await refresher(Endpoints.USERS);
    return res;
  };

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
  const users: YCUser[] = useYCStore(
    (state) => {
      return state.context.YCusers;
    },
    (oldUsers, newUsers) => {
      const eq =
        JSON.stringify(oldUsers.map((usr) => usr.toString())) ===
        JSON.stringify(newUsers.map((usr) => usr.toString()));
      return eq;
    }
  );

  // Refresher function for the context
  const refresher = useYCStore((state) => state.refresh);

  // useEffect for refreshing
  useEffect(() => {
    if (!users.length) {
      (async () => {
        await refresher(Endpoints.USERS);
      })();
    }
  }, [JSON.stringify(users.map((usr) => usr.toString()))]);

  /**
   * useEffect running every time the @users update, in an attempt to update our @user,
   * and optionally sign them up if they are new
   */

  // A small state to lock the signup process, to avoid multiple parallel processes
  const isSigningUp = useInternalYCUser((state) => state.isSigningUp);
  const setIsSigningUp = useInternalYCUser((state) => state.setIsSigningUp);

  useEffect(() => {
    // We attempt to find the user in the users array, we sign them up if they do not exist.
    // Note that we also require the array to be populated with users already, to avoid signing up the user
    // when the array was not yet initiated.
    if (
      address &&
      !users.find(
        (_user) => _user.address.toLowerCase() === address?.toLowerCase()
      ) &&
      users.length > 0 &&
      user?.address.toLowerCase() !== address?.toLowerCase() &&
      !isSigningUp
    ) {
      // We set the globally-stored "isSigningUp" variable to true, to avoid parallel execution of the signup
      setIsSigningUp(true);

      // An async function for signing the user up
      (async () => {
        const newUser = await signUserUp(
          {
            address,
            username: ensName || undefined,
          },
          YCClassifications.getInstance()
        );

        if (newUser) setUser(newUser);
        await refresher(Endpoints.USERS);
      })();

      setIsSigningUp(false);
    }

    // Cleanup
    return () => {
      setUser(null);
    };
  }, [address, JSON.stringify(users.map((usr) => usr.toString()))]);

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

  /**
   * useEffect handling users refresh (potential user details update)
   */
  useEffect(() => {
    const currUser = users.find((usr) => usr.id === user?.id);

    if (currUser && currUser.toString() !== user?.toString()) {
      setUser(currUser);
    }
  }, [JSON.stringify(users.map((usr) => usr.toString()))]);

  // Some more details about the user
  const [createdVaults, setCreatedVaults] = useState<YCStrategy[]>([]);

  /**
   * useEffect(s) responsible for running each time the user or one of the details change,
   * in order to potentially change some of our states
   */

  // useEffect for the username
  useEffect(() => {
    setUsername(user?.username || ensName || "Anon");
  }, [user?.toString(), ensName, address]);

  // useEffect for the profile pic
  useEffect(() => {
    setProfilePic(ensAvatar || jazziconPFP);
  }, [user?.toString(), ensAvatar, jazziconPFP]);

  // Jazzicon useEffect (listens to address)
  useEffect(() => {
    if (address) setJazzicon(buildDataUrl(address));
  }, [address]);

  // useEffect for the created vaults
  useEffect(() => {
    if (user) setCreatedVaults(user.createdVaults);
  }, [user?.createdVaults.length]);

  // Return our states
  return { address, profilePic, userName, createdVaults, updateDetails };
};

export default useYCUser;

/**
 * Generate Jazzicon image
 */

// builds an image data url for embedding
function buildDataUrl(_address: string): string {
  return "data:image/svg+xml;base64," + btoa(Jazzicon(_address));
}

/**
 * Utility function to sign the user up
 */

const signUserUp = async (
  _props: SignupProps,
  _context: YCClassifications
): Promise<YCUser | null> => {
  // Attempt to sign the user up
  const user = await YCUser.signUp(_props);

  // If the user is null, return null.
  if (!user) return null;

  // Else, create a new instance of the YCUser and return it
  return new YCUser(user, _context);
};

interface SignupProps {
  address: address;
  username?: string;
}

const stringifyCircularJSON = (obj: any) => {
  // start with an empty object (see other alternatives below)
  const jsonObj: any = {};

  // add all properties
  const proto = Object.getPrototypeOf(obj);
  for (const key of Object.getOwnPropertyNames(proto)) {
    const desc = Object.getOwnPropertyDescriptor(proto, key);
    const hasGetter = desc && typeof desc.get === "function";
    if (hasGetter) {
      jsonObj[key] = desc?.get?.();
    }
  }

  return jsonObj;
};
