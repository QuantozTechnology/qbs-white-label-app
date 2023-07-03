// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

type Options = {
  min?: number;
  max: number;
};

/**
 * This function is used to calculate the length of the skeleton's items in loading components.
 * It generates a random number in the specified range, which is a multiple of four.
 * The multiple of four is required to fit the NativeBase theming.
 *
 * @param {Options} options - The options for the range.
 * @returns {number} - A random multiple of 4 within the specified range.
 * @throws Will throw an error if there are no multiples of 4 in the given range.
 */
export function getRandomMultipleOfFour({ min = 4, max }: Options): number {
  min = Math.ceil(min / 4) * 4; // round min up to nearest multiple of 4
  max = Math.floor(max / 4) * 4; // round max down to nearest multiple of 4
  if (min > max) {
    throw new Error("No multiples of 4 in this range");
  }
  const num = Math.floor((Math.random() * (max - min)) / 4 + 1) * 4 + min;
  return num;
}
