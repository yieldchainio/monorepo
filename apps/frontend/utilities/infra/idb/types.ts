/**
 * Types for the idb interface
 */

export interface IDBOption<T, R = T> {
  serialize: (value: T) => R;
  deserialize: (value: R) => T;
}
