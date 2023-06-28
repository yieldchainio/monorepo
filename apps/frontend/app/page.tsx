"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MainPage = () => {
  const router = useRouter();
  useEffect(() => {
    console.log("RUNNING DIS SHIT");
    router.replace("/whitelist");
  }, []);
  return <div></div>;
};

export default MainPage;
