import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useClickAnyWhere } from "@usefy/use-click-any-where";
import { within, userEvent, expect, waitFor } from "@storybook/test";
import { storyTheme } from "../styles/storyTheme";

/**
 * Demo component for useClickAnyWhere - Click Counter
 */
function ClickCounterDemo({ enabled = true }: { enabled?: boolean }) {
  const [clickCount, setClickCount] = useState(0);

  useClickAnyWhere(
    () => {
      setClickCount((prev) => prev + 1);
    },
    { enabled }
  );

  return (
    <div className={storyTheme.containerCentered}>
      <h2 className={storyTheme.title + " text-center mb-8"}>
        useClickAnyWhere Demo
      </h2>

      <div className={storyTheme.gradientBox + " text-center mb-6"}>
        <p className="text-white/80 text-sm mb-2">Total Clicks</p>
        <p
          className="text-6xl font-bold text-white"
          data-testid="click-count"
        >
          {clickCount}
        </p>
      </div>

      <div className={storyTheme.statBox}>
        <p className={storyTheme.statLabel}>
          <span className={storyTheme.statTextSecondary}>Status: </span>
          <span
            className={enabled ? "text-green-600" : "text-red-500"}
            data-testid="enabled-status"
          >
            {enabled ? "Listening" : "Disabled"}
          </span>
        </p>
      </div>

      <div className={storyTheme.infoBox + " mt-6"}>
        <p className={storyTheme.infoText}>
          Click anywhere on the page to increment the counter.
        </p>
      </div>
    </div>
  );
}

/**
 * Demo component for click position tracking
 */
function ClickPositionDemo() {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );
  const [clickHistory, setClickHistory] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);

  useClickAnyWhere((event) => {
    const newPosition = { x: event.clientX, y: event.clientY };
    setPosition(newPosition);
    setClickHistory((prev) => [
      { ...newPosition, id: Date.now() },
      ...prev.slice(0, 4),
    ]);
  });

  return (
    <div className={storyTheme.containerCentered}>
      <h2 className={storyTheme.title + " text-center mb-8"}>
        Click Position Tracker
      </h2>

      <div className={storyTheme.gradientBox + " text-center mb-6"}>
        {position ? (
          <>
            <p className="text-white/80 text-sm mb-2">Last Click Position</p>
            <p className="text-3xl font-bold text-white" data-testid="position">
              ({position.x}, {position.y})
            </p>
          </>
        ) : (
          <p className="text-white/80 text-lg" data-testid="no-click-message">
            Click anywhere to see position
          </p>
        )}
      </div>

      {clickHistory.length > 0 && (
        <div className={storyTheme.statBox}>
          <p className={storyTheme.statLabel + " mb-3"}>Recent Clicks:</p>
          <div className="space-y-2">
            {clickHistory.map((click, index) => (
              <div
                key={click.id}
                className={`text-sm ${
                  index === 0 ? "text-indigo-600 font-medium" : "text-gray-500"
                }`}
              >
                ({click.x}, {click.y})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Demo component for conditional activation
 */
function ConditionalDemo() {
  const [isActive, setIsActive] = useState(true);
  const [clickCount, setClickCount] = useState(0);

  useClickAnyWhere(
    () => {
      setClickCount((prev) => prev + 1);
    },
    { enabled: isActive }
  );

  return (
    <div className={storyTheme.containerCentered}>
      <h2 className={storyTheme.title + " text-center mb-8"}>
        Conditional Activation
      </h2>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsActive((prev) => !prev);
        }}
        data-testid="toggle-button"
        className={`w-full py-4 px-6 text-lg font-semibold border-none rounded-xl cursor-pointer transition-all duration-300 mb-6 ${
          isActive
            ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-[0_6px_20px_rgba(16,185,129,0.4)]"
            : "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-[0_6px_20px_rgba(239,68,68,0.4)]"
        }`}
      >
        {isActive ? "Active - Click to Disable" : "Disabled - Click to Enable"}
      </button>

      <div className={storyTheme.statBox}>
        <p className={storyTheme.statLabel}>
          <span className={storyTheme.statTextSecondary}>Clicks Detected: </span>
          <span className={storyTheme.statValue} data-testid="conditional-count">
            {clickCount}
          </span>
        </p>
        <p className={storyTheme.statLabel + " mt-2"}>
          <span className={storyTheme.statTextSecondary}>Listener: </span>
          <span
            className={isActive ? "text-green-600" : "text-red-500"}
            data-testid="listener-status"
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </p>
      </div>

      <div className={storyTheme.infoBox + " mt-6"}>
        <p className={storyTheme.infoText}>
          Toggle the button to enable/disable click detection.
          <br />
          Clicks are only counted when the listener is active.
        </p>
      </div>
    </div>
  );
}

const meta: Meta<typeof ClickCounterDemo> = {
  title: "Hooks/useClickAnyWhere",
  component: ClickCounterDemo,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A hook for detecting document-wide click events. Useful for closing dropdowns, modals, or tracking user interactions.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    enabled: {
      control: "boolean",
      description: "Whether the click listener is active",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ClickCounterDemo>;

/**
 * Default click counter demo
 */
export const Default: Story = {
  args: {
    enabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initial state
    await expect(canvas.getByTestId("click-count")).toHaveTextContent("0");
    await expect(canvas.getByTestId("enabled-status")).toHaveTextContent(
      "Listening"
    );

    // Click on the canvas (simulates document click)
    await userEvent.click(canvasElement);

    // Count should increase
    await waitFor(() => {
      expect(canvas.getByTestId("click-count")).toHaveTextContent("1");
    });
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    enabled: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Should show disabled status
    await expect(canvas.getByTestId("enabled-status")).toHaveTextContent(
      "Disabled"
    );
    await expect(canvas.getByTestId("click-count")).toHaveTextContent("0");

    // Click should not increment
    await userEvent.click(canvasElement);

    await expect(canvas.getByTestId("click-count")).toHaveTextContent("0");
  },
};

/**
 * Click position tracker
 */
export const ClickPosition: StoryObj<typeof ClickPositionDemo> = {
  render: () => <ClickPositionDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initial state - no position
    await expect(canvas.getByTestId("no-click-message")).toBeInTheDocument();

    // Click to track position
    await userEvent.click(canvasElement);

    // Should show position
    await waitFor(() => {
      expect(canvas.getByTestId("position")).toBeInTheDocument();
    });
  },
};

/**
 * Conditional activation demo
 */
export const ConditionalActivation: StoryObj<typeof ConditionalDemo> = {
  render: () => <ConditionalDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initial state - active
    await expect(canvas.getByTestId("listener-status")).toHaveTextContent(
      "Active"
    );

    // Click to increment
    await userEvent.click(canvasElement);
    await waitFor(() => {
      expect(canvas.getByTestId("conditional-count")).toHaveTextContent("1");
    });

    // Toggle to disable
    await userEvent.click(canvas.getByTestId("toggle-button"));
    await expect(canvas.getByTestId("listener-status")).toHaveTextContent(
      "Inactive"
    );

    // Click should not increment when disabled
    await userEvent.click(canvasElement);
    await expect(canvas.getByTestId("conditional-count")).toHaveTextContent("1");
  },
};
