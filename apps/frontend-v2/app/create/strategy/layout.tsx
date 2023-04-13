"use client";
import { isValidElement, useEffect, useState } from "react";
import { useConfigRouting } from "utilities/hooks/general/useConfigRouting";
import { configRoutes } from "./constants";
/**
 * Main layout for the strategy config
 */

import { StrategyCreationLayoutProps } from "./types";
import { BackdropColor } from "components/backdrop-color";
import { useDisableScroll } from "utilities/hooks/styles/useDisableScroll";
import { Navigators } from "../../../components/navigators";
import { useStrategyConfigColors } from "utilities/hooks/stores/colors";
import { useStrategyStore } from "utilities/hooks/stores/strategies";
import {
  deseriallizeStrategyStore,
  strategiesLocalStorage,
} from "utilities/hooks/stores/strategies/constants";
import { useModals } from "utilities/hooks/stores/modal";
import { ModalWrapper } from "components/modal-wrapper";
import { StrategiesDraftsModal } from "components/drafts-modal";
import { ChildrenProvider } from "components/internal/render-children";
import { configProgressStep } from "utilities/hooks/stores/strategies/types";

const StrategyConfigLayout = ({ children }: StrategyCreationLayoutProps) => {
  /**
   * Get the state of the config routes to show progress and so on
   */
  const configRoutesState = useStrategyStore((state) => state.strategyConfigs);

  /**
   * Get route config state changer
   */
  const changeConfigRouteState = useStrategyStore(
    (state) => state.changeConfigRouteState
  );

  /**
   * Get the next and prev functions for our configs (Assinging to buttons)
   */
  const { next, prev, routeByIndex, progress, initRoute } = useConfigRouting(
    "/create/strategy",
    configRoutesState
  );

  /**
   * Styling store, set the colors of the backdrops
   */
  const { top, bottom } = useStrategyConfigColors();

  /**
   * Disable scrolling on this page (it will just fill the viewport)
   */
  useDisableScroll();

  // Get modals store (to push drafts modal conditonally)
  const modals = useModals();

  /**
   * @notice
   * We run a useEffect on mount,
   * we first check to see if the user has any existing strategy drafts in indexedDB (local storage).
   * If they do, we push our drafts modal and allow them to load any of them, or click a "New" button,
   * which just continues on with a new one.
   *
   * If they don't, we just continue of with the new one (We init the routing from our hook)
   */

  useEffect(() => {
    (async () => {
      // Get all the drafts under the strategies schema
      const drafts = await strategiesLocalStorage.getAll();

      // Remove all of the useless/empty ones
      for (const draft of drafts) {
        if (!draft || !draft.title)
          await strategiesLocalStorage.removeItem(draft.id);
      }
      if (drafts.length) {
        console.log("Drafts Lenght SEr!!!");
        modals.push((id: number) => {
          return {
            component: (
              <ModalWrapper modalKey={id}>
                <StrategiesDraftsModal
                  strategyDrafts={drafts.flatMap((draft) => {
                    const res = deseriallizeStrategyStore(draft);
                    // If they didnt even set up a title yet, it's a useless one
                    if (res && res.title) return [res];
                    return [];
                  })}
                  initStrategy={initRoute}
                />
              </ModalWrapper>
            ),
          };
        });
      } else initRoute();
    })();
  }, []);

  // Return the component
  return (
    <div className="flex flex-col items-center justify-start bg-custom-bg w-[100vw] h-[100vh] overflow-hidden z-0 absolute pt-[20vh] pb-[20vh]">
      <BackdropColor
        color={top}
        style={{ zIndex: -1, top: "-20%", left: "80%", width: "50vw" }}
      />
      <BackdropColor
        color={bottom}
        style={{
          top: "75%",
          left: "-30%",
          width: "50vw",
          zIndex: -1,
        }}
      />

      <Navigators
        next={next}
        prev={prev}
        steps={configRoutesState}
        nextCallback={(index: number) => {
          changeConfigRouteState(index, "complete");
          changeConfigRouteState(index + 1, "active");
        }}
        prevCallback={(index: number) => {
          changeConfigRouteState(index, "not_complete");
          changeConfigRouteState(index - 1, "active");
        }}
      />
      <ChildrenProvider
        callback={(child) =>
          !isValidElement(child) ? (
            child
          ) : (
            <child.type {...child.props} initRoute={initRoute} />
          )
        }
      >
        {children}
      </ChildrenProvider>
    </div>
  );
};

export default StrategyConfigLayout;
