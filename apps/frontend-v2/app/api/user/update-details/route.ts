import {
  YCUser,
  UserUpdateArguments,
  YCClassifications,
  Endpoints,
  DBUser,
} from "@yc/yc-models";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  // Get the body
  const body: UserUpdateArguments = await request.json();
  console.log("Details received:", body);

  // Return null if it's falsy
  if (!body) return null;

  let user: DBUser | null = null;
  try {
    // Update the user's details
    user = await YCUser.updateDetails(body);
  } catch (e: any) {
    const err = e as Error;
    console.error(
      "Error Updating User's Details - Message:",
      err.cause,
      err.message
    );
  }

  // Refresh the user's endpoints for sufficient up-to-date context for all
  // consumers of the class
  console.log("UPdating user...");
  await new YCClassifications().refresh(Endpoints.USERS);

  // Return the user
  return user;
};
