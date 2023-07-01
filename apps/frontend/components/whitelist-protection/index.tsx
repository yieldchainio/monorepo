"use client";
/**
 * Protects non-whitelisted users from accessing
 */

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function WhitelistProtection() {
  const router = useRouter();

  const path = usePathname();

  useEffect(() => {
    const sig = localStorage.getItem("ETH_AUTH_SIG");
    if (!sig && !path.includes("/whitelist"))
      router.replace(`/whitelist?callback=${path}`);
  }, [path]);

  return null;
}
