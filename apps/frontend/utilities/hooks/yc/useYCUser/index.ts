import {
  address,
  DBUser,
  Endpoints,
  UserUpdateArguments,
  YCClassifications,
  YCSocialMedia,
  YCStrategy,
  YCUser,
} from "@yc/yc-models";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import { useAccount, useEnsAvatar, useEnsName, useNetwork } from "wagmi";
import Jazzicon from "@raugfer/jazzicon";
import { useEffect, useState } from "react";
import { useInternalYCUser } from "utilities/hooks/stores/yc-data";
import { useIsMounted } from "../../general/useIsMounted";
import { UseYCUserProps, YCUserHookReturn } from "./types";
export * from "./types";

/**
 * A hook for accessing a YC User's details
 */
function useYCUser(props?: UseYCUserProps): YCUserHookReturn {
  // Current connected wallet's details
  const { address, isConnected } = useAccount();

  useNetwork()

  // The global address variable that will be used
  const [userAddress, setUserAddress] = useState<`0x${string}` | undefined>(
    address
  );

  // useEffect for setting the global address variable
  useEffect(() => {
    if (props?.userAddress) {
      setUserAddress(props?.userAddress);
    } else if (props?.userAddress === null) {
      setUserAddress(undefined);
    } else if (address) {
      setUserAddress(address);
    }
  }, [address, props?.userAddress]);

  // ENS Name of the user
  const { data: ensName } = useEnsName({ address: userAddress, chainId: 1 });

  // ENS Avater of the user
  const { data: ensAvatar } = useEnsAvatar({
    chainId: 1,
  });

  // The YCUser instnace
  const [user, setUser] = useState<YCUser | null>(null);

  // Jazzicon PFP
  const [jazziconPFP, setJazzicon] = useState<string | null>(
    userAddress ? buildDataUrl(userAddress) : null
  );

  // User's description
  const [description, setDescription] = useState<string | undefined>(
    user?.description
  );

  // User's social media
  const [socialMedia, setSocialMedia] = useState<YCSocialMedia>(
    user?.socialMedia || new YCSocialMedia()
  );

  // Whether the user is verified or not
  const [verified, setVerified] = useState<boolean>(false);

  const [whitelisted, setWhitelisted] = useState<boolean>(false);

  // Function to update user's details
  const updateDetails = async (newDetails: Partial<UserUpdateArguments>) => {
    if (!user) {
      return null;
    }

    // We call the update details function, spread out the new details
    // and make sure we input the current user's ID
    const res = await YCUser.updateDetails({ ...newDetails, id: user.id });

    if (res) {
      await refresher(Endpoints.USERS);
      setUser(new YCUser(res, YCClassifications.getInstance()));
    }

    for (const [key, val] of Object.entries(newDetails)) {
      // @ts-ignore
      user[key] = val;
    }
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
      (ensAvatar ? ensAvatar : userAddress ? buildDataUrl(userAddress) : null)
  );

  // Get the current YC User
  const users: YCUser[] = useYCStore(
    (state) => {
      return state.context.YCusers;
    },
    (oldUsers, newUsers) => {
      const res =
        JSON.stringify(oldUsers.map((usr) => usr.stringify())) ===
        JSON.stringify(newUsers.map((usr) => usr.stringify()));
      return res;
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
  }, [JSON.stringify(users.map((usr) => usr.stringify()))]);

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
      userAddress &&
      !users.find(
        (_user) => _user.address.toLowerCase() === userAddress?.toLowerCase()
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
            address: userAddress,
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
  }, [userAddress, JSON.stringify(users.map((usr) => usr.stringify()))]);

  /**
   * useEffect for handling an address change (i.e new user)
   */
  useEffect(() => {
    if (user?.address !== userAddress) {
      // Find an existing user in our users array
      // @notice if user was just registered, we wont find it and the signup useEffect will handle this update instead
      const _user = users.find(
        (user_) => user_.address.toLowerCase() === userAddress?.toLowerCase()
      );

      // Set the new user
      if (_user) setUser(_user);
    }

    // Cleanup
    return () => setUser(null);
  }, [userAddress, JSON.stringify(users.map((usr) => usr.stringify()))]);

  /**
   * useEffect handling users refresh (potential user details update)
   */
  useEffect(() => {
    // Find the current user in the array
    const currUser = users.find((usr) => usr.id === user?.id);

    // If we found it and it does not equal to the current user - we set the state
    if (currUser && currUser.stringify() !== user?.stringify()) {
      setUser(currUser);
    }

    // Cleanup
    return () => setUser(null);
  }, [JSON.stringify(users.map((usr) => usr.stringify()))]);

  // Some more details about the user
  const [createdVaults, setCreatedVaults] = useState<YCStrategy[]>([]);

  /**
   * useEffect(s) responsible for running each time the user or one of the details change,
   * in order to potentially change some of our states
   */

  // useEffect for the username
  useEffect(() => {
    setUsername(user?.username || ensName || "Anon");
    // Cleanup
    return () => setUsername("Anon");
  }, [user?.username, ensName, userAddress]);

  // useEffect for the profile pic
  useEffect(() => {
    // Set the profile pic based on this priority
    setProfilePic(user?.profilePic || ensAvatar || jazziconPFP);

    // Cleanup
    return () => setProfilePic(null);
  }, [user?.profilePic, ensAvatar, jazziconPFP]);

  // Jazzicon useEffect (listens to address)
  useEffect(() => {
    if (userAddress) setJazzicon(buildDataUrl(userAddress));

    // Cleanup
    return () => setJazzicon(null);
  }, [userAddress]);

  // useEffect for the created vaults
  useEffect(() => {
    if (user) setCreatedVaults(user.createdVaults);

    // Cleanup
    return () => setCreatedVaults([]);
  }, [user?.createdVaults.length]);

  // useEffect for user's social media
  useEffect(() => {
    if (user?.socialMedia) setSocialMedia(user?.socialMedia);

    // Cleanup
    return () => setSocialMedia(new YCSocialMedia());
  }, [
    user?.socialMedia.twitter.handle,
    user?.socialMedia.telegram.handle,
    user?.socialMedia.discord.handle,
  ]);

  // useEffect for user's description
  useEffect(() => {
    if (user?.description) setDescription(user?.description);

    // Cleanup
    return () => setDescription(undefined);
  }, [user?.description]);

  // useEffect for whether the user is verified or not
  useEffect(() => {
    if (user?.verified) setVerified(true);

    // Cleanup
    return () => setVerified(false);
  }, [user?.verified]);

  useEffect(() => {
    setWhitelisted(user?.whitelisted || false);
  }, [user?.whitelisted]);

  // Final useEffect checking if we're mounted to avoid hydration
  const mounted = useIsMounted();

  // Return our states
  if (mounted)
    return {
      address: userAddress,
      profilePic,
      userName,
      createdVaults,
      updateDetails,
      socialMedia,
      verified,
      description,
      id: user?.id,
      whitelisted,
      connected: isConnected,
    };

  return {
    address: "0x0",
    profilePic: "",
    userName: "Anon",
    createdVaults: [],
    updateDetails: updateDetails,
    socialMedia: socialMedia,
    verified: false,
    description: undefined,
    id: undefined,
    whitelisted,
    connected: isConnected,
  };
}

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
