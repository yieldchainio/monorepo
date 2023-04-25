import { YCClassifications } from "../context";

export interface SignupArguments {
  address: string;
  username?: string;
  context?: YCClassifications;
  description?: string;
  profilePicture?: string;
  twitter?: string;
  discord?: string;
  telegram?: string;
}

export type UserUpdateArguments =
  | {
      id: undefined | null;
      address: string;
      username?: string;
      context: YCClassifications;
      description?: string;
      profilePicture?: string;
      twitter?: string | { handle: string; link: string };
      discord?: string | { handle: string; link: string };
      telegram?: string | { handle: string; link: string };
    }
  | {
      id: string;
      address?: string;
      username?: string;
      context?: YCClassifications;
      description?: string;
      profilePicture?: string;
      twitter?: string | { handle: string; link: string };
      discord?: string | { handle: string; link: string };
      telegram?: string | { handle: string; link: string };
    };
