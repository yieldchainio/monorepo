/**
 * A slideshow component, accepts an array of items, allows the user to
 * scroll horizontally (Or vertically in the future?) through the items.
 *
 * Supports infinite scrolling
 *
 *
 * @param items - The items to display.
 * @param exhibitedAmount - The amount of items to display on the display,
 * accepts either a number or an array of @BreakPoints (@uses useMediaBreakpoints under
 * the hood).
 * @generic T - the type of each item (optional)
 */

// Imports
import { BaseComponentProps, BreakPoint } from "components/types";
import React from "react";
import { MediaScreens } from "types/styles/media-breakpoints";

import Slider, { Settings } from "react-slick";

// Interface for the props
interface SlideshowProps<T extends React.ReactNode = React.ReactNode>
  extends BaseComponentProps<SlideshowProps<T>> {
  exhibitedAmount: number | BreakPoint<{ [key in MediaScreens]?: number }>;
  children: NonNullable<T>;
}

// The component itself
export const SlideShow = (sliderProps: Settings) => {
  // Return the JSX component
  return (
    <div className="w-full flex flex-row items-center justify-center ">
      <Slider
        {...sliderProps}
        nextArrow={<NextArrow />}
        prevArrow={<PrevArrow />}
        className="z-1 pl-10 tablet:pl-20 m-0 flex flex-row justify-center items-center w-[75%]  relative ]"
        customPaging={(i) => {
          return (
            <div
              className={
                "w-[20px] h-[6px] bg-custom-textColor transition-all duration-200 ease-in-out mt-8 tablet:hidden  "
              }
            ></div>
          );
        }}
        dotsClass="slick-dots w-[110vw]"
        appendDots={(dots) => {
          return (
            <div className="bg-red-500 p-4 w-full h-full">
              <ul
                className="w-full flex flex-row justify-end  relative pr-0 bg-transparent"
                style={{
                  display: "flex",
                  width: "100%",
                  flexWrap: "wrap",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  left: "-80px",
                }}
              >
                {React.Children.map(dots, (dot) => {
                  if (React.isValidElement(dot)) {
                    return (
                      <dot.type
                        {...dot.props}
                        key={dot.key}
                        className={dot.props.className}
                        children={React.Children.map(
                          dot.props.children,
                          (child) => {
                            return (
                              <child.type
                                {...child.props}
                                className={
                                  child.props.className +
                                  " " +
                                  (dot.props.className.includes("slick-active")
                                    ? ""
                                    : "bg-opacity-50")
                                }
                              ></child.type>
                            );
                          }
                        )}
                      />
                    );
                  }

                  return dot;
                })}
              </ul>
            </div>
          );
        }}
      >
        {sliderProps.children}
      </Slider>
    </div>
  );
};

const NextArrow = (props: any) => {
  const { onClick, className, style } = props;
  return (
    <div
      className={
        "w-[16px] h-[16px] border-custom-textColor rounded-sm border-opacity-100 top-[50%] translate-y-[-50%] left-[100%] border-t-4 border-r-4 rotate-[45deg] hover:scale-[1.05] cursor-pointer transition duration-200 ease-in-out hover:border-opacity-70 active:scale-[0.98] z-1000 absolute "
      }
      onClick={onClick}
    />
  );
};
const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className={
        "w-[16px] h-[16px] border-custom-textColor rounded-sm absolute border-opacity-100 top-[50%] translate-y-[-50%] left-[-2%] border-t-4 border-l-4 rotate-[-45deg] hover:scale-[1.05] cursor-pointer transition duration-200 ease-in-out hover:border-opacity-70 active:scale-[0.98] "
      }
      style={{}}
      onClick={onClick}
    />
  );
};
