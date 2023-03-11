import { useEffect, useState } from "react";

enum Direction {
  UP,
  DOWN,
}
export const useHideScroll = (): boolean => {
  const [prevScroll, setPrevScroll] = useState<number>(0);
  const [show, setShow] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      const currScroll = window.scrollY;
      console.log(currScroll, prevScroll);
      setPrevScroll(window.scrollY);

      if (currScroll > prevScroll + 30) {
        setShow(false);
      } else if (currScroll < prevScroll - 30) setShow(true);
    };
    window.addEventListener("scroll", handleScroll);
  }, []);

  return show;
};
