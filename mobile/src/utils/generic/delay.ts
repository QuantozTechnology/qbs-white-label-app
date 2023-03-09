// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

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
