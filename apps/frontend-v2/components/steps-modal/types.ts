/**
 * types for the steps modal
 */

import { CanvasProps } from "components/canvas/types";
import { BaseComponentProps } from "components/types";
import { Step } from "utilities/classes/step";


export interface StepsModalProps extends CanvasProps {
    canvasDimensions?: [number, number];
    rootStep?: Step | null
    wrapperProps?: BaseComponentProps
}