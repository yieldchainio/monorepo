/**
 * @notice
 * Represents an AWS logger,
 * accepts some session ID and sends to cloudwatch
 */

export class AWSLogger {
  constructor() {}

  // ===================
  //       METHODS
  // ===================

  /**
   * Log a message to the session console
   * @param message - The message to log
   */
  static log = (id: string, message: any) => {
    console.log(message);
  };
}
