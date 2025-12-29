import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useCopyToClipboard } from "@usefy/use-copy-to-clipboard";
import { within, userEvent, expect, waitFor } from "@storybook/test";
import { storyTheme } from "../styles/storyTheme";

/**
 * Demo component for useCopyToClipboard
 */
function CopyToClipboardDemo({
  timeout = 2000,
  showCallbacks = false,
}: {
  timeout?: number;
  showCallbacks?: boolean;
}) {
  const [inputText, setInputText] = useState("Hello, World!");
  const [lastAction, setLastAction] = useState<string | null>(null);

  const [copiedText, copy] = useCopyToClipboard({
    timeout,
    onSuccess: showCallbacks
      ? (text) => setLastAction(`Success: Copied "${text}"`)
      : undefined,
    onError: showCallbacks
      ? (error) => setLastAction(`Error: ${error.message}`)
      : undefined,
  });

  const isCopied = copiedText !== null;

  return (
    <div className={storyTheme.containerCentered}>
      <h2 className={storyTheme.title + " text-center mb-8"}>
        useCopyToClipboard Demo
      </h2>

      {/* Input Field */}
      <div className="mb-6">
        <label className={storyTheme.label}>Text to copy:</label>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className={storyTheme.input}
          data-testid="copy-input"
        />
      </div>

      {/* Copy Button */}
      <button
        onClick={() => copy(inputText)}
        data-testid="copy-button"
        aria-label="Copy text to clipboard"
        className={`w-full py-4 px-6 text-lg font-semibold border-none rounded-xl cursor-pointer transition-all duration-300 ${
          isCopied
            ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-[0_6px_20px_rgba(16,185,129,0.4)]"
            : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(99,102,241,0.4)]"
        }`}
      >
        {isCopied ? "Copied!" : "Copy to Clipboard"}
      </button>

      {/* Status Display */}
      <div className="mt-6">
        <div
          data-testid="status-display"
          role="status"
          aria-live="polite"
          className={storyTheme.statBox}
        >
          <p className={storyTheme.statLabel}>
            <span className={storyTheme.statTextSecondary}>Copied Text: </span>
            <span
              className={storyTheme.statValue}
              data-testid="copied-text-value"
            >
              {copiedText ?? "(none)"}
            </span>
          </p>
          <p className={storyTheme.statLabel + " mt-2"}>
            <span className={storyTheme.statTextSecondary}>Status: </span>
            <span
              className={isCopied ? "text-green-600" : "text-gray-500"}
              data-testid="copy-status"
            >
              {isCopied ? "Copied" : "Ready"}
            </span>
          </p>
        </div>
      </div>

      {/* Callback Messages */}
      {showCallbacks && lastAction && (
        <div
          className={
            lastAction.startsWith("Success")
              ? storyTheme.messageSuccess
              : storyTheme.messageError
          }
          data-testid="callback-message"
        >
          {lastAction}
        </div>
      )}

      {/* Info Box */}
      <div className={storyTheme.infoBox + " mt-6"}>
        <p className={storyTheme.infoText}>
          Timeout: {timeout === 0 ? "No auto-reset" : `${timeout}ms`}
        </p>
      </div>
    </div>
  );
}

/**
 * Demo with multiple copy targets
 */
function MultipleInputsDemo() {
  const [copiedText, copy] = useCopyToClipboard({ timeout: 2000 });

  const items = [
    { label: "Email", value: "example@email.com" },
    { label: "Phone", value: "+1-234-567-8900" },
    { label: "Address", value: "123 Main St, City, Country" },
    { label: "Code", value: "ABC-123-XYZ" },
  ];

  return (
    <div className={storyTheme.container}>
      <h2 className={storyTheme.title + " mb-8"}>Multiple Copy Targets</h2>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <div>
              <span className="text-sm text-gray-500">{item.label}</span>
              <p
                className="font-mono text-gray-800"
                data-testid={`value-${item.label.toLowerCase()}`}
              >
                {item.value}
              </p>
            </div>
            <button
              onClick={() => copy(item.value)}
              data-testid={`copy-${item.label.toLowerCase()}`}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                copiedText === item.value
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
              }`}
            >
              {copiedText === item.value ? "Copied!" : "Copy"}
            </button>
          </div>
        ))}
      </div>

      {copiedText && (
        <div className={storyTheme.messageSuccess + " mt-4"}>
          Last copied: {copiedText}
        </div>
      )}
    </div>
  );
}

const meta: Meta<typeof CopyToClipboardDemo> = {
  title: "Hooks/useCopyToClipboard",
  component: CopyToClipboardDemo,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A hook for copying text to the clipboard using the Clipboard API with fallback support for older browsers.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    timeout: {
      control: { type: "number" },
      description:
        "Time in milliseconds before copiedText resets to null. Set to 0 to disable auto-reset.",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "2000" },
      },
    },
    showCallbacks: {
      control: "boolean",
      description: "Show callback messages (onSuccess/onError)",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CopyToClipboardDemo>;

/**
 * Default usage with 2 second timeout
 */
export const Default: Story = {
  args: {
    timeout: 2000,
    showCallbacks: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initial state
    await expect(canvas.getByTestId("copied-text-value")).toHaveTextContent(
      "(none)"
    );
    await expect(canvas.getByTestId("copy-status")).toHaveTextContent("Ready");

    // Click copy button
    await userEvent.click(canvas.getByTestId("copy-button"));

    // Should show copied state
    await waitFor(() => {
      expect(canvas.getByTestId("copy-button")).toHaveTextContent("Copied!");
    });
    await expect(canvas.getByTestId("copy-status")).toHaveTextContent("Copied");
  },
};

/**
 * With callback messages displayed
 */
export const WithCallbacks: Story = {
  args: {
    timeout: 2000,
    showCallbacks: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click copy button
    await userEvent.click(canvas.getByTestId("copy-button"));

    // Should show success callback message
    await waitFor(() => {
      expect(canvas.getByTestId("callback-message")).toBeInTheDocument();
    });
  },
};

/**
 * No auto-reset (timeout: 0)
 */
export const NoAutoReset: Story = {
  args: {
    timeout: 0,
    showCallbacks: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click copy button
    await userEvent.click(canvas.getByTestId("copy-button"));

    // Should show copied state
    await waitFor(() => {
      expect(canvas.getByTestId("copy-status")).toHaveTextContent("Copied");
    });

    // Verify info shows no auto-reset
    await expect(canvas.getByText("Timeout: No auto-reset")).toBeInTheDocument();
  },
};

/**
 * Custom timeout (5 seconds)
 */
export const LongTimeout: Story = {
  args: {
    timeout: 5000,
    showCallbacks: false,
  },
};

/**
 * Multiple copy targets demo
 */
export const MultipleInputs: StoryObj<typeof MultipleInputsDemo> = {
  render: () => <MultipleInputsDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Copy email
    await userEvent.click(canvas.getByTestId("copy-email"));

    await waitFor(() => {
      expect(canvas.getByTestId("copy-email")).toHaveTextContent("Copied!");
    });

    // Copy phone (should switch the copied state)
    await userEvent.click(canvas.getByTestId("copy-phone"));

    await waitFor(() => {
      expect(canvas.getByTestId("copy-phone")).toHaveTextContent("Copied!");
      expect(canvas.getByTestId("copy-email")).toHaveTextContent("Copy");
    });
  },
};

/**
 * Custom text input
 */
export const CustomText: Story = {
  args: {
    timeout: 2000,
    showCallbacks: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Clear and type custom text
    const input = canvas.getByTestId("copy-input");
    await userEvent.clear(input);
    await userEvent.type(input, "Custom copied text!");

    // Copy the custom text
    await userEvent.click(canvas.getByTestId("copy-button"));

    // Verify the custom text was copied
    await waitFor(() => {
      expect(canvas.getByTestId("copied-text-value")).toHaveTextContent(
        "Custom copied text!"
      );
    });
  },
};
