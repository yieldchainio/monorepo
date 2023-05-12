/**
 * A hook specifying whether the component mounted yet or not
 */
"use client"
import { useEffect, useState } from "react";

export const useIsMounted = () => {
  // State tracking mounting status
  const [mounted, setIsMounted] = useState<boolean>();

  // useEffect runs once component mounts - we set the state then
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Return the state
  return mounted;
};
