import { useState, useEffect, useCallback } from "react";
import type { BrowserSupport } from "../types";
import { SUPPORTED_MIME_TYPES } from "../constants";

/**
 * Checks if the getDisplayMedia API is available
 */
function checkDisplayMediaSupport(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof navigator === "undefined") return false;
  if (!navigator.mediaDevices) return false;
  return typeof navigator.mediaDevices.getDisplayMedia === "function";
}

/**
 * Checks if MediaRecorder is available
 */
function checkMediaRecorderSupport(): boolean {
  if (typeof window === "undefined") return false;
  return typeof MediaRecorder !== "undefined";
}

/**
 * Gets list of supported MIME types
 */
function getSupportedMimeTypes(): string[] {
  if (!checkMediaRecorderSupport()) return [];

  return SUPPORTED_MIME_TYPES.filter((mimeType) => {
    try {
      return MediaRecorder.isTypeSupported(mimeType);
    } catch {
      return false;
    }
  });
}

/**
 * Gets the best supported MIME type
 */
export function getBestMimeType(): string | null {
  const supported = getSupportedMimeTypes();
  return supported.length > 0 ? supported[0] : null;
}

/**
 * Hook to detect browser support for screen recording
 *
 * @returns Browser support information
 *
 * @example
 * ```tsx
 * function RecorderComponent() {
 *   const { isSupported, hasDisplayMedia, supportedMimeTypes } = useBrowserSupport();
 *
 *   if (!isSupported) {
 *     return <p>Screen recording is not supported</p>;
 *   }
 *
 *   return <button>Start Recording</button>;
 * }
 * ```
 */
export function useBrowserSupport(): BrowserSupport {
  const [support, setSupport] = useState<BrowserSupport>(() => ({
    isSupported: false,
    hasDisplayMedia: false,
    hasMediaRecorder: false,
    supportedMimeTypes: [],
  }));

  useEffect(() => {
    const hasDisplayMedia = checkDisplayMediaSupport();
    const hasMediaRecorder = checkMediaRecorderSupport();
    const supportedMimeTypes = getSupportedMimeTypes();

    setSupport({
      isSupported: hasDisplayMedia && hasMediaRecorder && supportedMimeTypes.length > 0,
      hasDisplayMedia,
      hasMediaRecorder,
      supportedMimeTypes,
    });
  }, []);

  return support;
}

/**
 * Checks browser support without React hooks (for one-time checks)
 */
export function checkBrowserSupport(): BrowserSupport {
  const hasDisplayMedia = checkDisplayMediaSupport();
  const hasMediaRecorder = checkMediaRecorderSupport();
  const supportedMimeTypes = getSupportedMimeTypes();

  return {
    isSupported: hasDisplayMedia && hasMediaRecorder && supportedMimeTypes.length > 0,
    hasDisplayMedia,
    hasMediaRecorder,
    supportedMimeTypes,
  };
}
