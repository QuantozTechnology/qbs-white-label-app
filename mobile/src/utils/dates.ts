// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { Platform } from "react-native";

// Function to solve a known issue for React Native, only affecting Android: https://github.com/facebook/react-native/issues/16867
function fixAndroidDate(date: string) {
  const dateOnly = date.split("T").shift();

  if (!dateOnly) {
    throw Error("Wrong date string format given, must be ISO date string");
  }

  const [year, month, day] = dateOnly.split("-");
  return `${day}/${month}/${year}`;
}

// Function to solve a known issue for React Native, only affecting Android: https://github.com/facebook/react-native/issues/16867
function fixAndroidTime(date: string) {
  return date.split("T").pop()?.split(".").shift();
}

/**
 * Formats a given date string (or unix epoch) to a locale date string in the "en-GB" format
 * @param {string} date - The date string to format
 * @returns {string} The formatted date string
 */
export function formatDate(date: string | number) {
  if (Platform.OS === "android") {
    return fixAndroidDate(new Date(date).toISOString());
  }
  return new Date(date).toLocaleDateString("en-GB");
}

/**
 * Formats a given date string to a locale time string in the "en-GB" format
 * @param {string} date - The date string to format
 * @returns {string} The formatted time string
 */
export function formatTime(date: string) {
  if (Platform.OS === "android") {
    return fixAndroidTime(new Date(date).toISOString());
  }

  return new Date(date).toLocaleTimeString("en-GB");
}

/**
 * Formats a given date string to a locale date and time string in the "en-GB" format
 * @param {string} date - The date string to format
 * @returns {string} The formatted date and time string
 */
export function formatDateTime(date: string | number) {
  if (typeof date === "number") {
    const dateFromEpoch = new Date(date).toISOString();
    return `${formatDate(dateFromEpoch)} - ${formatTime(dateFromEpoch)}`;
  }

  return `${formatDate(date)} - ${formatTime(date)}`;
}

/**
 * Custom function to check if the user's birth date is of legal age (at least 18 years old).
 *
 * @param {Date} birthDate - The user's birth date.
 *
 * @returns {boolean} - Returns `true` if the user's birth date is of legal age (at least 18 years old),
 * and `false` otherwise.
 */
export function isOfLegalAge(birthDate: Date): boolean {
  const currentDate = new Date();
  const birthYear = birthDate.getFullYear();
  const currentYear = currentDate.getFullYear();

  // Calculate the number of years between the user's birth date and the current date
  const numYears = currentYear - birthYear;
  if (numYears >= 18) {
    return true;
  } else {
    return false;
  }
}

export enum AddTimeIntervals {
  FifteenMinutes = "fifteenMinutes",
  SixtyMinutes = "sixtyMinutes",
  OneDay = "oneDay",
}

/**
 * Add a specified time interval to a given date
 * @param {Date} [date=new Date()] - The date to add the time interval to. Defaults to the current date.
 * @param {AddTimeIntervals} add - The time interval to add to the date.
 * @throws {Error} Will throw an error if an invalid value is provided for the add parameter
 * @returns {Date} The date with the added time interval
 */
export function addTimeToDate(add: AddTimeIntervals, date = new Date()) {
  if (!Object.values<string>(AddTimeIntervals).includes(add)) {
    throw new Error("Invalid value for add time interval");
  }

  switch (add) {
    case AddTimeIntervals.FifteenMinutes:
      return new Date(date.getTime() + 1000 * 60 * 15);
    case AddTimeIntervals.SixtyMinutes:
      return new Date(date.getTime() + 1000 * 60 * 60);
    case AddTimeIntervals.OneDay:
      return new Date(date.getTime() + 1000 * 60 * 60 * 24);
  }
}

/**
 * Calculates the validity of an expiration time based on the difference between the target time and the current time.
 * @param {number|null|undefined} expiresOn - The expiration time in milliseconds since the UNIX epoch, or null/undefined if the item never expires.
 * @returns {string} A message indicating the validity of the item based on the expiration time.
 */
export function calculateValidity(expiresOn: number | null | undefined) {
  if (expiresOn == null) {
    return "Never expires";
  }

  const now = Date.now(); // get current timestamp in milliseconds
  const targetTime = expiresOn;

  const diff = targetTime - now; // calculate difference between target time and current time
  const timeUnits = [
    { unit: "day", ms: 24 * 60 * 60 * 1000 },
    { unit: "hour", ms: 60 * 60 * 1000 },
    { unit: "minute", ms: 60 * 1000 },
  ];

  if (diff < 0) {
    // target time is in the past
    for (const { unit, ms } of timeUnits) {
      if (diff <= -ms) {
        const count = Math.floor(-diff / ms);
        return `Expired ${count} ${unit}${count === 1 ? "" : "s"} ago`;
      }
    }
    return "Just now"; // less than a minute ago
  } else {
    // target time is in the future
    for (const { unit, ms } of timeUnits) {
      if (diff >= ms) {
        const count = Math.floor(diff / ms);
        return `Valid for ${count} ${unit}${count === 1 ? "" : "s"}`;
      }
    }
    // the difference is less than one minute
    const count = Math.floor(diff / 1000);
    return `Valid for ${count} second${count === 1 ? "" : "s"}`;
  }
}
