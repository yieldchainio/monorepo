import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./css/vaultmodal.module.css";
import styles1 from "./css/strategyBuilder.module.css";
import { toTitleCase, getFlowDetails, getStepDetails } from "utils/utils";

interface iStep {
  action_protocol_name: string;
  action_protocol_img: string;
  action_name: string;
  action_inflows: string[];
  action_outflows: string[];
  action_perc_from_prev_bal: number;
}

export const StepBlockMini = (props: any) => {
  const { stepDetails } = props;
  const {
    type,
    inflows,
    outflows,
    percentage,
    additional_args,
    protocol_details,
    step_identifier,
    parent_step_identifier,
  } = stepDetails;

  if (stepDetails) {
    return (
      <div style={props.style}>
        <div className={styles1.miniNodeContainer}>
          <img
            src={protocol_details.logo}
            alt=""
            className={styles1.miniNodeProtocolImg}
          />
          <div className={styles1.miniNodeActionContainer}>
            <div className={styles1.miniNodeActionText}>
              {toTitleCase(type).length > 7
                ? toTitleCase(type).slice(0, 7) + "..."
                : toTitleCase(type)}
            </div>
            <div className={styles1.miniNodeFlowsContainer}>
              <div className={styles1.miniNodeInnerflowContainer}>
                {outflows.length > 0
                  ? outflows.map((flow: any, index: number, arr: any[]) => (
                      <img
                        src={flow.token_details.logo}
                        alt=""
                        className={styles1.miniNodeTokenImg}
                      />
                    ))
                  : null}
              </div>
              <img
                className={styles1.miniNodeFlowsArrow}
                alt=""
                src="/miniNodeArrow.svg"
              />
              <div className={styles1.miniNodeInnerflowContainer}>
                {inflows.length > 0
                  ? inflows.map((flow: any, index: number, arr: any[]) => (
                      <img
                        src={flow.token_details.logo}
                        alt=""
                        className={styles1.miniNodeTokenImg}
                      />
                    ))
                  : null}
              </div>
            </div>
          </div>
          <img
            src="/horizontaldots.svg"
            alt=""
            className={styles1.miniNode3Dots}
          />
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export const MiniStepBlock = (props: any) => {
  const {
    type,
    divisor,
    function_identifiers,
    address_identifiers,
    protocol_identifier,
    additional_args,
    flows_identifiers,
    step_identifier,
    outflows,
    inflows,
    percentage,
    protocol_details,
  } = props.stepDetails;

  const [loading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (
      (type &&
        divisor &&
        function_identifiers &&
        address_identifiers &&
        protocol_identifier &&
        additional_args &&
        flows_identifiers &&
        step_identifier !== null) ||
      (undefined && outflows && inflows && percentage)
    ) {
      setIsLoading(false);
    } else {
    }
  }, [
    type,
    divisor,
    function_identifiers,
    address_identifiers,
    protocol_identifier,
    additional_args,
    flows_identifiers,
    step_identifier,
    outflows,
    inflows,
    percentage,
    protocol_details,
  ]);

  /**
   * Current Step's Details
   */

  if (!loading) {
    return (
      <div>
        <div className={styles.stepBlockMini} style={props.style}>
          <img
            src={protocol_details.logo}
            alt=""
            className={styles.stepBlockMiniMainImg}
          />

          <div className={styles.stepBlockMiniActionContainer}>
            <div className={styles.stepBlockMiniActionName}>
              {toTitleCase(type)}
            </div>
            <div className={styles.stepBlockMiniFlowsContainer}>
              {outflows.length > 0 ? (
                outflows.map((flow: any, index: number, arr: any[]) => (
                  <div>
                    <img
                      src={flow.token_details.logo}
                      alt=""
                      className={styles.stepBlockMiniActionFlowImg}
                      style={
                        arr.length > 1 ? { border: "1px solid #353535" } : {}
                      }
                    />
                  </div>
                ))
              ) : (
                <img
                  src={"/thin-x.svg"}
                  alt=""
                  className={styles.stepBlockMiniActionFlowImg}
                />
              )}
            </div>

            <img
              src="realArrowLeft.SVG"
              alt=""
              className={styles.stepBlockMiniArrowLeft}
            />
            <div className={styles.stepBlockMiniFlowsContainer}>
              {inflows.length > 0 ? (
                inflows.map((flow: any, index: number, arr: any[]) => (
                  <div>
                    <img
                      src={flow.token_details.logo}
                      alt=""
                      className={styles.stepBlockMiniActionFlowImg}
                      style={
                        arr.length > 1 ? { border: "1px solid #353535" } : {}
                      }
                    />
                  </div>
                ))
              ) : (
                <img
                  src={"/thin-x.svg"}
                  alt=""
                  className={styles.stepBlockMiniActionFlowImg}
                />
              )}
            </div>
          </div>
          <img
            src="horizontaldots.svg"
            alt=""
            className={styles.stepBlockMiniHorizontalDots}
          />
        </div>
      </div>
    );
  } else {
    return null;
  }
};
