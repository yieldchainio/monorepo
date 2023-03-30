"use client";
import { useEffect, useState } from "react";
import {
  ClassificationContext,
  Endpoints,
  YCClassifications,
} from "@yc/yc-models";
import { useYCStore } from "./yc-data";
import { useTransition } from "react";

/**
 * @notice
 * A nullish, plain component used to initiate the data consumed by the entire app,
 *
 * It is rendered as the first child of an async RSC, which is responsible for awaitng the initiallization of a context class @uses YCClassification.
 * It accepts the context as a prop (Assuming the data points have been initiallized), and it then goes onto hydrating the state stores with it's data.
 *
 * It does not manually specify which data points to hydrate - all *useYCxxx* store hooks have a refresh on them, which takes in a context class instance as it's only parameter,
 * and takes care of hydrating itself. Which means we simply iterate over data points.
 */

const StoreInitiallizor = ({ context }: StoreInitiallizorProps) => {
  // For suspense
  const [isPending, startTransition] = useTransition();

  // Keep track to see if we have been initiallized or not
  const [initiallized, setInitiallized] = useState<boolean>(false);

  useEffect(() => {
    if (!initiallized) {
      useYCStore.setState((state) => {
        return {
          context: YCClassifications.getInstance(context),
        };
      });

      setInitiallized(true);
    }
  }, []);

  // Hydrate the store hooks
  if (!initiallized) {
    // console.log("Running hydration babyyy!!!");
    // const contextInstance = YCClassifications.getInstance(context);
    // // An array of all the datapoints,
    // // feel free to add to here / remove as needed.
    // const stores = [];
    // // @notice we iterate over each storage hook
    // for (const stateStore of stores) {
    //   /**
    //    * Get the refresh function out of the store (standard, all stores @uses YCBaseStore
    //    */
    //   const { refresh }: YCBaseStore = stateStore();
    //   // Refresh the data
    //   refresh(contextInstance);
    // }
  }

  // Return null (This is a plain compnent)
  return null;
};

// Interface for the props, only takes in a context instance
interface StoreInitiallizorProps {
  context: ClassificationContext;
}

export default StoreInitiallizor;