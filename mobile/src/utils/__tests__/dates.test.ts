// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import {
  addTimeToDate,
  AddTimeIntervals,
  isOfLegalAge,
  calculateValidity,
} from "../dates";

const now = new Date("2023-03-13T12:00:00.000Z").getTime();

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

describe("calculateValidity", () => {
  beforeEach(() => {
    // Mocking the date of today to be a set date instead
    jest.spyOn(Date, "now").mockImplementation(() => now);
  });

  afterEach(() => {
    // Restore the original Date.now() implementation
    jest.spyOn(Date, "now").mockRestore();
  });

  it("should return 'Never' if expiresOn is null", () => {
    expect(calculateValidity(null)).toBe("Never expires");
  });

  it("should return 'Never' if expiresOn is undefined", () => {
    expect(calculateValidity(undefined)).toBe("Never expires");
  });

  it("should return a message indicating the item has expired if the difference between expiresOn and the current time is negative", () => {
    const expired10DaysAgo = getExpirationDateTimeDiff("day", -10);

    expect(calculateValidity(expired10DaysAgo)).toBe("Expired 10 days ago");
  });

  it("should return a message indicating the item is valid for a certain period of time if the difference between expiresOn and the current time is positive", () => {
    const expiresIn10Days = getExpirationDateTimeDiff("day", 10);

    expect(calculateValidity(expiresIn10Days)).toBe("Valid for 10 days");
  });

  it("should return a message indicating the item is valid for a certain number of seconds if the difference between expiresOn and the current time is less than one minute", () => {
    const expiresInLessThan1Minute = getExpirationDateTimeDiff("second", 30);

    expect(calculateValidity(expiresInLessThan1Minute)).toBe(
      "Valid for 30 seconds"
    );
  });

  it("should return a message indicating the item expired exactly one minute ago if the difference between expiresOn and the current time is exactly one minute", () => {
    const expired1MinuteAgo = getExpirationDateTimeDiff("minute", -1);

    expect(calculateValidity(expired1MinuteAgo)).toBe("Expired 1 minute ago");
  });

  it("should return a message indicating the item is valid for exactly one minute if the difference between expiresOn and the current time is exactly one minute in the future", () => {
    const expiresIn1Minute = getExpirationDateTimeDiff("minute", 1);

    expect(calculateValidity(expiresIn1Minute)).toBe("Valid for 1 minute");
  });

  it("should return a message indicating the item expired exactly one hour ago if the difference between expiresOn and the current time is exactly one hour", () => {
    const expired1HourAgo = getExpirationDateTimeDiff("minute", -60);

    expect(calculateValidity(expired1HourAgo)).toBe("Expired 1 hour ago");
  });

  it("should return a message indicating the item is valid for exactly one hour if the difference between expiresOn and the current time is exactly one hour in the future", () => {
    const expiresIn1Hour = getExpirationDateTimeDiff("minute", 60);

    expect(calculateValidity(expiresIn1Hour)).toBe("Valid for 1 hour");
  });

  it("should return a message indicating the item expired exactly one day ago if the difference between expiresOn and the current time is exactly one day.", () => {
    const expired1DayAgo = getExpirationDateTimeDiff("day", -1);

    expect(calculateValidity(expired1DayAgo)).toBe("Expired 1 day ago");
  });

  it("should return a message indicating the item is valid for exactly one day if the difference between expiresOn and the current time is exactly one day in the future", () => {
    const expirationDateTime = getExpirationDateTimeDiff("day", 1);

    expect(calculateValidity(expirationDateTime)).toBe("Valid for 1 day");
  });
});

// helper function to avoid repetitive code in tests above
function getExpirationDateTimeDiff(
  unit: "day" | "second" | "minute",
  value: number
) {
  const expiresOn = new Date(now);
  switch (unit) {
    case "day":
      return new Date(
        new Date(expiresOn).setDate(expiresOn.getDate() + value)
      ).getTime();

    case "second":
      return new Date(
        new Date(expiresOn).setSeconds(expiresOn.getSeconds() + value)
      ).getTime();

    case "minute":
      return new Date(
        new Date(expiresOn).setMinutes(expiresOn.getMinutes() + value)
      ).getTime();

    default:
      throw new Error("Invalid time unit");
  }
}
