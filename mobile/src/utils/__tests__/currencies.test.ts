import { displayFiatAmount, getDecimalCount } from "../currencies";

describe("displayFiatAmount", () => {
  it('should return "N/A" for null or undefined inputs', () => {
    expect(displayFiatAmount(null)).toBe("N/A");
    expect(displayFiatAmount(undefined)).toBe("N/A");
  });

  it("should return a string with the provided number of decimal places", () => {
    expect(displayFiatAmount(123.456, { decimals: 2 })).toBe("123.46");
    expect(displayFiatAmount("123.456", { decimals: 1 })).toBe("123.5");
  });

  it("should return a string with the number of decimal places in the input if no decimals option is provided", () => {
    expect(displayFiatAmount(123.456)).toBe("123.46");
    expect(displayFiatAmount("123.456")).toBe("123.456");
  });

  it("should prefix the amount with the provided currency code", () => {
    expect(displayFiatAmount(123.456, { currency: "USD" })).toBe("USD 123.46");
    expect(displayFiatAmount("123.456", { currency: "USD" })).toBe(
      "USD 123.456"
    );
  });
});

describe("getDecimalCount", () => {
  it("should return the number of decimal places in the input", () => {
    expect(getDecimalCount(123.456)).toBe(3);
    expect(getDecimalCount("123.456")).toBe(3);
    expect(getDecimalCount(123)).toBe(0);
    expect(getDecimalCount("123")).toBe(0);
  });
});
