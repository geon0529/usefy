import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useDisplayMedia } from "./useDisplayMedia";
import { mockGetDisplayMedia, createMockMediaStream } from "../../vitest.setup";

describe("useDisplayMedia", () => {
  beforeEach(() => {
    mockGetDisplayMedia();
  });

  describe("initial state", () => {
    it("should start with no stream", () => {
      const { result } = renderHook(() => useDisplayMedia());

      expect(result.current.stream).toBeNull();
      expect(result.current.isStreaming).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe("requestStream", () => {
    it("should request and obtain a media stream", async () => {
      const { result } = renderHook(() => useDisplayMedia());

      await act(async () => {
        await result.current.requestStream();
      });

      expect(result.current.stream).not.toBeNull();
      expect(result.current.isStreaming).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it("should detect audio tracks when audio is enabled", async () => {
      const { result } = renderHook(() =>
        useDisplayMedia({ audio: true })
      );

      await act(async () => {
        await result.current.requestStream();
      });

      expect(result.current.hasAudio).toBe(true);
    });

    it("should not have audio when audio is disabled", async () => {
      const { result } = renderHook(() =>
        useDisplayMedia({ audio: false })
      );

      await act(async () => {
        await result.current.requestStream();
      });

      expect(result.current.hasAudio).toBe(false);
    });
  });

  describe("error handling", () => {
    it("should handle permission denied error", async () => {
      mockGetDisplayMedia({
        shouldReject: true,
        rejectReason: "Permission denied",
      });

      const onError = vi.fn();
      const { result } = renderHook(() =>
        useDisplayMedia({ onError })
      );

      await act(async () => {
        await result.current.requestStream();
      });

      expect(result.current.stream).toBeNull();
      expect(result.current.error).not.toBeNull();
      expect(result.current.error?.code).toBe("PERMISSION_DENIED");
      expect(onError).toHaveBeenCalled();
    });
  });

  describe("stopStream", () => {
    it("should stop all tracks and clear stream", async () => {
      const { result } = renderHook(() => useDisplayMedia());

      await act(async () => {
        await result.current.requestStream();
      });

      const stream = result.current.stream;
      expect(stream).not.toBeNull();

      act(() => {
        result.current.stopStream();
      });

      expect(result.current.stream).toBeNull();
      expect(result.current.isStreaming).toBe(false);

      // Verify tracks were stopped
      if (stream) {
        stream.getTracks().forEach((track) => {
          expect(track.stop).toHaveBeenCalled();
        });
      }
    });
  });

  describe("cleanup", () => {
    it("should cleanup stream on unmount", async () => {
      const { result, unmount } = renderHook(() => useDisplayMedia());

      await act(async () => {
        await result.current.requestStream();
      });

      const stream = result.current.stream;

      unmount();

      // Verify tracks were stopped on unmount
      if (stream) {
        stream.getTracks().forEach((track) => {
          expect(track.stop).toHaveBeenCalled();
        });
      }
    });
  });
});
