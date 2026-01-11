import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useScreenRecorder } from "./useScreenRecorder";
import { mockGetDisplayMedia } from "../vitest.setup";

describe("useScreenRecorder", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockGetDisplayMedia();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initial state", () => {
    it("should start in idle state", () => {
      const { result } = renderHook(() => useScreenRecorder());

      expect(result.current.state).toBe("idle");
      expect(result.current.isRecording).toBe(false);
      expect(result.current.isPaused).toBe(false);
      expect(result.current.isCountingDown).toBe(false);
      expect(result.current.elapsed).toBe(0);
      expect(result.current.result).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it("should report browser support", () => {
      const { result } = renderHook(() => useScreenRecorder());

      expect(result.current.isSupported).toBe(true);
    });
  });

  describe("start()", () => {
    it("should transition to requesting state when start is called", async () => {
      const { result } = renderHook(() => useScreenRecorder());

      // Don't await - we want to check intermediate state
      act(() => {
        result.current.start();
      });

      expect(result.current.state).toBe("requesting");
    });

    it("should transition to countdown state after stream obtained", async () => {
      const { result } = renderHook(() =>
        useScreenRecorder({ countdown: 3 })
      );

      await act(async () => {
        await result.current.start();
      });

      expect(result.current.state).toBe("countdown");
      expect(result.current.isCountingDown).toBe(true);
      expect(result.current.countdownValue).toBe(3);
    });

    it("should start recording immediately if countdown is disabled", async () => {
      const { result } = renderHook(() =>
        useScreenRecorder({ countdown: false })
      );

      await act(async () => {
        await result.current.start();
      });

      expect(result.current.state).toBe("recording");
      expect(result.current.isRecording).toBe(true);
    });
  });

  describe("countdown", () => {
    it("should count down from initial value", async () => {
      const { result } = renderHook(() =>
        useScreenRecorder({ countdown: 3 })
      );

      await act(async () => {
        await result.current.start();
      });

      expect(result.current.countdownValue).toBe(3);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.countdownValue).toBe(2);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.countdownValue).toBe(1);
    });

    it("should transition to recording after countdown completes", async () => {
      const { result } = renderHook(() =>
        useScreenRecorder({ countdown: 2 })
      );

      await act(async () => {
        await result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.state).toBe("recording");
      expect(result.current.isRecording).toBe(true);
      expect(result.current.countdownValue).toBeNull();
    });
  });

  describe("recording", () => {
    it("should track elapsed time during recording", async () => {
      const { result } = renderHook(() =>
        useScreenRecorder({ countdown: false })
      );

      await act(async () => {
        await result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.elapsed).toBe(3);
      expect(result.current.elapsedFormatted).toBe("00:03");
    });

    it("should calculate remaining time with maxDuration", async () => {
      const { result } = renderHook(() =>
        useScreenRecorder({ countdown: false, maxDuration: 60 })
      );

      await act(async () => {
        await result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(result.current.remaining).toBe(50);
    });
  });

  describe("pause() and resume()", () => {
    it("should pause recording", async () => {
      const { result } = renderHook(() =>
        useScreenRecorder({ countdown: false })
      );

      await act(async () => {
        await result.current.start();
      });

      act(() => {
        result.current.pause();
      });

      expect(result.current.state).toBe("paused");
      expect(result.current.isPaused).toBe(true);
      expect(result.current.isRecording).toBe(false);
    });

    it("should resume recording", async () => {
      const { result } = renderHook(() =>
        useScreenRecorder({ countdown: false })
      );

      await act(async () => {
        await result.current.start();
      });

      act(() => {
        result.current.pause();
      });

      act(() => {
        result.current.resume();
      });

      expect(result.current.state).toBe("recording");
      expect(result.current.isPaused).toBe(false);
      expect(result.current.isRecording).toBe(true);
    });

    it("should toggle pause/resume with togglePause()", async () => {
      const { result } = renderHook(() =>
        useScreenRecorder({ countdown: false })
      );

      await act(async () => {
        await result.current.start();
      });

      act(() => {
        result.current.togglePause();
      });

      expect(result.current.isPaused).toBe(true);

      act(() => {
        result.current.togglePause();
      });

      expect(result.current.isPaused).toBe(false);
    });
  });

  describe("stop()", () => {
    it("should cancel countdown if stopped during countdown", async () => {
      const { result } = renderHook(() =>
        useScreenRecorder({ countdown: 3 })
      );

      await act(async () => {
        await result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.isCountingDown).toBe(true);

      act(() => {
        result.current.stop();
      });

      expect(result.current.state).toBe("idle");
      expect(result.current.isCountingDown).toBe(false);
    });
  });

  describe("error handling", () => {
    it("should transition to error state on permission denied", async () => {
      mockGetDisplayMedia({ shouldReject: true });

      const onError = vi.fn();
      const { result } = renderHook(() =>
        useScreenRecorder({ onError })
      );

      await act(async () => {
        await result.current.start();
      });

      expect(result.current.state).toBe("error");
      expect(result.current.error).not.toBeNull();
      expect(result.current.error?.code).toBe("PERMISSION_DENIED");
      expect(onError).toHaveBeenCalled();
    });
  });
});
