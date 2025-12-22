import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useToggle } from "./useToggle";
import { within, userEvent, expect } from "storybook/test";

/**
 * Demo component for useToggle
 */
function ToggleDemo({ initialValue = false }: { initialValue?: boolean }) {
  const { value, toggle, setTrue, setFalse, setValue } =
    useToggle(initialValue);

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1rem" }}>useToggle Demo</h2>

      {/* Current State Display */}
      <div
        data-testid="state-display"
        role="status"
        aria-live="polite"
        style={{
          padding: "1rem",
          marginBottom: "2rem",
          backgroundColor: value ? "#d4edda" : "#f8d7da",
          color: value ? "#155724" : "#721c24",
          borderRadius: "4px",
          textAlign: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
        }}
      >
        State: {value ? "TRUE" : "FALSE"}
      </div>

      {/* Control Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <button
          onClick={toggle}
          aria-label="Toggle the current state"
          type="button"
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            cursor: "pointer",
            borderRadius: "4px",
            border: "2px solid #007bff",
            backgroundColor: "#007bff",
            color: "white",
          }}
        >
          Toggle
        </button>

        <button
          onClick={setTrue}
          aria-label="Set state to true"
          type="button"
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            cursor: "pointer",
            borderRadius: "4px",
            border: "2px solid #28a745",
            backgroundColor: "#28a745",
            color: "white",
          }}
        >
          Set True
        </button>

        <button
          onClick={setFalse}
          aria-label="Set state to false"
          type="button"
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            cursor: "pointer",
            borderRadius: "4px",
            border: "2px solid #dc3545",
            backgroundColor: "#dc3545",
            color: "white",
          }}
        >
          Set False
        </button>

        <button
          onClick={() => setValue(!value)}
          aria-label="Set state to opposite value"
          type="button"
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            cursor: "pointer",
            borderRadius: "4px",
            border: "2px solid #6c757d",
            backgroundColor: "#6c757d",
            color: "white",
          }}
        >
          Set Value (opposite)
        </button>
      </div>
    </div>
  );
}

const meta: Meta<typeof ToggleDemo> = {
  title: "Hooks/useToggle",
  component: ToggleDemo,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A hook for managing boolean state with helpful utilities. Perfect for modals, dropdowns, and any on/off state management.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    initialValue: {
      control: "boolean",
      description: "Initial boolean value",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ToggleDemo>;

/**
 * Default story starting with false
 */
export const Default: Story = {
  args: {
    initialValue: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initial state should be FALSE
    await expect(canvas.getByTestId("state-display")).toHaveTextContent(
      "FALSE"
    );

    // Click Toggle button - should become TRUE
    await userEvent.click(
      canvas.getByRole("button", { name: /toggle the current state/i })
    );
    await expect(canvas.getByTestId("state-display")).toHaveTextContent("TRUE");

    // Click Toggle again - should become FALSE
    await userEvent.click(
      canvas.getByRole("button", { name: /toggle the current state/i })
    );
    await expect(canvas.getByTestId("state-display")).toHaveTextContent(
      "FALSE"
    );

    // Click Set True - should be TRUE
    await userEvent.click(
      canvas.getByRole("button", { name: /set state to true/i })
    );
    await expect(canvas.getByTestId("state-display")).toHaveTextContent("TRUE");

    // Click Set False - should be FALSE
    await userEvent.click(
      canvas.getByRole("button", { name: /set state to false/i })
    );
    await expect(canvas.getByTestId("state-display")).toHaveTextContent(
      "FALSE"
    );
  },
};

/**
 * Story starting with true
 */
export const StartingTrue: Story = {
  args: {
    initialValue: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initial state should be TRUE
    await expect(canvas.getByTestId("state-display")).toHaveTextContent("TRUE");

    // Click Toggle - should become FALSE
    await userEvent.click(
      canvas.getByRole("button", { name: /toggle the current state/i })
    );
    await expect(canvas.getByTestId("state-display")).toHaveTextContent(
      "FALSE"
    );
  },
};

/**
 * Testing setValue function
 */
export const SetValueFunction: Story = {
  args: {
    initialValue: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initial state should be FALSE
    await expect(canvas.getByTestId("state-display")).toHaveTextContent(
      "FALSE"
    );

    // Click "Set Value (opposite)" - should become TRUE
    await userEvent.click(
      canvas.getByRole("button", { name: /set state to opposite value/i })
    );
    await expect(canvas.getByTestId("state-display")).toHaveTextContent("TRUE");

    // Click "Set Value (opposite)" again - should become FALSE
    await userEvent.click(
      canvas.getByRole("button", { name: /set state to opposite value/i })
    );
    await expect(canvas.getByTestId("state-display")).toHaveTextContent(
      "FALSE"
    );
  },
};

/**
 * Idempotent operations - calling setTrue/setFalse multiple times
 */
export const IdempotentOperations: Story = {
  args: {
    initialValue: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click Set True multiple times - should stay TRUE
    await userEvent.click(
      canvas.getByRole("button", { name: /set state to true/i })
    );
    await expect(canvas.getByTestId("state-display")).toHaveTextContent("TRUE");

    await userEvent.click(
      canvas.getByRole("button", { name: /set state to true/i })
    );
    await expect(canvas.getByTestId("state-display")).toHaveTextContent("TRUE");

    // Click Set False multiple times - should stay FALSE
    await userEvent.click(
      canvas.getByRole("button", { name: /set state to false/i })
    );
    await expect(canvas.getByTestId("state-display")).toHaveTextContent(
      "FALSE"
    );

    await userEvent.click(
      canvas.getByRole("button", { name: /set state to false/i })
    );
    await expect(canvas.getByTestId("state-display")).toHaveTextContent(
      "FALSE"
    );
  },
};
