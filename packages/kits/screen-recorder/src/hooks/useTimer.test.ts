import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTimer, formatTime } from "./useTimer";

describe("useTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initial state", () => {
    it("should start with elapsed time of 0", () => {
      const { result } = renderHook(() => useTimer());

      expect(result.current.elapsed).toBe(0);
      expect(result.current.elapsedFormatted).toBe("00:00");
      expect(result.current.isRunning).toBe(false);
    });

    it("should calculate remaining time correctly when maxDuration is set", () => {
      const { result } = renderHook(() => useTimer({ maxDuration: 60 }));

      expect(result.current.remaining).toBe(60);
    });

    it("should return null for remaining when no maxDuration", () => {
      const { result } = renderHook(() => useTimer());

      expect(result.current.remaining).toBeNull();
    });
  });

  describe("start", () => {
    it("should start the timer", () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(true);
    });

    it("should increment elapsed time", () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.elapsed).toBe(3);
      expect(result.current.elapsedFormatted).toBe("00:03");
    });
  });

  describe("stop", () => {
    it("should stop the timer", () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      act(() => {
        result.current.stop();
      });

      expect(result.current.isRunning).toBe(false);

      // Timer should not advance after stop
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.elapsed).toBe(2);
    });
  });

  describe("pause and resume", () => {
    it("should pause the timer", () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      act(() => {
        result.current.pause();
      });

      const pausedElapsed = result.current.elapsed;

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Elapsed should not change while paused
      expect(result.current.elapsed).toBe(pausedElapsed);
    });

    it("should resume after pause", () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      act(() => {
        result.current.pause();
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      act(() => {
        result.current.resume();
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.elapsed).toBe(4); // 2 + 2, not counting pause time
    });
  });

  describe("reset", () => {
    it("should reset to initial state", () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.elapsed).toBe(0);
      expect(result.current.isRunning).toBe(false);
    });
  });

  describe("callbacks", () => {
    it("should call onTick every second", () => {
      const onTick = vi.fn();
      const { result } = renderHook(() => useTimer({ onTick }));

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(onTick).toHaveBeenCalledTimes(3);
    });

    it("should call onComplete when max duration reached", () => {
      const onComplete = vi.fn();
      const { result } = renderHook(() =>
        useTimer({ maxDuration: 3, onComplete })
      );

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(4000);
      });

      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(result.current.isRunning).toBe(false);
    });
  });
});

describe("formatTime", () => {
  it("should format seconds as MM:SS", () => {
    expect(formatTime(0)).toBe("00:00");
    expect(formatTime(5)).toBe("00:05");
    expect(formatTime(65)).toBe("01:05");
    expect(formatTime(3661)).toBe("61:01");
  });
});
