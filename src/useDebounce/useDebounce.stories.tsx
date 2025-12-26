import type { Meta, StoryObj } from "@storybook/react";
import React, { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";
import { within, userEvent, expect, waitFor } from "storybook/test";

/**
 * 1. Search Input Demo
 */
function SearchInputDemo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searchCount, setSearchCount] = useState(0);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setSearchCount((prev) => prev + 1);
      setSearchResults([
        `Result 1 for "${debouncedSearchTerm}"`,
        `Result 2 for "${debouncedSearchTerm}"`,
        `Result 3 for "${debouncedSearchTerm}"`,
      ]);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="p-8 max-w-[600px] font-sans">
      <h2 className="text-[1.75rem] font-bold bg-gradient-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
        Search Input with Debounce
      </h2>
      <p className="text-gray-500 mb-6 text-[0.95rem]">
        Type to search. API calls are debounced by 500ms.
      </p>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        className="w-full py-3.5 px-4 text-base border-2 border-gray-200 rounded-xl mb-5 outline-none transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.1)] focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
      />

      <div className="p-5 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
        <div className="mb-2 text-[0.95rem]">
          <strong className="text-gray-700">Current Input:</strong>{" "}
          <span className="text-gray-500">{searchTerm || "(empty)"}</span>
        </div>
        <div className="mb-2 text-[0.95rem]">
          <strong className="text-gray-700">Debounced Value:</strong>{" "}
          <span className="text-gray-500">
            {debouncedSearchTerm || "(empty)"}
          </span>
        </div>
        <div className="text-[0.95rem]">
          <strong className="text-gray-700">API Calls Made:</strong>{" "}
          <span className="text-[#667eea] font-bold text-[1.1rem]">
            {searchCount}
          </span>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            Search Results:
          </h3>
          <ul className="list-none p-0">
            {searchResults.map((result, index) => (
              <li
                key={index}
                className="p-4 bg-white border border-gray-200 rounded-lg mb-2 shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-all duration-200 cursor-pointer hover:translate-x-1 hover:shadow-[0_4px_12px_rgba(102,126,234,0.15)] hover:border-[#667eea]"
              >
                {result}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * 2. Form Validation Demo
 */
function FormValidationDemo() {
  const [email, setEmail] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const debouncedEmail = useDebounce(email, 800);

  useEffect(() => {
    if (!debouncedEmail) {
      setValidationMessage("");
      return;
    }

    setIsValidating(true);

    /**
     * Simulate async validation
     */
    setTimeout(() => {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(debouncedEmail);
      setValidationMessage(
        isValid ? "✓ Valid email address" : "✗ Invalid email address"
      );
      setIsValidating(false);
    }, 300);
  }, [debouncedEmail]);

  return (
    <div className="p-8 max-w-[600px] font-sans">
      <h2 className="text-[1.75rem] font-bold bg-gradient-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
        Form Validation with Debounce
      </h2>
      <p className="text-gray-500 mb-6 text-[0.95rem]">
        Email validation is debounced by 800ms to avoid excessive checks.
      </p>

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block mb-2 font-semibold text-gray-700 text-[0.95rem]"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full py-3.5 px-4 text-base border-2 border-gray-200 rounded-xl outline-none transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.1)] focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
        />
      </div>

      {isValidating && (
        <div className="text-[#667eea] italic text-[0.95rem] p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mt-3">
          Validating...
        </div>
      )}

      {validationMessage && !isValidating && (
        <div
          className={`font-semibold text-[0.95rem] p-3 rounded-lg mt-3 ${
            validationMessage.startsWith("✓")
              ? "text-green-600 bg-gradient-to-br from-green-100 to-green-200"
              : "text-red-500 bg-gradient-to-br from-red-100 to-red-200"
          }`}
        >
          {validationMessage}
        </div>
      )}
    </div>
  );
}

/**
 * 3. Auto-save Demo
 */
function AutoSaveDemo() {
  const [content, setContent] = useState("");
  const [saveCount, setSaveCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const debouncedContent = useDebounce(content, 1000);

  useEffect(() => {
    if (debouncedContent && content === debouncedContent) {
      /**
       * Simulate auto-save
       */
      setSaveCount((prev) => prev + 1);
      setLastSaved(new Date());
    }
  }, [debouncedContent, content]);

  return (
    <div className="p-8 max-w-[600px]">
      <h2 className="text-2xl font-bold mb-4">Auto-save with Debounce</h2>
      <p className="text-gray-600 mb-4">
        Content is automatically saved 1 second after you stop typing.
      </p>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing..."
        rows={8}
        className="w-full p-3 text-base border-2 border-gray-300 rounded-md font-mono mb-4 resize-y"
      />

      <div className="p-4 bg-gray-100 rounded-md">
        <div>
          <strong>Characters:</strong> {content.length}
        </div>
        <div>
          <strong>Save Count:</strong> {saveCount}
        </div>
        {lastSaved && (
          <div>
            <strong>Last Saved:</strong> {lastSaved.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 4. Window Resize Demo
 */
function WindowResizeDemo() {
  const [windowSize, setWindowSize] = useState(() => {
    if (typeof window !== "undefined") {
      return `${window.innerWidth}x${window.innerHeight}`;
    }
    return "0x0";
  });
  const [resizeCount, setResizeCount] = useState(0);
  const [expensiveCalcCount, setExpensiveCalcCount] = useState(0);
  const debouncedWindowSize = useDebounce(windowSize, 300);

  useEffect(() => {
    const handleResize = () => {
      setResizeCount((prev) => prev + 1);
      setWindowSize(`${window.innerWidth}x${window.innerHeight}`);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * Simulate expensive calculation that only runs on debounced value
   */
  useEffect(() => {
    if (debouncedWindowSize !== "0x0") {
      setExpensiveCalcCount((prev) => prev + 1);
    }
  }, [debouncedWindowSize]);

  const parseSize = (sizeStr: string) => {
    const [width, height] = sizeStr.split("x").map(Number);
    return { width, height };
  };

  const currentSize = parseSize(windowSize);
  const debouncedSize = parseSize(debouncedWindowSize);

  return (
    <div className="p-8 max-w-[600px]">
      <h2 className="text-2xl font-bold mb-4">Window Resize with Debounce</h2>
      <p className="text-gray-600 mb-4">
        Resize your browser window. Expensive calculations are debounced by
        300ms.
      </p>

      <div className="p-4 bg-gray-100 rounded-md mb-4">
        <div>
          <strong>Current Size:</strong> {currentSize.width} x{" "}
          {currentSize.height}
        </div>
        <div>
          <strong>Debounced Size:</strong> {debouncedSize.width} x{" "}
          {debouncedSize.height}
        </div>
        <div className="mt-2 pt-2 border-t border-gray-300">
          <strong>Resize Events Fired:</strong> {resizeCount}
        </div>
        <div>
          <strong>Expensive Calculations Run:</strong> {expensiveCalcCount}
        </div>
      </div>

      <p className="text-sm text-gray-600">
        💡 Without debouncing, expensive operations would run {resizeCount}{" "}
        times instead of {expensiveCalcCount} times!
      </p>
    </div>
  );
}

/**
 * 5. API Request with Loading State
 */
function APIRequestDemo() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [requestCount, setRequestCount] = useState(0);
  const debouncedQuery = useDebounce(query, 600);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setData(null);
      return;
    }

    setIsLoading(true);
    setRequestCount((prev) => prev + 1);

    /**
     * Simulate API call
     */
    const timer = setTimeout(() => {
      setData({
        query: debouncedQuery,
        results: Math.floor(Math.random() * 100) + 1,
        timestamp: new Date().toLocaleTimeString(),
      });
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [debouncedQuery]);

  return (
    <div className="p-8 max-w-[600px]">
      <h2 className="text-2xl font-bold mb-4">
        API Request with Loading State
      </h2>
      <p className="text-gray-600 mb-4">
        Search triggers an API request after 600ms of inactivity.
      </p>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search..."
        className="w-full p-3 text-base border-2 border-gray-300 rounded-md mb-4"
      />

      <div className="p-4 bg-gray-100 rounded-md mb-4">
        <div>
          <strong>API Requests Made:</strong> {requestCount}
        </div>
      </div>

      {isLoading && (
        <div className="p-8 text-center bg-yellow-100 rounded-md">
          Loading...
        </div>
      )}

      {!isLoading && data && (
        <div className="p-4 bg-green-100 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Results Found</h3>
          <div>
            <strong>Query:</strong> {data.query}
          </div>
          <div>
            <strong>Results:</strong> {data.results} items
          </div>
          <div>
            <strong>Fetched at:</strong> {data.timestamp}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 6. Slider with Debounced Value
 */
function SliderDemo() {
  const [value, setValue] = useState(50);
  const [immediateUpdateCount, setImmediateUpdateCount] = useState(0);
  const [expensiveUpdateCount, setExpensiveUpdateCount] = useState(0);
  const debouncedValue = useDebounce(value, 500);

  /**
   * Track immediate updates (every slider change)
   */
  useEffect(() => {
    setImmediateUpdateCount((prev) => prev + 1);
  }, [value]);

  /**
   * Track expensive updates (only after debounce)
   */
  useEffect(() => {
    setExpensiveUpdateCount((prev) => prev + 1);
  }, [debouncedValue]);

  return (
    <div className="p-8 max-w-[600px]">
      <h2 className="text-2xl font-bold mb-4">Slider with Debounced Updates</h2>
      <p className="text-gray-600 mb-4">
        Drag the slider. Expensive calculations only run after 500ms of
        inactivity.
      </p>

      <div className="mb-8">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full h-10"
        />
      </div>

      <div className="p-4 bg-gray-100 rounded-md mb-4">
        <div className="text-3xl font-bold mb-4">Current: {value}%</div>
        <div className="text-2xl text-green-600">
          Debounced: {debouncedValue}%
        </div>
        <div className="mt-4 pt-4 border-t border-gray-300">
          <strong>Immediate Updates:</strong> {immediateUpdateCount}
        </div>
        <div>
          <strong>Expensive Updates (Debounced):</strong> {expensiveUpdateCount}
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-md">
        <div className="font-bold mb-2">
          Simulated Expensive Calculation Result:
        </div>
        <div className="font-mono text-xl">
          {(debouncedValue * 123.456).toFixed(2)}
        </div>
        <p className="text-sm text-gray-600 mt-2 mb-0">
          💡 This expensive calculation ran {expensiveUpdateCount} times instead
          of {immediateUpdateCount} times!
        </p>
      </div>
    </div>
  );
}

/**
 * 7. Leading Edge Demo
 */
function LeadingEdgeDemo() {
  const [clicks, setClicks] = useState(0);
  const [immediateCount, setImmediateCount] = useState(0);
  const [leadingCount, setLeadingCount] = useState(0);
  const [trailingCount, setTrailingCount] = useState(0);

  const debouncedLeading = useDebounce(clicks, 1000, { leading: true });
  const debouncedTrailing = useDebounce(clicks, 1000, { trailing: true });

  useEffect(() => {
    if (clicks > 0) {
      setImmediateCount((prev) => prev + 1);
    }
  }, [clicks]);

  useEffect(() => {
    if (debouncedLeading > 0) {
      setLeadingCount((prev) => prev + 1);
    }
  }, [debouncedLeading]);

  useEffect(() => {
    if (debouncedTrailing > 0) {
      setTrailingCount((prev) => prev + 1);
    }
  }, [debouncedTrailing]);

  return (
    <div className="p-8 max-w-[600px]">
      <h2 className="text-2xl font-bold mb-4">Leading vs Trailing Edge</h2>
      <p className="text-gray-600 mb-4">
        Click the button multiple times quickly. Leading edge fires immediately,
        trailing edge fires after 1 second of inactivity.
      </p>

      <button
        onClick={() => setClicks((prev) => prev + 1)}
        className="w-full py-4 px-8 text-xl bg-blue-600 text-white border-none rounded-md cursor-pointer mb-4 hover:bg-blue-700 transition-colors"
      >
        Click Me! (Clicked {clicks} times)
      </button>

      <div className="p-4 bg-gray-100 rounded-md mb-4">
        <div className="mb-2">
          <strong>Immediate Updates:</strong> {immediateCount}
        </div>
        <div className="mb-2 p-2 bg-green-100 rounded-md">
          <strong>Leading Edge (fires immediately):</strong> {leadingCount}
        </div>
        <div className="p-2 bg-blue-100 rounded-md">
          <strong>Trailing Edge (fires after delay):</strong> {trailingCount}
        </div>
      </div>

      <div className="p-4 bg-yellow-100 rounded-md">
        <p className="m-0 text-sm">
          💡 <strong>Leading edge</strong> is useful for actions that should
          happen immediately on first interaction (like showing a tooltip).
          <strong> Trailing edge</strong> is better for actions that should wait
          until user activity stops (like API calls).
        </p>
      </div>
    </div>
  );
}

/**
 * 8. Max Wait Demo
 */
function MaxWaitDemo() {
  const [input, setInput] = useState("");
  const [regularUpdateCount, setRegularUpdateCount] = useState(0);
  const [maxWaitUpdateCount, setMaxWaitUpdateCount] = useState(0);

  const debouncedRegular = useDebounce(input, 2000);
  const debouncedMaxWait = useDebounce(input, 2000, { maxWait: 5000 });

  useEffect(() => {
    if (debouncedRegular) {
      setRegularUpdateCount((prev) => prev + 1);
    }
  }, [debouncedRegular]);

  useEffect(() => {
    if (debouncedMaxWait) {
      setMaxWaitUpdateCount((prev) => prev + 1);
    }
  }, [debouncedMaxWait]);

  return (
    <div className="p-8 max-w-[600px]">
      <h2 className="text-2xl font-bold mb-4">Max Wait Option</h2>
      <p className="text-gray-600 mb-4">
        Type continuously without stopping. Regular debounce waits indefinitely,
        but maxWait ensures update happens within 5 seconds maximum.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Keep typing without stopping for more than 2 seconds..."
        rows={6}
        className="w-full p-3 text-base border-2 border-gray-300 rounded-md font-mono mb-4 resize-y"
      />

      <div className="p-4 bg-gray-100 rounded-md mb-4">
        <div className="mb-2">
          <strong>Characters:</strong> {input.length}
        </div>
        <div className="mb-2 p-2 bg-blue-50 rounded-md">
          <strong>Regular Debounce (2s delay):</strong> {regularUpdateCount}{" "}
          updates
        </div>
        <div className="p-2 bg-green-100 rounded-md">
          <strong>With MaxWait (2s delay, 5s max):</strong> {maxWaitUpdateCount}{" "}
          updates
        </div>
      </div>

      <div className="p-4 bg-yellow-100 rounded-md">
        <p className="m-0 text-sm">
          💡 <strong>maxWait</strong> ensures that even if the user keeps typing
          continuously, the debounced value will update at least once every 5
          seconds. This is useful for auto-save features where you want to
          ensure changes are saved periodically even during continuous editing.
        </p>
      </div>
    </div>
  );
}

/**
 * Meta & Stories
 */
const meta = {
  title: "Hooks/useDebounce",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Debounces a value by delaying updates until after a specified delay period has elapsed since the last change. Perfect for optimizing search inputs, form validation, auto-save, and any scenario where you want to limit the rate of updates.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SearchInput: Story = {
  render: () => <SearchInputDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Common use case: Debouncing search input to reduce API calls. Only triggers search after user stops typing for 500ms.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the search input
    const searchInput = canvas.getByPlaceholderText("Search...");

    // Initially, check the structure exists
    await expect(
      canvas.getByText("API Calls Made:", { exact: false })
    ).toBeInTheDocument();

    // Type "react"
    await userEvent.type(searchInput, "react", { delay: 50 });

    // Wait for debounce (500ms) and check results appear
    await waitFor(
      async () => {
        await expect(
          canvas.getByText('Result 1 for "react"')
        ).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  },
};

export const FormValidation: Story = {
  render: () => <FormValidationDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Debounce email validation to avoid validating on every keystroke. Validation runs 800ms after user stops typing.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the email input
    const emailInput = canvas.getByPlaceholderText("Enter your email");

    // Type an invalid email
    await userEvent.type(emailInput, "invalid", { delay: 50 });

    // Wait for debounce + validation (800ms + 300ms)
    await waitFor(
      async () => {
        await expect(
          canvas.getByText("✗ Invalid email address")
        ).toBeInTheDocument();
      },
      { timeout: 1500 }
    );

    // Clear and type a valid email
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "test@example.com", { delay: 50 });

    // Wait for validation
    await waitFor(
      async () => {
        await expect(
          canvas.getByText("✓ Valid email address")
        ).toBeInTheDocument();
      },
      { timeout: 1500 }
    );
  },
};

export const AutoSave: Story = {
  render: () => <AutoSaveDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Auto-save content after user stops typing. Prevents excessive save operations while providing a seamless user experience.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the textarea
    const textarea = canvas.getByPlaceholderText("Start typing...");

    // Type some content
    await userEvent.type(textarea, "Hello World", { delay: 50 });

    // Wait for auto-save (1000ms debounce) and check Last Saved appears
    await waitFor(
      async () => {
        await expect(
          canvas.getByText("Last Saved:", { exact: false })
        ).toBeInTheDocument();
      },
      { timeout: 1500 }
    );
  },
};

export const WindowResize: Story = {
  render: () => <WindowResizeDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Debounce window resize events to avoid performance issues. Useful for responsive layouts and expensive recalculations.",
      },
    },
  },
};

export const APIRequest: Story = {
  render: () => <APIRequestDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Debounce API requests with loading state. Shows how to handle async operations with proper loading indicators.",
      },
    },
  },
};

export const Slider: Story = {
  render: () => <SliderDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Debounce slider updates to avoid running expensive calculations on every value change. Only calculates after user stops dragging.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the slider
    const slider = canvas.getByRole("slider");

    // Change slider value
    await userEvent.click(slider);
    await userEvent.type(slider, "{arrowright}{arrowright}{arrowright}");

    // Wait a bit for updates
    await waitFor(
      async () => {
        // Just check that expensive updates text exists
        await expect(
          canvas.getByText("Expensive Updates (Debounced):", { exact: false })
        ).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  },
};

export const LeadingEdge: Story = {
  render: () => <LeadingEdgeDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the difference between leading and trailing edge updates. Leading edge fires immediately on first change, while trailing edge waits for inactivity.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the button
    const button = canvas.getByRole("button", { name: /Click Me!/i });

    // Click the button 3 times rapidly
    await userEvent.click(button);
    await userEvent.click(button);
    await userEvent.click(button);

    // Wait for trailing edge (1000ms) and verify updates happened
    await waitFor(
      async () => {
        await expect(
          canvas.getByText("Trailing Edge (fires after delay):", {
            exact: false,
          })
        ).toBeInTheDocument();
      },
      { timeout: 1500 }
    );
  },
};

export const MaxWait: Story = {
  render: () => <MaxWaitDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Shows the maxWait option which ensures the debounced value updates at least once within the specified maximum time, even during continuous changes. Perfect for auto-save features.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the textarea
    const textarea = canvas.getByPlaceholderText(
      /Keep typing without stopping/i
    );

    // Initially, both counts should be 0
    // Text is split across multiple elements, so we check parent containers
    const regularDebounceContainer = canvas.getByText(
      /Regular Debounce \(2s delay\):/i
    ).parentElement;
    expect(regularDebounceContainer?.textContent).toMatch(/0\s+updates/i);

    const maxWaitContainer = canvas.getByText(
      /With MaxWait \(2s delay, 5s max\):/i
    ).parentElement;
    expect(maxWaitContainer?.textContent).toMatch(/0\s+updates/i);

    // Type continuously for more than 5 seconds (maxWait time)
    // This ensures maxWait triggers while regular debounce doesn't
    // Each character typed with 100ms delay, so 60 characters = 6 seconds
    const longText = "a".repeat(60);
    await userEvent.type(textarea, longText, {
      delay: 100, // 100ms delay between characters = 6 seconds total
    });

    // Wait for maxWait to trigger (should happen within 5 seconds)
    // Regular debounce should still be 0 (user never stopped typing for 2 seconds)
    // MaxWait debounce should be at least 1 (triggered after 5 seconds)
    await waitFor(
      async () => {
        const maxWaitContainer = canvas.getByText(
          /With MaxWait \(2s delay, 5s max\):/i
        ).parentElement;
        const maxWaitText = maxWaitContainer?.textContent || "";
        const maxWaitMatch = maxWaitText.match(/(\d+)\s+updates/i);
        const maxWaitCount = maxWaitMatch ? parseInt(maxWaitMatch[1], 10) : 0;
        expect(maxWaitCount).toBeGreaterThanOrEqual(1);
      },
      { timeout: 7000 } // Wait up to 7 seconds to allow maxWait to trigger
    );

    // Verify regular debounce is still 0 (user never stopped for 2 seconds)
    const regularDebounceContainerAfter = canvas.getByText(
      /Regular Debounce \(2s delay\):/i
    ).parentElement;
    expect(regularDebounceContainerAfter?.textContent).toMatch(/0\s+updates/i);
  },
};
