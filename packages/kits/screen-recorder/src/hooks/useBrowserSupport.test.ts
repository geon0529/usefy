import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useBrowserSupport, checkBrowserSupport, getBestMimeType } from "./useBrowserSupport";

describe("useBrowserSupport", () => {
  describe("when browser supports screen recording", () => {
    it("should return isSupported as true", () => {
      const { result } = renderHook(() => useBrowserSupport());

      expect(result.current.isSupported).toBe(true);
      expect(result.current.hasDisplayMedia).toBe(true);
      expect(result.current.hasMediaRecorder).toBe(true);
    });

    it("should return supported MIME types", () => {
      const { result } = renderHook(() => useBrowserSupport());

      expect(result.current.supportedMimeTypes.length).toBeGreaterThan(0);
      expect(result.current.supportedMimeTypes).toContain("video/webm");
    });
  });

  describe("when getDisplayMedia is not available", () => {
    const originalMediaDevices = navigator.mediaDevices;

    beforeEach(() => {
      Object.defineProperty(navigator, "mediaDevices", {
        value: { getUserMedia: vi.fn() }, // No getDisplayMedia
        writable: true,
        configurable: true,
      });
    });

    afterEach(() => {
      Object.defineProperty(navigator, "mediaDevices", {
        value: originalMediaDevices,
        writable: true,
        configurable: true,
      });
    });

    it("should return isSupported as false", () => {
      const { result } = renderHook(() => useBrowserSupport());

      expect(result.current.isSupported).toBe(false);
      expect(result.current.hasDisplayMedia).toBe(false);
    });
  });

  describe("when MediaRecorder is not available", () => {
    const originalMediaRecorder = window.MediaRecorder;

    beforeEach(() => {
      // @ts-expect-error - Intentionally removing MediaRecorder for test
      delete window.MediaRecorder;
    });

    afterEach(() => {
      Object.defineProperty(window, "MediaRecorder", {
        value: originalMediaRecorder,
        writable: true,
        configurable: true,
      });
    });

    it("should return isSupported as false", () => {
      const { result } = renderHook(() => useBrowserSupport());

      expect(result.current.isSupported).toBe(false);
      expect(result.current.hasMediaRecorder).toBe(false);
    });
  });
});

describe("checkBrowserSupport", () => {
  it("should return browser support info synchronously", () => {
    const support = checkBrowserSupport();

    expect(support).toHaveProperty("isSupported");
    expect(support).toHaveProperty("hasDisplayMedia");
    expect(support).toHaveProperty("hasMediaRecorder");
    expect(support).toHaveProperty("supportedMimeTypes");
  });
});

describe("getBestMimeType", () => {
  it("should return a supported MIME type", () => {
    const mimeType = getBestMimeType();

    expect(mimeType).toBeTruthy();
    expect(mimeType).toContain("video/");
  });
});
