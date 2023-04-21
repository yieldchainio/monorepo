/**
 * A simple modal containing a canvas, displaying steps
 */

import { Canvas } from "components/canvas";
import { StepsModalProps } from "./types";
import { Step } from "utilities/classes/step";
import { DefaultDimensions, StepSizing } from "utilities/classes/step/types";
import { useSteps } from "utilities/hooks/yc/useSteps";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import { useCallback, useId, useMemo, useState } from "react";
import { HeadStep } from "components/steps";
import { Edge } from "components/steps/components/edge";
import WrappedImage from "components/wrappers/image";
import { useModals } from "utilities/hooks/stores/modal";
import { ModalWrapper } from "components/modal-wrapper";

export const StepsModal = ({
  style,
  className,
  parentStyle,
  utilityButtons,
  wrapperProps,
  strategy,
  options,
  root,
  comparisonCallback,
  canvasID,
  ...props
}: StepsModalProps) => {
  /**
   * We get the global context instance from the store, to pass onto the useSteps hook
   */
  const context = useYCStore((state) => state.context);

  /**
   * Some Dummy State to trigger a comparison on graphs
   */
  const [dummyState, setDummyState] = useState<boolean>(false);

  /**
   * We instantiate the useSteps hook with the provided root step, and the optional strategy & context.
   *
   * The useSteps hook orchestrates the state management of the steps tree, auto-graphs them on state
   * changes and provides us with utility functions.
   *
   * A strategy & context may be optionally provided if this is a ready strategy that is looking to display
   * it's steps, but the strategy hasnt loaded yet - So the hook will handle getting it's root step into
   * a Step instance.
   */
  const { stepsState, canvasDimensions, resizeAll, triggerComparison } =
    useSteps(
      root
        ? root
        : strategy?.rootStep
        ? Step.fromDBStep({
            step: strategy.rootStep.toJSON(),
            context,
            iStepConfigs: { size: options?.initialSize },
          })
        : null,
      strategy,
      context,
      {
        stateSetter: () => setDummyState(!dummyState),
        comparisonCallback: comparisonCallback,
        ...(options || {}),
      }
    );
  // Handler for resizing the nodes based on zoom
  const handleZoom = (zoom: number) => {
    if (zoom > 1.1) resizeAll(StepSizing.MEDIUM, null, false);
    else resizeAll(StepSizing.SMALL, null, false);
  };

  // Root step (memoized)
  const rootStep = useMemo(() => {
    return stepsState.rootStep;
  }, [
    // stepsState,
    stepsState.rootStep,
    // JSON.stringify(stepsState.rootStep?.toJSON()),
  ]);

  /**
   * Get global modals context for pushing fullscreen
   */
  const modals = useModals();

  /**
   * Function to push the steps canvas when full screen is requested
   */
  const toFullScreen = () => {
    modals.push((id: number) => {
      return {
        component: (
          <ModalWrapper
            modalKey={id}
            style={{
              padding: "2vh",
              zIndex: 0,
            }}
            closeFunction={() => {
              modals.remove(id);
            }}
          >
            <div
              className="w-full  mx-auto bg-custom-componentbg bg-opacity-40 p-[4px] rounded-xl "
              onClick={props.onClick}
              style={{
                width: "95vw",
                height: "95vh",
              }}
            >
              <Canvas
                size={canvasDimensions}
                childrenWrapper={
                  <div className="relative w-max h-max mx-auto"></div>
                }
                style={style}
                className={className}
                parentStyle={parentStyle}
                utilityButtons={[
                  ...(utilityButtons || []),
                  {
                    children: (
                      <WrappedImage
                        src={{
                          dark: "/icons/minimize-light.svg",
                          light: "/icons/minimize-dark.svg",
                        }}
                        width={14}
                        height={14}
                      />
                    ),

                    label: "Minimize Screen",
                    onClick: () => {
                      modals.remove(id);
                    },
                  },
                ]}
                setters={{
                  zoom: handleZoom,
                }}
                id={canvasID}
              >
                {rootStep?.map<React.ReactNode>((step: Step) => {
                  return (
                    <HeadStep
                      step={step}
                      style={{
                        left: step.position.x,
                        top: step.position.y,
                        marginLeft: "auto",
                        marginRight: "auto",
                        transform: "translateX(-50%)",
                      }}
                      key={step.id}
                      triggerComparison={triggerComparison}
                      canvasID={canvasID}
                    />
                  );
                })}
                {rootStep?.map((step: Step) => {
                  return !step.children.length
                    ? null
                    : step.children.map((child: Step) => (
                        <Edge
                          parentStep={step}
                          childStep={child}
                          canvasID={canvasID}
                          key={`${step.id}_${child.id}`}
                        />
                      ));
                })}
              </Canvas>
            </div>
          </ModalWrapper>
        ),
      };
    });
  };

  return (
    <div
      className="w-full z-[-1] mx-auto bg-custom-componentbg bg-opacity-40 p-[4px] rounded-xl "
      onClick={props.onClick}
      {...wrapperProps}
    >
      <Canvas
        size={canvasDimensions}
        childrenWrapper={<div className="relative w-max h-max mx-auto"></div>}
        style={style}
        className={className}
        parentStyle={parentStyle}
        utilityButtons={[
          ...(utilityButtons || []),
          {
            children: (
              <WrappedImage
                src={{
                  dark: "/icons/expand-light.svg",
                  light: "/icons/expand-dark.svg",
                }}
                width={14}
                height={14}
              />
            ),

            label: "Full Screen",
            onClick: () => toFullScreen(),
          },
        ]}
        setters={{
          zoom: handleZoom,
        }}
        id={canvasID}
      >
        {rootStep?.map<React.ReactNode>((step: Step) => {
          return (
            <HeadStep
              step={step}
              style={{
                left: step.position.x,
                top: step.position.y,
                marginLeft: "auto",
                marginRight: "auto",
                transform: "translateX(-50%)",
              }}
              key={step.id}
              triggerComparison={triggerComparison}
              canvasID={canvasID}
            />
          );
        })}
        {rootStep?.map((step: Step) => {
          return !step.children.length
            ? null
            : step.children.map((child: Step) => (
                <Edge
                  parentStep={step}
                  childStep={child}
                  canvasID={canvasID}
                  key={`${step.id}_${child.id}`}
                />
              ));
        })}
      </Canvas>
    </div>
  );
};
