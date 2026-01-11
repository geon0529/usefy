import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCountdown } from "./useCountdown";

describe("useCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initial state", () => {
    it("should start with null value and not active", () => {
      const { result } = renderHook(() => useCountdown());

      expect(result.current.value).toBeNull();
      expect(result.current.isActive).toBe(false);
    });
  });

  describe("start", () => {
    it("should start countdown with initial value", () => {
      const { result } = renderHook(() =>
        useCountdown({ initialValue: 3 })
      );

      act(() => {
        result.current.start();
      });

      expect(result.current.value).toBe(3);
      expect(result.current.isActive).toBe(true);
    });

    it("should decrement value every second", () => {
      const { result } = renderHook(() =>
        useCountdown({ initialValue: 3 })
      );

      act(() => {
        result.current.start();
      });

      expect(result.current.value).toBe(3);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.value).toBe(2);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.value).toBe(1);
    });

    it("should complete and become inactive when reaching 0", () => {
      const { result } = renderHook(() =>
        useCountdown({ initialValue: 2 })
      );

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.value).toBeNull();
      expect(result.current.isActive).toBe(false);
    });
  });

  describe("cancel", () => {
    it("should stop countdown and reset state", () => {
      const { result } = renderHook(() =>
        useCountdown({ initialValue: 3 })
      );

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      act(() => {
        result.current.cancel();
      });

      expect(result.current.value).toBeNull();
      expect(result.current.isActive).toBe(false);
    });
  });

  describe("callbacks", () => {
    it("should call onComplete when countdown finishes", () => {
      const onComplete = vi.fn();
      const { result } = renderHook(() =>
        useCountdown({ initialValue: 2, onComplete })
      );

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it("should call runtime onComplete passed to start()", () => {
      const runtimeOnComplete = vi.fn();
      const { result } = renderHook(() =>
        useCountdown({ initialValue: 2 })
      );

      act(() => {
        result.current.start(runtimeOnComplete);
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(runtimeOnComplete).toHaveBeenCalledTimes(1);
    });

    it("should call onTick on each countdown tick", () => {
      const onTick = vi.fn();
      const { result } = renderHook(() =>
        useCountdown({ initialValue: 3, onTick })
      );

      act(() => {
        result.current.start();
      });

      // Initial tick with value 3
      expect(onTick).toHaveBeenCalledWith(3);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(onTick).toHaveBeenCalledWith(2);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(onTick).toHaveBeenCalledWith(1);
    });
  });

  describe("cleanup", () => {
    it("should cleanup interval on unmount", () => {
      const { result, unmount } = renderHook(() =>
        useCountdown({ initialValue: 3 })
      );

      act(() => {
        result.current.start();
      });

      unmount();

      // Should not throw or cause issues
      act(() => {
        vi.advanceTimersByTime(5000);
      });
    });
  });
});
