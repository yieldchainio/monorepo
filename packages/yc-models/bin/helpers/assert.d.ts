/**
 * Simple assertion function
 * @param condition - either a boolean or a callback that returns a boolean
 * @param message - the message to send if the condition evaluates to false
 */
export declare const assert: (condition: boolean | ((...args: any) => boolean), message: string) => void;
/**
 * "Light" assertion that does not throw but console.error's the error
 */
export declare const lightAssert: (condition: boolean | ((...args: any) => boolean), message: string) => void;
