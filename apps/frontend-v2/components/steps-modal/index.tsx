/**
 * A simple modal containing a canvas, displaying steps
 */

import { Canvas } from "components/canvas";
import { StepsModalProps } from "./types";
import { Step } from "utilities/classes/step";
import { Dimensions, StepSizing } from "utilities/classes/step/types";
import { useSteps } from "utilities/hooks/yc/useSteps";
import { useYCStore } from "utilities/hooks/stores/yc-data";
import { useEffect, useMemo, useRef, useState } from "react";
import { HeadStep } from "components/steps";
import { Edge } from "components/steps/components/edge";
import WrappedImage from "components/wrappers/image";
import { useModals } from "utilities/hooks/stores/modal";
import { ModalWrapper } from "components/modal-wrapper";
import { StepProps } from "components/steps/types";
import { SEED_TO_TREE_MARGIN } from "./constants";
import WrappedText from "components/wrappers/text";
import { BaseComponentProps } from "components/types";
import { StraightEdge } from "components/steps/components/edge/components/straight-edge";

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
  writeable,
  baseRootStep,
  seedContainerOnClick,
  ...props
}: StepsModalProps) => {
  // =================
  //     GLOBALS
  // =================
  /**
   * We get the global context instance from the store, to pass onto the useSteps hook
   */
  const context = useYCStore((state) => state.context);

  /**
   * Get global modals context for pushing fullscreen
   */
  const modals = useModals();

  /**
   * Some Dummy State to trigger a comparison on graphs
   */
  const [dummyState, setDummyState] = useState<boolean>(false);

  // ======================
  //     STYLING STATES
  // ======================

  /**
   * A state + useEffect to update a base Y coordinate for all steps graphing,
   * according to whether or not we got a base container, and what is the height of it
   */
  const [baseY, setBaseY] = useState<number>(0);

  // =============================
  //       CORE VARIABLES
  // =============================

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
        : strategy?.treeSteps
        ? Step.fromDBStep({
            step: strategy.treeSteps.toJSON(),
            context,
            iStepConfigs: { size: options?.initialSize },
          })
        : null,
      strategy,
      context,
      {
        stateSetter: () => setDummyState(!dummyState),
        comparisonCallback: comparisonCallback,
        basePositions: {
          y: baseY,
          x: 0,
        },
        ...(options || {}),
      }
    );

  /**
   * We have the equivlenet for the optionally provided base root
   */
  const {
    stepsState: baseStepsState,
    canvasDimensions: baseCanvasDimensions,
    resizeAll: resizeAllBase,
    triggerComparison: triggerBaseComparison,
  } = useSteps(
    baseRootStep ||
      (strategy?.seedSteps
        ? Step.fromDBStep({
            step: strategy?.seedSteps.toJSON(),
            context,
            iStepConfigs: { size: options?.initialSize },
          })
        : null),
    undefined,
    undefined,
    {
      stateSetter: () => setDummyState(!dummyState),
      comparisonCallback: comparisonCallback,
      basePositions: {
        y: SEED_TO_TREE_MARGIN,
        x: 0,
      },
    }
  );

  // Root step (memoized)
  const rootStep = useMemo(() => {
    // We enable writeability if not yet, if specified
    if (writeable) stepsState.rootStep?.enableDescendentsWriteability();
    return stepsState.rootStep;
  }, [stepsState.rootStep]);

  // Base Root step (memoized)
  const baseRoot = useMemo(() => {
    // We disable writeability on it
    baseStepsState.rootStep?.disableDescendantsWriteability();
    return baseStepsState.rootStep;
  }, [baseStepsState.rootStep]);

  /**
   * Memoize canvas size
   */
  const canvasSize = useMemo(
    () => [
      Math.max(canvasDimensions?.[0] || 0, baseCanvasDimensions?.[0] || 0),
      (canvasDimensions?.[1] || 0) + (baseCanvasDimensions?.[1] || 0) + 200,
    ],
    [canvasDimensions, baseCanvasDimensions?.[0], baseCanvasDimensions?.[1]]
  );

  /**
   * Memoize base container dimensions
   */
  const baseContainerDimensions = useMemo(
    () => ({
      width: baseCanvasDimensions
        ? baseCanvasDimensions[0] + SEED_TO_TREE_MARGIN
        : 0,

      height: baseCanvasDimensions
        ? baseCanvasDimensions[1] + SEED_TO_TREE_MARGIN
        : 0,
    }),
    [baseCanvasDimensions?.[0], baseCanvasDimensions?.[1], SEED_TO_TREE_MARGIN]
  );

  // ===============
  //    USEEFFECTS
  // ===============
  /**
   * useEffect on the base canvas dimensions to set the base Y
   */
  useEffect(() => {
    if (!baseCanvasDimensions) return;
    setBaseY(baseCanvasDimensions[1] + SEED_TO_TREE_MARGIN * 2);
  }, [baseCanvasDimensions]);

  // ===============
  //    METHODS
  // ===============

  /**
   * resizeBoth
   * resizes both root and base root (if existant)
   */
  const resizeBoth = (
    newSize: StepSizing,
    newDimensions: Dimensions | null,
    forceResize: boolean
  ) => {
    resizeAll(newSize, newDimensions, forceResize);
    resizeAllBase(newSize, newDimensions, forceResize);
  };

  /**
   * Handle zooming by resizing nodes
   */
  const handleZoom = (zoom: number) => {
    if (zoom > 1.1) resizeBoth(StepSizing.MEDIUM, null, false);
    else resizeBoth(StepSizing.SMALL, null, false);
  };

  // ========
  //   JSX
  // ========

  // Variable for the component, so we can reuse on fullscreen function
  const component = (
    <div
      className="  bg-custom-componentbg bg-opacity-40 p-[4px] rounded-xl "
      onClick={(e) => {
        e.stopPropagation();
        props.onClick?.();
      }}
      {...wrapperProps}
    >
      <Canvas
        size={canvasSize as [number, number]}
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
        <>
          {baseRootStep?.map<React.ReactNode>((step: Step, i: number) => {
            return (
              <HeadStep
                step={step}
                style={{
                  left: step.position.x,
                  top: step.position.y,
                  marginLeft: "auto",
                  marginRight: "auto",
                  transform: "translateX(-50%)",
                  ...style,
                }}
                key={step.id}
                triggerComparison={triggerComparison}
                canvasID={canvasID}
              />
            );
          })}
          {baseRootStep?.map((step: Step) => {
            return !step.children.length
              ? null
              : step.children.map((child: Step) => (
                  <Edge
                    parentStep={step}
                    childStep={child}
                    canvasID={canvasID}
                    key={`${step.id}_${child.id}`}
                    style={style}
                  />
                ));
          })}
        </>

        {rootStep?.map<React.ReactNode>((step: Step, i: number) => {
          return (
            <HeadStep
              step={step}
              style={{
                left: step.position.x,
                top: step.position.y,
                marginLeft: "auto",
                marginRight: "auto",
                transform: "translateX(-50%)",
                ...style,
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
                  style={style}
                />
              ));
        })}

        {baseRootStep && (
          <BorderedStepsContainer
            width={`${baseContainerDimensions.width}px`}
            height={`${baseContainerDimensions.height}px`}
            onClick={() => seedContainerOnClick?.()}
          />
        )}
        {baseRootStep && (
          <StraightEdge
            parentAnchor={{
              x: 0,
              y: baseContainerDimensions.height,
            }}
            childAnchor={{
              x: 0,
              y: rootStep?.position?.y || 0,
            }}
            style={{
              opacity: "50%",
            }}
          />
        )}
      </Canvas>
    </div>
  );

  /**
   * Function to push the steps canvas to fullscreen
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
            {component}
          </ModalWrapper>
        ),
      };
    });
  };

  return component;
};

const StepsTree = ({
  step,
  canvasID,
  triggerComparison,
  style,
}: Omit<StepProps, "step"> & {
  step: Step | null;
  transformX?: string;
  transformY?: string;
}) => {
  return (
    <>
      1
      {step?.map<React.ReactNode>((step: Step, i: number) => {
        return (
          <HeadStep
            step={step}
            style={{
              left: step.position.x,
              top: step.position.y,
              marginLeft: "auto",
              marginRight: "auto",
              transform: "translateX(-50%)",
              ...style,
            }}
            key={step.id}
            triggerComparison={triggerComparison}
            canvasID={canvasID}
          />
        );
      })}
      {step?.map((step: Step) => {
        return !step.children.length
          ? null
          : step.children.map((child: Step) => (
              <Edge
                parentStep={step}
                childStep={child}
                canvasID={canvasID}
                key={`${step.id}_${child.id}`}
                style={style}
              />
            ));
      })}
    </>
  );
};

const BorderedStepsContainer = ({
  width,
  height,
  onClick,
}: BaseComponentProps & { width: string; height: string }) => {
  return (
    <div
      className="group absolute border-[2px] border-custom-border border-dashed rounded-md  bg-custom-bcomponentbg bg-opacity-0 hover:bg-opacity-75 transition duration-200 ease-in-out cursor-pointer flex flex-col items-center justify-center"
      style={{
        width,
        height,
        marginLeft: "auto",
        marginRight: "auto",
        top: "0px",
        left: "0px",
        transform: "translateX(-50%)",
      }}
    >
      <WrappedText
        fontSize={26}
        className=" text-opacity-0  group-hover:text-opacity-70 transition duration-200 ease-in-out"
      >
        Edit Seed Steps
      </WrappedText>
    </div>
  );
};
