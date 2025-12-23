import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useCounter } from "./useCounter";
import { within, userEvent, expect } from "storybook/test";

function CounterDemo({ initialValue = 0 }: { initialValue?: number }) {
  const { count, increment, decrement, reset } = useCounter(initialValue);

  return (
    <div
      style={{
        padding: "3rem",
        textAlign: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "600",
          color: "#1f2937",
          marginBottom: "2rem",
        }}
      >
        useCounter Hook Demo
      </h2>
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "1rem",
          padding: "2rem",
          marginBottom: "2rem",
          boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)",
        }}
      >
        <p
          data-testid="count"
          style={{
            fontSize: "4rem",
            fontWeight: "700",
            color: "#ffffff",
            margin: "0",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          {count}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          data-testid="decrement-btn"
          onClick={decrement}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            fontWeight: "600",
            color: "#ffffff",
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 12px rgba(245, 87, 108, 0.3)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 6px 16px rgba(245, 87, 108, 0.4)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(245, 87, 108, 0.3)";
          }}
        >
          − Decrement
        </button>
        <button
          data-testid="reset-btn"
          onClick={reset}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            fontWeight: "600",
            color: "#374151",
            background: "#f3f4f6",
            border: "2px solid #e5e7eb",
            borderRadius: "0.5rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.background = "#e5e7eb";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.background = "#f3f4f6";
            e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.1)";
          }}
        >
          ↻ Reset
        </button>
        <button
          data-testid="increment-btn"
          onClick={increment}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            fontWeight: "600",
            color: "#ffffff",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
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
          + Increment
        </button>
      </div>
    </div>
  );
}

const meta: Meta<typeof CounterDemo> = {
  title: "Hooks/useCounter",
  component: CounterDemo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    initialValue: {
      control: { type: "number" },
      description: "Initial count value",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CounterDemo>;

export const Default: Story = {
  args: {
    initialValue: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initial state
    await expect(canvas.getByTestId("count")).toHaveTextContent("0");

    // Test increment
    await userEvent.click(canvas.getByTestId("increment-btn"));
    await expect(canvas.getByTestId("count")).toHaveTextContent("1");

    // Test multiple increments
    await userEvent.click(canvas.getByTestId("increment-btn"));
    await userEvent.click(canvas.getByTestId("increment-btn"));
    await expect(canvas.getByTestId("count")).toHaveTextContent("3");

    // Test decrement
    await userEvent.click(canvas.getByTestId("decrement-btn"));
    await expect(canvas.getByTestId("count")).toHaveTextContent("2");

    // Test reset
    await userEvent.click(canvas.getByTestId("reset-btn"));
    await expect(canvas.getByTestId("count")).toHaveTextContent("0");
  },
};

export const WithInitialValue: Story = {
  args: {
    initialValue: 10,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify initial value
    await expect(canvas.getByTestId("count")).toHaveTextContent("10");

    // Test increment from initial value
    await userEvent.click(canvas.getByTestId("increment-btn"));
    await expect(canvas.getByTestId("count")).toHaveTextContent("11");

    // Test decrement
    await userEvent.click(canvas.getByTestId("decrement-btn"));
    await userEvent.click(canvas.getByTestId("decrement-btn"));
    await expect(canvas.getByTestId("count")).toHaveTextContent("9");

    // Test reset returns to initial value
    await userEvent.click(canvas.getByTestId("reset-btn"));
    await expect(canvas.getByTestId("count")).toHaveTextContent("10");
  },
};

export const WithNegativeInitialValue: Story = {
  args: {
    initialValue: -5,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify negative initial value
    await expect(canvas.getByTestId("count")).toHaveTextContent("-5");

    // Test increment from negative
    await userEvent.click(canvas.getByTestId("increment-btn"));
    await expect(canvas.getByTestId("count")).toHaveTextContent("-4");

    // Test decrement to more negative
    await userEvent.click(canvas.getByTestId("reset-btn"));
    await userEvent.click(canvas.getByTestId("decrement-btn"));
    await expect(canvas.getByTestId("count")).toHaveTextContent("-6");
  },
};

export const LargeInitialValue: Story = {
  args: {
    initialValue: 100,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByTestId("count")).toHaveTextContent("100");

    // Test operations with large numbers
    await userEvent.click(canvas.getByTestId("increment-btn"));
    await expect(canvas.getByTestId("count")).toHaveTextContent("101");

    await userEvent.click(canvas.getByTestId("decrement-btn"));
    await userEvent.click(canvas.getByTestId("decrement-btn"));
    await expect(canvas.getByTestId("count")).toHaveTextContent("99");
  },
};

export const RapidClicks: Story = {
  args: {
    initialValue: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test rapid increment clicks
    await userEvent.click(canvas.getByTestId("increment-btn"));
    await userEvent.click(canvas.getByTestId("increment-btn"));
    await userEvent.click(canvas.getByTestId("increment-btn"));
    await userEvent.click(canvas.getByTestId("increment-btn"));
    await userEvent.click(canvas.getByTestId("increment-btn"));
    await expect(canvas.getByTestId("count")).toHaveTextContent("5");

    // Test rapid decrement clicks
    await userEvent.click(canvas.getByTestId("decrement-btn"));
    await userEvent.click(canvas.getByTestId("decrement-btn"));
    await userEvent.click(canvas.getByTestId("decrement-btn"));
    await expect(canvas.getByTestId("count")).toHaveTextContent("2");

    // Test reset after rapid changes
    await userEvent.click(canvas.getByTestId("reset-btn"));
    await expect(canvas.getByTestId("count")).toHaveTextContent("0");
  },
};

export const CrossingZero: Story = {
  args: {
    initialValue: 2,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Start at 2
    await expect(canvas.getByTestId("count")).toHaveTextContent("2");

    // Go through zero to negative
    await userEvent.click(canvas.getByTestId("decrement-btn"));
    await expect(canvas.getByTestId("count")).toHaveTextContent("1");

    await userEvent.click(canvas.getByTestId("decrement-btn"));
    await expect(canvas.getByTestId("count")).toHaveTextContent("0");

    await userEvent.click(canvas.getByTestId("decrement-btn"));
    await expect(canvas.getByTestId("count")).toHaveTextContent("-1");

    // Come back through zero to positive
    await userEvent.click(canvas.getByTestId("increment-btn"));
    await expect(canvas.getByTestId("count")).toHaveTextContent("0");

    await userEvent.click(canvas.getByTestId("increment-btn"));
    await expect(canvas.getByTestId("count")).toHaveTextContent("1");
  },
};
