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
import React, { ReactElement, useEffect, useState } from "react";
import { MediaScreens } from "types/styles/media-breakpoints";

import Slider, { Settings } from "react-slick";

// Interface for the props
export interface SlideshowProps<T extends React.ReactNode = React.ReactNode>
  extends BaseComponentProps<SlideshowProps<T>> {
  exhibitedAmount: number | BreakPoint<{ [key in MediaScreens]?: number }>;
  children: NonNullable<T>;
}

// The component itself
export const SlideShow = <T extends React.ReactNode>(sliderProps: Settings) => {
  // Keeping track of the current slide for custom paging
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Return the JSX component
  return (
    <div className="w-full bg-transparent">
      <div>
        <Slider
          {...sliderProps}
          nextArrow={<NextArrow />}
          prevArrow={<PrevArrow />}
          className="z-1 pl-10 pr-10"
          customPaging={function (i) {
            console.log("PAge", i, "Curr slide", currentSlide);
            return (
              <div
                className={
                  "w-[20px] h-[6px] mt-10 bg-custom-textColor transition-all duration-200 ease-in-out "
                }
              ></div>
            );
          }}
          afterChange={(next: number) => {
            console.log(
              "Next",
              next,
              "Slides to show",
              sliderProps.slidesToShow,
              "Equals",
              next / (sliderProps.slidesToShow || 4)
            );
            setCurrentSlide(next / (sliderProps.slidesToShow || 4));
          }}
          onLazyLoad={(slidesTLoad: number[]) =>
            console.log("Slides to load:", slidesTLoad)
          }
          lazyLoad="ondemand"
          appendDots={(dots) => {
            return (
              <ul className="flex flex-row justify-start bg-red-500">
                {React.Children.map(dots, (dot) => {
                  if (React.isValidElement(dot)) {
                    return (
                      <dot.type
                        {...dot.props}
                        key={dot.key}
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
            );
          }}
        >
          {sliderProps.children}
        </Slider>
      </div>
    </div>
  );
};

const NextArrow = (props: any) => {
  console.log(
    "Current Slide In Arrow:",
    props.currentSlide,
    "Slide Count",
    props.slideCount
  );

  useEffect(() => {
    // props.setCurrentSlide(props.currentSlide);
  }, [props.currentSlide]);

  const { onClick } = props;
  return (
    <div
      className={
        "w-[16px] h-[16px] border-custom-textColor rounded-sm absolute border-opacity-100 top-[50%] translate-y-[-50%] left-[98%] border-t-4 border-r-4 rotate-[45deg] hover:scale-[1.05] cursor-pointer transition duration-200 ease-in-out hover:border-opacity-70 active:scale-[0.98] z-1000 "
      }
      style={{}}
      onClick={onClick}
    />
  );
};
const PrevArrow = (props: any) => {
  const { onClick } = props;
  console.log("Current Slide In Arrow:", props.currentSlide);
  return (
    <div
      className={
        "w-[16px] h-[16px] border-custom-textColor rounded-sm absolute border-opacity-100 top-[50%] translate-y-[-50%] left-[0%] border-t-4 border-l-4 rotate-[-45deg] hover:scale-[1.05] cursor-pointer transition duration-200 ease-in-out hover:border-opacity-70 active:scale-[0.98] "
      }
      style={{}}
      onClick={onClick}
    />
  );
};
