import { describe, expect, it } from "vitest";
import { anonymizeIp, getClientIp, getGeo } from "@/lib/request";

describe("getClientIp", () => {
  it("prefers the Cloudflare header", () => {
    const headers = new Headers({
      "cf-connecting-ip": "203.0.113.7",
      "x-forwarded-for": "198.51.100.1, 10.0.0.1",
      "x-real-ip": "192.0.2.1",
    });
    expect(getClientIp(headers)).toBe("203.0.113.7");
  });

  it("takes the first entry of x-forwarded-for", () => {
    const headers = new Headers({ "x-forwarded-for": " 198.51.100.1 , 10.0.0.1" });
    expect(getClientIp(headers)).toBe("198.51.100.1");
  });

  it("falls back to x-real-ip", () => {
    expect(getClientIp(new Headers({ "x-real-ip": "192.0.2.1" }))).toBe("192.0.2.1");
  });

  it("returns null without any client header", () => {
    expect(getClientIp(new Headers())).toBeNull();
    expect(getClientIp({})).toBeNull();
  });

  it("accepts a plain object with lower-case keys", () => {
    expect(getClientIp({ "x-forwarded-for": "198.51.100.1" })).toBe("198.51.100.1");
    expect(getClientIp({ "cf-connecting-ip": "  203.0.113.7  " })).toBe("203.0.113.7");
  });

  it("ignores an empty forwarded header", () => {
    expect(getClientIp({ "x-forwarded-for": "", "x-real-ip": "192.0.2.1" })).toBe("192.0.2.1");
  });
});

describe("anonymizeIp", () => {
  it("zeroes the last IPv4 octet", () => {
    expect(anonymizeIp("203.0.113.77")).toBe("203.0.113.0");
    expect(anonymizeIp("10.1.2.3")).toBe("10.1.2.0");
  });

  it("keeps the first three IPv6 groups", () => {
    expect(anonymizeIp("2001:db8:85a3:0:0:8a2e:370:7334")).toBe("2001:db8:85a3::");
    expect(anonymizeIp("2001:db8::1")).toBe("2001:db8:::");
  });

  it("returns null for empty or malformed input", () => {
    expect(anonymizeIp(null)).toBeNull();
    expect(anonymizeIp("")).toBeNull();
    expect(anonymizeIp("1.2.3")).toBeNull();
    expect(anonymizeIp("1.2.3.4.5")).toBeNull();
    expect(anonymizeIp("localhost")).toBeNull();
  });

  it("never returns the full address", () => {
    for (const ip of ["203.0.113.77", "2001:db8:85a3:0:0:8a2e:370:7334"]) {
      expect(anonymizeIp(ip)).not.toBe(ip);
    }
  });
});

describe("getGeo", () => {
  it("reads the Cloudflare headers and upper-cases the country", () => {
    expect(getGeo({ "cf-ipcountry": "de", "cf-ipcity": "Berlin" })).toEqual({ country: "DE", city: "Berlin" });
  });

  it("falls back to the Vercel headers", () => {
    expect(getGeo(new Headers({ "x-vercel-ip-country": "US", "x-vercel-ip-city": "Austin" }))).toEqual({
      country: "US",
      city: "Austin",
    });
  });

  it("treats Cloudflare's unknown and Tor codes as no country", () => {
    expect(getGeo({ "cf-ipcountry": "XX" }).country).toBeNull();
    expect(getGeo({ "cf-ipcountry": "t1" }).country).toBeNull();
  });

  it("rejects country values that are not two letters", () => {
    expect(getGeo({ "cf-ipcountry": "USA" }).country).toBeNull();
    expect(getGeo({ "cf-ipcountry": "1" }).country).toBeNull();
  });

  it("percent-decodes the city and keeps a raw value when decoding fails", () => {
    expect(getGeo({ "cf-ipcity": "S%C3%A3o%20Paulo" }).city).toBe("São Paulo");
    expect(getGeo({ "cf-ipcity": "100%" }).city).toBe("100%");
  });

  it("returns nulls without location headers", () => {
    expect(getGeo(new Headers())).toEqual({ country: null, city: null });
  });
});
