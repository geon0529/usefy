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
    <div
      style={{
        padding: "3rem",
        maxWidth: "500px",
        margin: "0 auto",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h2
        style={{
          marginBottom: "2rem",
          fontSize: "1.75rem",
          fontWeight: "700",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textAlign: "center",
        }}
      >
        useToggle Demo
      </h2>

      {/* Current State Display */}
      <div
        data-testid="state-display"
        role="status"
        aria-live="polite"
        style={{
          padding: "2rem",
          marginBottom: "2rem",
          background: value
            ? "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)"
            : "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
          color: value ? "#065f46" : "#991b1b",
          borderRadius: "1rem",
          textAlign: "center",
          fontSize: "2rem",
          fontWeight: "700",
          boxShadow: value
            ? "0 10px 25px rgba(16, 185, 129, 0.3)"
            : "0 10px 25px rgba(239, 68, 68, 0.3)",
          transition: "all 0.3s ease",
          textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
        }}
      >
        State: {value ? "TRUE" : "FALSE"}
      </div>

      {/* Control Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <button
          onClick={toggle}
          aria-label="Toggle the current state"
          type="button"
          style={{
            padding: "0.875rem 1.5rem",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            borderRadius: "0.75rem",
            border: "none",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 6px 16px rgba(102, 126, 234, 0.4)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(102, 126, 234, 0.3)";
          }}
        >
          ⇄ Toggle
        </button>

        <button
          onClick={setTrue}
          aria-label="Set state to true"
          type="button"
          style={{
            padding: "0.875rem 1.5rem",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            borderRadius: "0.75rem",
            border: "none",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 6px 16px rgba(16, 185, 129, 0.4)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(16, 185, 129, 0.3)";
          }}
        >
          ✓ Set True
        </button>

        <button
          onClick={setFalse}
          aria-label="Set state to false"
          type="button"
          style={{
            padding: "0.875rem 1.5rem",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            borderRadius: "0.75rem",
            border: "none",
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            color: "white",
            boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 6px 16px rgba(239, 68, 68, 0.4)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(239, 68, 68, 0.3)";
          }}
        >
          ✕ Set False
        </button>

        <button
          onClick={() => setValue(!value)}
          aria-label="Set state to opposite value"
          type="button"
          style={{
            padding: "0.875rem 1.5rem",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            borderRadius: "0.75rem",
            border: "2px solid #6b7280",
            background: "#ffffff",
            color: "#374151",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.background = "#f9fafb";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
          }}
        >
          ⟲ Set Value (opposite)
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
