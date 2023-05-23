/**
 * Map TriggerType enum => Builder
 */
import { Trigger, YCStep, TriggerTypes } from "@yc/yc-models";
export declare const TRIGGER_BUILDERS: Record<TriggerTypes, (root: YCStep) => Trigger>;
