"use client";
import { UpgradeTierModal } from "components/modals/upgrade";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useModals } from "utilities/hooks/stores/modal";

const MainPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/whitelist");
  }, []);
  return <div></div>;
};

export default MainPage;
