import { describe, expect, it } from "vitest";
import { generateShortCode } from "@/lib/shortcode";

describe("generateShortCode", () => {
  it("is 8 characters long by default", () => {
    expect(generateShortCode()).toHaveLength(8);
  });

  it("honours a custom length", () => {
    expect(generateShortCode(4)).toHaveLength(4);
    expect(generateShortCode(12)).toHaveLength(12);
  });

  it("only uses URL-safe characters", () => {
    for (let i = 0; i < 200; i++) {
      expect(generateShortCode()).toMatch(/^[A-Za-z0-9_-]+$/);
    }
  });

  it("does not repeat across many calls", () => {
    const codes = new Set(Array.from({ length: 2000 }, () => generateShortCode()));
    expect(codes.size).toBe(2000);
  });
});
