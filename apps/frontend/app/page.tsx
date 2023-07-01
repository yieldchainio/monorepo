"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MainPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/whitelist");
  }, []);
  return <div></div>;
};

export default MainPage;
