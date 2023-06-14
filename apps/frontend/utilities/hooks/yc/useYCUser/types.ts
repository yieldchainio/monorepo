import {
  DBUser,
  UserUpdateArguments,
  YCSocialMedia,
  YCStrategy,
  address,
} from "@yc/yc-models";

// Interface for return value of the YCUser hook
export interface YCUserHookReturn {
  address: address | undefined;
  profilePic: string | null;
  userName: string;
  createdVaults: YCStrategy[];
  updateDetails: (
    newDetails: Partial<UserUpdateArguments>
  ) => Promise<DBUser | null>;
  socialMedia: YCSocialMedia;
  verified: boolean;
  description: string | undefined;
  id?: string;
  whitelisted: boolean;
  connected: boolean
}

// Interface for the useYCUser's props
export interface UseYCUserProps {
  userAddress?: address;
}
