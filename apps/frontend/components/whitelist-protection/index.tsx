"use client";
/**
 * Protects non-whitelisted users from accessing
 */

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import useYCUser from "utilities/hooks/yc/useYCUser";

export function WhitelistProtection() {
  const { address, whitelisted } = useYCUser();

  const router = useRouter();

  const path = usePathname();

  useEffect(() => {
    setTimeout(() => {
      if (!whitelisted && !path.includes("/whitelist")) {
        router.replace(`/whitelist?callback=${path}`);
      }
    }, 2000);
  }, [path]);

  return null;
}
