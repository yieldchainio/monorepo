"use client";

import { Canvas } from "components/canvas";
import {
  EDGE_HEIGHT,
  SOL_TXN_NODE_GAP,
  SOL_TXN_NODE_HEIGHT,
  SOL_TXN_NODE_WIDTH,
} from "components/sol-visual/constants";
import { TokenNodeComponent } from "components/sol-visual/nodes/token";
import { WalletNodeComponent } from "components/sol-visual/nodes/wallet";
import { getPopulatedSolTransfersTree } from "components/sol-visual/utils/get-populated-tree";
import {
  TokenNode,
  WalletNode,
} from "components/sol-visual/utils/get-populated-tree/types";
import { StraightEdge } from "components/steps/components/edge/components/straight-edge";
import { useEffect, useState } from "react";

/**
 * Page for the txn visuallization (dynamic ID param)
 */

const TxnVisuallizor = ({ params }: { params: { txnID: string } }) => {
  /**
   * State for the txns
   */
  const [txns, setTxns] =
    useState<Array<[WalletNode, TokenNode, WalletNode]>>();

  /**
   * Canvas dimensions
   */
  const [canvasDimensions, setCanvasDimensions] = useState<[number, number]>([
    5000, 5000,
  ]);

  /**
   * We fetch, format the txns in a useEffect on mount and set the TXNs, and canvas width, height
   */
  useEffect(() => {
    (async () => {
      const res = await getPopulatedSolTransfersTree(params.txnID);
      setTxns(res);
      let width = SOL_TXN_NODE_GAP;
      let height = SOL_TXN_NODE_HEIGHT * 2 + EDGE_HEIGHT;
      for (const transfer of res) {
        width += SOL_TXN_NODE_WIDTH + SOL_TXN_NODE_GAP;
      }
      setCanvasDimensions([width, height]);
    })();
  }, []);
  return (
    <Canvas
      childrenWrapper={<div className=" w-max h-max"></div>}
      size={canvasDimensions}
      parentStyle={{
        width: "100vw",
        height: "100vh",
      }}
    >
      {txns &&
        txns.map((txn) => {
          return (
            <>
              <WalletNodeComponent
                solanaAddress={txn[0].address}
                style={{
                  position: "absolute",
                  left: `${txn[0].position.x}px`,
                  top: `${txn[0].position.y}px`,
                }}
              ></WalletNodeComponent>
              <StraightEdge
                parentAnchor={{
                  y: txn[0].position.y + SOL_TXN_NODE_HEIGHT,
                  x: txn[0].position.x + SOL_TXN_NODE_WIDTH / 2,
                }}
                childAnchor={{
                  y: txn[2].position.y,
                  x: txn[2].position.x + SOL_TXN_NODE_WIDTH / 2,
                }}
                style={{
                  zIndex: 10,
                }}
              ></StraightEdge>
              <TokenNodeComponent
                logo={txn[1].token.logo}
                symbol={txn[1].token.symbol}
                style={{
                  left: `${txn[1].position.x}px`,
                  top: `${txn[1].position.y}px`,
                  position: "absolute",
                  zIndex: 1000,
                }}
                address={txn[1].token.address}
                amount={txn[1].amount}
              ></TokenNodeComponent>
              <WalletNodeComponent
                solanaAddress={txn[2].address}
                style={{
                  position: "absolute",
                  left: `${txn[2].position.x}px`,
                  top: `${txn[2].position.y}px`,
                }}
              ></WalletNodeComponent>
            </>
          );
        })}
    </Canvas>
  );
};

export default TxnVisuallizor;
