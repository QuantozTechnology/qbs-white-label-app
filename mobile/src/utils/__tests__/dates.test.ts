// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { addTimeToDate, AddTimeIntervals, isOfLegalAge } from "../dates";

describe("addTimeToDate", () => {
  it("should add 15 minutes to the date", () => {
    const date = new Date();
    const result = addTimeToDate(AddTimeIntervals.FifteenMinutes, date);
    expect(result).toEqual(new Date(date.getTime() + 1000 * 60 * 15));
  });
  it("should add 60 minutes to the date", () => {
    const date = new Date();
    const result = addTimeToDate(AddTimeIntervals.SixtyMinutes, date);
    expect(result).toEqual(new Date(date.getTime() + 1000 * 60 * 60));
  });
  it("should add 1 day to the date", () => {
    const date = new Date();
    const result = addTimeToDate(AddTimeIntervals.OneDay, date);
    expect(result).toEqual(new Date(date.getTime() + 1000 * 60 * 60 * 24));
  });
  it("should throw an error if an invalid value is provided for the add parameter", () => {
    const date = new Date();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => addTimeToDate("invalidValue" as any, date)).toThrowError(
      "Invalid value for add time interval"
    );
  });
});

describe("isOfLegalAge", () => {
  let currentYear: number;

  beforeEach(() => {
    currentYear = new Date().getFullYear();
  });

  it("returns true for a user who is at least 18 years old", () => {
    const birthDate = new Date(currentYear - 18, 11, 18);
    expect(isOfLegalAge(birthDate)).toBe(true);
  });

  it("returns false for a user who is less than 18 years old", () => {
    const birthDate = new Date(currentYear - 17, 11, 18);
    expect(isOfLegalAge(birthDate)).toBe(false);
  });
});
