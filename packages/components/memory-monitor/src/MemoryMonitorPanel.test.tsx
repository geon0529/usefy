import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryMonitorPanel } from "./MemoryMonitorPanel";
import {
  mockSupportedBrowser,
  mockUnsupportedBrowser,
} from "../vitest.setup";

describe("MemoryMonitorPanel", () => {
  beforeEach(() => {
    // Mock supported browser by default
    mockSupportedBrowser();
    // Mock development environment
    vi.stubEnv("NODE_ENV", "development");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("Rendering", () => {
    it("renders trigger button by default", () => {
      render(<MemoryMonitorPanel />);

      // Should render trigger button when closed
      const trigger = screen.getByRole("button");
      expect(trigger).toBeInTheDocument();
    });

    it("does not render in production mode by default", () => {
      vi.stubEnv("NODE_ENV", "production");

      const { container } = render(<MemoryMonitorPanel />);

      expect(container.firstChild).toBeNull();
    });

    it("renders in production when mode is 'always'", () => {
      vi.stubEnv("NODE_ENV", "production");

      render(<MemoryMonitorPanel mode="always" />);

      const trigger = screen.getByRole("button");
      expect(trigger).toBeInTheDocument();
    });

    it("renders panel when defaultOpen is true", () => {
      render(<MemoryMonitorPanel defaultOpen />);

      expect(screen.getByText("Memory Monitor")).toBeInTheDocument();
    });

    it("does not render when mode is 'never'", () => {
      const { container } = render(<MemoryMonitorPanel mode="never" />);

      expect(container.firstChild).toBeNull();
    });

    it("hides trigger when showTrigger is false", () => {
      render(<MemoryMonitorPanel showTrigger={false} />);

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("Panel Interactions", () => {
    it("opens panel when trigger is clicked", async () => {
      render(<MemoryMonitorPanel />);

      const trigger = screen.getByRole("button");
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Memory Monitor")).toBeInTheDocument();
      });
    });

    it("closes panel when close button is clicked", async () => {
      render(<MemoryMonitorPanel defaultOpen />);

      expect(screen.getByText("Memory Monitor")).toBeInTheDocument();

      const closeButton = screen.getByLabelText("Close panel");
      fireEvent.click(closeButton);

      // Panel should be hidden (aria-hidden becomes true)
      await waitFor(() => {
        const panel = screen.getByRole("dialog", { hidden: true });
        expect(panel).toHaveAttribute("aria-hidden", "true");
      });
    });

    it("calls onOpenChange when panel opens", async () => {
      const onOpenChange = vi.fn();
      render(<MemoryMonitorPanel onOpenChange={onOpenChange} />);

      const trigger = screen.getByRole("button");
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(true);
      });
    });

    it("calls onOpenChange when panel closes", async () => {
      const onOpenChange = vi.fn();
      render(<MemoryMonitorPanel defaultOpen onOpenChange={onOpenChange} />);

      const closeButton = screen.getByLabelText("Close panel");
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe("Tab Navigation", () => {
    it("shows overview tab by default", () => {
      render(<MemoryMonitorPanel defaultOpen />);

      const overviewTab = screen.getByRole("tab", { name: /overview/i });
      expect(overviewTab).toHaveAttribute("aria-selected", "true");
    });

    it("switches to history tab when clicked", async () => {
      render(<MemoryMonitorPanel defaultOpen />);

      const historyTab = screen.getByRole("tab", { name: /history/i });
      fireEvent.click(historyTab);

      await waitFor(() => {
        expect(historyTab).toHaveAttribute("aria-selected", "true");
      });
    });

    it("switches to snapshots tab when clicked", async () => {
      render(<MemoryMonitorPanel defaultOpen />);

      const snapshotsTab = screen.getByRole("tab", { name: /snapshots/i });
      fireEvent.click(snapshotsTab);

      await waitFor(() => {
        expect(snapshotsTab).toHaveAttribute("aria-selected", "true");
      });
    });

    it("switches to settings tab when clicked", async () => {
      render(<MemoryMonitorPanel defaultOpen />);

      const settingsTab = screen.getByRole("tab", { name: /settings/i });
      fireEvent.click(settingsTab);

      await waitFor(() => {
        expect(settingsTab).toHaveAttribute("aria-selected", "true");
      });
    });
  });

  describe("Keyboard Shortcuts", () => {
    it("toggles panel with Ctrl+Shift+M", async () => {
      render(<MemoryMonitorPanel />);

      // Initially closed - panel exists but is hidden (aria-hidden="true")
      const hiddenPanel = screen.getByRole("dialog", { hidden: true });
      expect(hiddenPanel).toHaveAttribute("aria-hidden", "true");

      // Press shortcut
      fireEvent.keyDown(document, {
        key: "m",
        ctrlKey: true,
        shiftKey: true,
      });

      await waitFor(() => {
        const panel = screen.getByRole("dialog");
        expect(panel).toHaveAttribute("aria-hidden", "false");
      });
    });

    it("closes panel with Escape key", async () => {
      render(<MemoryMonitorPanel defaultOpen />);

      const panel = screen.getByRole("dialog");
      expect(panel).toHaveAttribute("aria-hidden", "false");

      fireEvent.keyDown(document, { key: "Escape" });

      // Panel should be hidden (aria-hidden becomes true)
      await waitFor(() => {
        expect(panel).toHaveAttribute("aria-hidden", "true");
      });
    });

    it("respects custom shortcut", async () => {
      render(<MemoryMonitorPanel shortcut="ctrl+shift+k" />);

      // Initially closed
      const hiddenPanel = screen.getByRole("dialog", { hidden: true });
      expect(hiddenPanel).toHaveAttribute("aria-hidden", "true");

      // Default shortcut should not work
      fireEvent.keyDown(document, {
        key: "m",
        ctrlKey: true,
        shiftKey: true,
      });

      // Still closed
      expect(hiddenPanel).toHaveAttribute("aria-hidden", "true");

      // Custom shortcut should work
      fireEvent.keyDown(document, {
        key: "k",
        ctrlKey: true,
        shiftKey: true,
      });

      await waitFor(() => {
        expect(hiddenPanel).toHaveAttribute("aria-hidden", "false");
      });
    });
  });

  describe("Unsupported Browser", () => {
    it("still renders panel in unsupported browser", () => {
      mockUnsupportedBrowser();

      render(<MemoryMonitorPanel defaultOpen />);

      expect(screen.getByText("Memory Monitor")).toBeInTheDocument();
    });
  });

  describe("Props Customization", () => {
    it("applies custom zIndex", () => {
      render(<MemoryMonitorPanel defaultOpen zIndex={5000} />);

      const panel = screen.getByRole("dialog");
      expect(panel).toHaveStyle({ zIndex: "5000" });
    });

    it("applies custom className", () => {
      render(<MemoryMonitorPanel defaultOpen className="custom-class" />);

      const panel = screen.getByRole("dialog");
      expect(panel).toHaveClass("custom-class");
    });

    it("renders on left position", () => {
      render(<MemoryMonitorPanel defaultOpen position="left" />);

      const panel = screen.getByRole("dialog");
      expect(panel).toHaveClass("left-0");
    });
  });

  describe("Custom Trigger", () => {
    it("renders custom trigger content", () => {
      render(
        <MemoryMonitorPanel
          triggerContent={<span data-testid="custom-trigger">Custom</span>}
        />
      );

      expect(screen.getByTestId("custom-trigger")).toBeInTheDocument();
    });
  });
});
