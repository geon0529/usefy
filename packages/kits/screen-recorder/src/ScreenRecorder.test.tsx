import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ScreenRecorder } from "./ScreenRecorder";
import { mockGetDisplayMedia } from "../vitest.setup";

describe("ScreenRecorder", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockGetDisplayMedia();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("rendering", () => {
    it("should render trigger button in idle state", () => {
      render(<ScreenRecorder renderMode="inline" />);

      const trigger = screen.getByRole("button", {
        name: /start screen recording/i,
      });
      expect(trigger).toBeInTheDocument();
    });

    it("should render custom trigger content", () => {
      render(<ScreenRecorder triggerContent="Record my screen" renderMode="inline" />);

      expect(screen.getByText("Record my screen")).toBeInTheDocument();
    });

    it("should render disabled trigger when disabled prop is true", () => {
      render(<ScreenRecorder disabled renderMode="inline" />);

      const trigger = screen.getByRole("button");
      expect(trigger).toBeDisabled();
    });
  });

  describe("position", () => {
    it("should apply position classes", () => {
      render(<ScreenRecorder position="top-left" renderMode="inline" />);

      const trigger = screen.getByRole("button", {
        name: /start screen recording/i,
      });
      // With CSS Modules, class names are scoped with hashes
      // Check for the position-related class name pattern
      expect(trigger.className).toMatch(/topLeft/i);
    });
  });

});
