"use client";
/**
 * @notice
 * A Loading Bar component, is displayed on the top of the screen to display progress
 * when going between routes.
 *
 * @param desiredPath - the desired page you want to reach
 */

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// The props interface
interface LoadingBarProps {
  desiredPath: string;
}

const LoadingBar = () => {
  // Keep track of the progress
  const [progress, setProgress] = useState<number>(0);

  /**
   * @notice
   * Keep track of the pathname,
   * if the pathname changes to the desired path, the progress becomes 100%
   */
  const pathname = usePathname();

  const increment = (_progress: number): any => {
    if (_progress >= 100) {
      return;
    } else {
      const newProgress = _progress == 0 ? 20 : _progress + 5;
      setProgress(newProgress);
      return setTimeout(() => increment(newProgress), 10);
    }
  };
  // Run a useEffect that increments the loading bar by a little each time,
  // though by a large margin at first to give a snappy feel
  useEffect(() => {
    increment(0);
    return () => {
      setProgress(100);
      //   setTimeout(() => {
      //     setProgress(0);
      //   }, 2000);
    };
  }, []);

  // if the current path is our desired path, we set the progress to 100
  //   useEffect(() => {
  //     if (pathname == desiredPath) setProgress(100);
  //   }, [pathname]);

  // Return the loading bar
  return (
    <motion.div
      className={`h-[3px] ${
        "w-[" + `${progress}` + "vw]"
      } fixed top-[-0.5px] left-0`}
      style={{
        background: "var(--gradient)",
        filter: "drop-shadow(4px, 4px, 4px, 4px)",
      }}
      layout
    ></motion.div>
  );
};

export default LoadingBar;
