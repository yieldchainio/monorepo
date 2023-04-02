/**
 * @notice
 * Represents an AWS logger,
 * accepts some session ID and sends to cloudwatch
 */

export class AWSLogger {
  #id: string;
  constructor(id: string) {
    this.#id = id;
  }

  // ===================
  //       METHODS
  // ===================

  /**
   * Log a message to the session console
   * @param message - The message to log
   */
  log = (message: any) => {
    console.log(message);
  };
}
