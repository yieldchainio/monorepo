/**
 * Types for the strategy config colors store
 */

export interface StrategyConfigColorsStore {
  top: string;
  bottom: string;
  setColors: (top: string, bottom: string) => void;
}
