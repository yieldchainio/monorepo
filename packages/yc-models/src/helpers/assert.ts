/**
 * Simple assertion function
 * @param condition - either a boolean or a callback that returns a boolean
 * @param message - the message to send if the condition evaluates to false
 */

export const assert = (
  condition: ((...args: any) => boolean) | boolean,
  message: string
) => {
  // If it's boolean we just check it directly
  if (typeof condition == "boolean") {
    if (condition === false) throw new Error(message);
    return;
  }

  // Otherwise we evaluate the return value
  if (condition() === false) throw new Error(message);
};

/**
 * "Light" assertion that does not throw but console.error's the error
 */

export const lightAssert = (
  condition: ((...args: any) => boolean) | boolean,
  message: string
) => {
  // If it's boolean we just check it directly
  if (typeof condition == "boolean") {
    if (condition === false) console.error(message);
    return;
  }
  // Otherwise we evaluate the return value
  if (condition() === false) console.error(message);
};
