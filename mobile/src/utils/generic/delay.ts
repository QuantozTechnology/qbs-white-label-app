/**
 * Delays the execution of a promise for a specified amount of time.
 * @param {number} ms - The number of milliseconds to delay the promise resolution.
 * @return {Promise<void>} - A promise that will resolve after the specified delay.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
