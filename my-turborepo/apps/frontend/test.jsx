import { useRef, useEffect } from "react";
import {
  useAnimation,
  motion,
  useScroll,
  useTransform,
  useMotionValue,
} from "framer-motion";

export const MyComponent = () => {
  const scrollY = useScroll().scrollY;
  const windowSize = useWindowSize();
  const scrollYState = useTransform(
    scrollY,
    [0, windowSize.height * 3],
    [0, 1]
  );

  const gasCardRef = useRef(null);
  const greenWojaksRef = useRef(null);
  const redWojaksRef = useRef(null);

  const left = useMotionValue(scrollYState <= 1 ? "60vw" : "81vw");
  const top = useMotionValue(
    scrollYState <= 1
      ? `${
          windowSize.height -
          (greenWojaksRef.current
            ? greenWojaksRef.current.getBoundingClientRect().height
            : 3000)
        }px`
      : `${
          gasCardRef.current.getBoundingClientRect().bottom -
          greenWojaksRef.current.getBoundingClientRect().height -
          5
        }px`
  );
  const height = useMotionValue(scrollYState <= 1 ? "338px" : "80px");
  useEffect(() => {
    if (scrollYState <= 1) {
      // Animate to the right
      left.set("100vw");
      // Wait for the animation to complete
      setTimeout(() => {
        // Animate to the top
        top.set(
          `${
            windowSize.height -
            (greenWojaksRef.current
              ? greenWojaksRef.current.getBoundingClientRect().height
              : 3000)
          }px`
        );
        // Wait for the animation to complete
        setTimeout(() => {
          // Animate back to the left
          left.set("60vw");
        }, 200);
      }, 200);
    } else {
      // Animate to the right
      left.set("100vw");
      // Wait for the animation to complete
      setTimeout(() => {
        // Animate to the bottom
        top.set(
          `${
            gasCardRef.current.getBoundingClientRect().bottom -
            greenWojaksRef.current.getBoundingClientRect().height -
            5
          }px`
        );
        // Wait for the animation to complete
        setTimeout(() => {
          // Animate back to the left
          left.set("81vw");
        }, 200);
      }, 200);
    }
  }, [scrollYState]);

  return (
    <div className={styles.gasPage} ref={cardsPageRef}>
      <div
        style={{
          width: "100vw",
          position: "absolute",
          height: "300vh",
          zIndex: "10000000",
          scrollSnapType: "y mandatory",
        }}
      >
        <div
          style={{
            height: "100vh",
            width: "100vw",
            position: "absolute",
            scrollSnapAlign: "start",
          }}
        ></div>
        <div
          style={{
            height: "100vh",
            width: "100vw",
            position: "absolute",
            top: "200vh",
            scrollSnapAlign: "start",
          }}
        ></div>
        <div
          style={{
            height: "100vh",
            width: "100vw",
            position: "absolute",
            top: "100vh",
            scrollSnapAlign: "start",
          }}
        ></div>
      </div>
      <div
        style={{
          willChange: "position",
          position: scrollYState <= 1 ? "absolute" : "fixed",
          top: scrollYState <= 1 ? "0vh" : "0vh",
        }}
      >
        <motion.div
          className={styles.gasPageRedBlur}
          style={{
            willChange: "background-color",
            backgroundColor:
              scrollYState <= 1
                ? "rgb(255, 4, 4)"
                : "rgba(136, 124, 201, 0.634)",
          }}
          layout
          transition={{
            duration: 1,
            delay: 0.25,
          }}
        ></motion.div>
        <motion.div
          className={styles.gasPageGreenBlur}
          style={{
            willChange: "background-color",
            backgroundColor:
              scrollYState <= 1 ? "rgb(160, 196, 74)" : "rgb(4, 240, 255)",
          }}
          layout
          transition={{
            duration: 1,
            delay: 0.25,
          }}
        ></motion.div>
        <motion.div
          ref={gasCardRef}
          className={styles.gasGlassContainer}
          style={{
            willChange: "width, height, left, top",
            left,
            top,
            height,
          }}
          layout
          transition={{
            duration: 1,
            delay: 0.25,
          }}
        >
          <motion.div
            className={styles.moreFrensLessGasText}
            style={{
              willChange: "font-size",
            }}
            layout
            transition={{
              duration: 1,
              delay: 0.25,
            }}
          >
            More Frens = Less Gas
          </motion.div>
          <motion.div
            className={styles.gasDescription}
            style={{
              willChange: "font-size",
            }}
            layout
            transition={{
              duration: 1,
              delay,
            }}
          >
            bundle up with anons to save on gas fees ⛽{" "}
          </motion.div>
        </motion.div>
        <motion.div
          className={styles.greenWojaksContainer}
          ref={greenWojaksRef}
          style={{
            willChange: "width, height, left, top",
          }}
          layout
          transition={{
            duration: 1,
            delay: 0.25,
          }}
        >
          <img
            className={styles.greenWojak}
            src={greenWojak}
            alt="green wojak"
          />
        </motion.div>
        <motion.div
          className={styles.redWojaksContainer}
          ref={redWojaksRef}
          style={{
            willChange: "width, height, left, top",
          }}
          layout
          transition={{
            duration: 1,
            delay: 0.25,
          }}
        >
          <img className={styles.redWojak} src={redWojak} alt="red wojak" />
        </motion.div>
      </div>
    </div>
  );
};
