"use client";
/**
 * Protects non-whitelisted users from accessing
 */

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useYCUser from "utilities/hooks/yc/useYCUser";

export function WhitelistProtection() {
  const { address, whitelisted } = useYCUser();

  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      if (!whitelisted) router.replace("/whitelist");
    }, 2000);
  }, []);

  return null;
}
