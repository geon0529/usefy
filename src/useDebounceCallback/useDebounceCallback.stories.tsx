import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { useDebounceCallback } from "./useDebounceCallback";
import { within, userEvent, expect, waitFor } from "storybook/test";

/**
 * 1. Search Input Demo
 */
function SearchInputDemo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searchCount, setSearchCount] = useState(0);

  const handleSearch = useDebounceCallback((term: string) => {
    if (term.trim()) {
      setSearchResults([
        `Result 1 for "${term}"`,
        `Result 2 for "${term}"`,
        `Result 3 for "${term}"`,
      ]);
    } else {
      setSearchResults([]);
    }
    setSearchCount((prev) => prev + 1);
  }, 500);

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "600px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: "1.75rem",
          fontWeight: "700",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "0.5rem",
        }}
      >
        Search with Debounced Callback
      </h2>
      <p
        style={{
          color: "#6b7280",
          marginBottom: "1.5rem",
          fontSize: "0.95rem",
        }}
      >
        Type to search. The search function is debounced by 500ms.
      </p>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleSearch(e.target.value);
        }}
        placeholder="Search..."
        style={{
          width: "100%",
          padding: "0.875rem 1rem",
          fontSize: "1rem",
          border: "2px solid #e5e7eb",
          borderRadius: "0.75rem",
          marginBottom: "1.25rem",
          outline: "none",
          transition: "all 0.2s ease",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#667eea";
          e.currentTarget.style.boxShadow =
            "0 0 0 3px rgba(102, 126, 234, 0.1)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#e5e7eb";
          e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
        }}
      />

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
        <button
          onClick={handleSearch.cancel}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            fontSize: "0.95rem",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#c82333")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#dc3545")
          }
        >
          Cancel
        </button>
        <button
          onClick={handleSearch.flush}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            fontSize: "0.95rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#218838")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#28a745")
          }
        >
          Search Now
        </button>
      </div>

      <div
        style={{
          padding: "1.25rem",
          background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
          borderRadius: "0.75rem",
          marginBottom: "1.25rem",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ marginBottom: "0.5rem", fontSize: "0.95rem" }}>
          <strong style={{ color: "#374151" }}>Current Input:</strong>{" "}
          <span style={{ color: "#6b7280" }}>{searchTerm || "(empty)"}</span>
        </div>
        <div style={{ fontSize: "0.95rem" }}>
          <strong style={{ color: "#374151" }}>Search Calls:</strong>{" "}
          <span
            style={{
              color: "#667eea",
              fontWeight: "700",
              fontSize: "1.1rem",
            }}
          >
            {searchCount}
          </span>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "0.75rem",
            }}
          >
            Search Results:
          </h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {searchResults.map((result, index) => (
              <li
                key={index}
                style={{
                  padding: "1rem",
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  marginBottom: "0.5rem",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateX(4px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(102, 126, 234, 0.15)";
                  e.currentTarget.style.borderColor = "#667eea";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.boxShadow =
                    "0 1px 3px rgba(0, 0, 0, 0.1)";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
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
 * 2. Auto-save Form Demo
 */
function AutoSaveFormDemo() {
  const [formData, setFormData] = useState({ name: "", email: "", bio: "" });
  const [saveCount, setSaveCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleSave = useDebounceCallback((_data: typeof formData) => {
    setSaveCount((prev) => prev + 1);
    setLastSaved(new Date());
  }, 1000);

  const updateField = (field: keyof typeof formData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    handleSave(newData);
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "600px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: "1.75rem",
          fontWeight: "700",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "0.5rem",
        }}
      >
        Auto-save Form
      </h2>
      <p
        style={{
          color: "#6b7280",
          marginBottom: "1.5rem",
          fontSize: "0.95rem",
        }}
      >
        Form auto-saves 1 second after you stop typing.
      </p>

      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="name"
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "600",
            color: "#374151",
            fontSize: "0.95rem",
          }}
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="Enter your name"
          style={{
            width: "100%",
            padding: "0.875rem 1rem",
            fontSize: "1rem",
            border: "2px solid #e5e7eb",
            borderRadius: "0.75rem",
            outline: "none",
            transition: "all 0.2s ease",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="email"
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "600",
            color: "#374151",
            fontSize: "0.95rem",
          }}
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          placeholder="Enter your email"
          style={{
            width: "100%",
            padding: "0.875rem 1rem",
            fontSize: "1rem",
            border: "2px solid #e5e7eb",
            borderRadius: "0.75rem",
            outline: "none",
            transition: "all 0.2s ease",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="bio"
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "600",
            color: "#374151",
            fontSize: "0.95rem",
          }}
        >
          Bio
        </label>
        <textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => updateField("bio", e.target.value)}
          placeholder="Tell us about yourself"
          rows={4}
          style={{
            width: "100%",
            padding: "0.875rem 1rem",
            fontSize: "1rem",
            border: "2px solid #e5e7eb",
            borderRadius: "0.75rem",
            outline: "none",
            transition: "all 0.2s ease",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            fontFamily: "inherit",
            resize: "vertical",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
        <button
          onClick={handleSave.cancel}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            fontSize: "0.95rem",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          Cancel Save
        </button>
        <button
          onClick={handleSave.flush}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            fontSize: "0.95rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          Save Now
        </button>
      </div>

      <div
        style={{
          padding: "1.25rem",
          background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
          borderRadius: "0.75rem",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ marginBottom: "0.5rem", fontSize: "0.95rem" }}>
          <strong style={{ color: "#374151" }}>Save Count:</strong>{" "}
          <span
            style={{
              color: "#667eea",
              fontWeight: "700",
              fontSize: "1.1rem",
            }}
          >
            {saveCount}
          </span>
        </div>
        {lastSaved && (
          <div style={{ fontSize: "0.95rem" }}>
            <strong style={{ color: "#374151" }}>Last Saved:</strong>{" "}
            <span style={{ color: "#6b7280" }}>
              {lastSaved.toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 3. Button Click with Leading Edge
 */
function LeadingEdgeDemo() {
  const [clickCount, setClickCount] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);

  const handleClick = useDebounceCallback(
    () => {
      setProcessedCount((prev) => prev + 1);
    },
    500,
    { leading: true }
  );

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "600px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: "1.75rem",
          fontWeight: "700",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "0.5rem",
        }}
      >
        Leading Edge Callback
      </h2>
      <p
        style={{
          color: "#6b7280",
          marginBottom: "1.5rem",
          fontSize: "0.95rem",
        }}
      >
        Click rapidly. The callback fires immediately on the first click, then
        waits 500ms before allowing another.
      </p>

      <button
        onClick={() => {
          setClickCount((prev) => prev + 1);
          handleClick();
        }}
        style={{
          width: "100%",
          padding: "1.5rem 2rem",
          fontSize: "1.25rem",
          backgroundColor: "#667eea",
          color: "white",
          border: "none",
          borderRadius: "0.75rem",
          cursor: "pointer",
          marginBottom: "1.25rem",
          transition: "background-color 0.2s",
          boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#5a67d8")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#667eea")
        }
      >
        Click Me!
      </button>

      <div
        style={{
          padding: "1.25rem",
          background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
          borderRadius: "0.75rem",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ marginBottom: "0.5rem", fontSize: "0.95rem" }}>
          <strong style={{ color: "#374151" }}>Total Clicks:</strong>{" "}
          <span style={{ color: "#6b7280" }}>{clickCount}</span>
        </div>
        <div style={{ fontSize: "0.95rem" }}>
          <strong style={{ color: "#374151" }}>Processed (Debounced):</strong>{" "}
          <span
            style={{
              color: "#667eea",
              fontWeight: "700",
              fontSize: "1.1rem",
            }}
          >
            {processedCount}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * 4. MaxWait Demo
 */
function MaxWaitDemo() {
  const [input, setInput] = useState("");
  const [updateCount, setUpdateCount] = useState(0);

  const handleUpdate = useDebounceCallback(
    (_value: string) => {
      setUpdateCount((prev) => prev + 1);
    },
    2000,
    { maxWait: 5000 }
  );

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "600px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: "1.75rem",
          fontWeight: "700",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "0.5rem",
        }}
      >
        MaxWait Option
      </h2>
      <p
        style={{
          color: "#6b7280",
          marginBottom: "1.5rem",
          fontSize: "0.95rem",
        }}
      >
        Keep typing continuously. The callback will fire at most every 5 seconds
        (maxWait), even if you don't stop typing.
      </p>

      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          handleUpdate(e.target.value);
        }}
        placeholder="Keep typing without stopping..."
        rows={6}
        style={{
          width: "100%",
          padding: "0.875rem 1rem",
          fontSize: "1rem",
          border: "2px solid #e5e7eb",
          borderRadius: "0.75rem",
          marginBottom: "1.25rem",
          outline: "none",
          transition: "all 0.2s ease",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          fontFamily: "monospace",
          resize: "vertical",
        }}
      />

      <div
        style={{
          padding: "1.25rem",
          background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
          borderRadius: "0.75rem",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ marginBottom: "0.5rem", fontSize: "0.95rem" }}>
          <strong style={{ color: "#374151" }}>Characters:</strong>{" "}
          <span style={{ color: "#6b7280" }}>{input.length}</span>
        </div>
        <div style={{ fontSize: "0.95rem" }}>
          <strong style={{ color: "#374151" }}>Callback Invocations:</strong>{" "}
          <span
            style={{
              color: "#667eea",
              fontWeight: "700",
              fontSize: "1.1rem",
            }}
          >
            {updateCount}
          </span>
        </div>
      </div>

      <div
        style={{
          marginTop: "1rem",
          padding: "1rem",
          backgroundColor: "#fff3cd",
          borderRadius: "0.5rem",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.875rem", color: "#856404" }}>
          💡 <strong>maxWait</strong> ensures the callback runs at least once
          every 5 seconds, preventing indefinite delays during continuous input.
        </p>
      </div>
    </div>
  );
}

/**
 * Meta & Stories
 */
const meta = {
  title: "Hooks/useDebounceCallback",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Creates a debounced version of a callback function that delays invoking until after a specified delay period has elapsed since the last call. Perfect for event handlers, API calls, and any scenario where you want to limit function execution rate.",
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
          "Debounce search API calls with cancel and flush methods. Search executes 500ms after typing stops, or can be cancelled/flushed manually.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const searchInput = canvas.getByPlaceholderText("Search...");

    // Helper to get search count
    const getSearchCount = () => {
      const text = canvas.getByText("Search Calls:", { exact: false });
      const parent = text.closest("div");
      const match = parent?.textContent?.match(/Search Calls:\s*(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    };

    // Initially no searches
    expect(getSearchCount()).toBe(0);

    // Type rapidly (10ms interval, 5 chars = 50ms total - well under 500ms debounce)
    await userEvent.type(searchInput, "react", { delay: 10 });

    // Immediately after typing, no search yet (debouncing)
    expect(getSearchCount()).toBe(0);

    // Wait for debounce (500ms + buffer)
    await waitFor(
      () => {
        expect(getSearchCount()).toBe(1); // Only called once
        expect(canvas.getByText('Result 1 for "react"')).toBeInTheDocument();
      },
      { timeout: 700 }
    );
  },
};

export const AutoSaveForm: Story = {
  render: () => <AutoSaveFormDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Auto-save form data with debounced callback. Save executes 1 second after editing stops, with manual cancel and flush options.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameInput = canvas.getByPlaceholderText("Enter your name");

    // Helper to get save count
    const getSaveCount = () => {
      const text = canvas.getByText("Save Count:", { exact: false });
      const parent = text.closest("div");
      const match = parent?.textContent?.match(/Save Count:\s*(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    };

    // Initially no saves
    expect(getSaveCount()).toBe(0);

    // Type rapidly
    await userEvent.type(nameInput, "John Doe", { delay: 50 });

    // Immediately after typing, not saved yet (debouncing)
    expect(getSaveCount()).toBe(0);

    // Wait for auto-save (1000ms + buffer)
    await waitFor(
      () => {
        expect(getSaveCount()).toBe(1);
        expect(
          canvas.getByText("Last Saved:", { exact: false })
        ).toBeInTheDocument();
      },
      { timeout: 1200 }
    );
  },
};

export const LeadingEdge: Story = {
  render: () => <LeadingEdgeDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Leading edge callback fires immediately on first call, then blocks subsequent calls for the delay period. Useful for actions that should happen immediately but not too frequently.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /Click Me!/i });

    // Helper to get processed count
    const getProcessedCount = () => {
      const text = canvas.getByText("Processed (Debounced):", { exact: false });
      const parent = text.closest("div");
      const match = parent?.textContent?.match(
        /Processed \(Debounced\):\s*(\d+)/
      );
      return match ? parseInt(match[1], 10) : 0;
    };

    // Initially no processing
    expect(getProcessedCount()).toBe(0);

    // First click - leading edge should execute immediately
    await userEvent.click(button);

    // Immediately check (leading edge executes on first call)
    await waitFor(
      () => {
        expect(getProcessedCount()).toBe(1);
      },
      { timeout: 100 }
    );

    // Click rapidly within 500ms (should be blocked)
    await userEvent.click(button);
    await userEvent.click(button);

    // Still 1 (blocked by debounce - leading already fired)
    expect(getProcessedCount()).toBe(1);

    // Wait for trailing edge to complete (500ms + buffer)
    await waitFor(
      () => {
        expect(getProcessedCount()).toBe(2);
      },
      { timeout: 700 }
    );

    // Wait a bit more to ensure debounce cycle is fully reset
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Click again - should execute immediately (leading edge on new cycle)
    await userEvent.click(button);

    await waitFor(
      () => {
        expect(getProcessedCount()).toBe(3);
      },
      { timeout: 200 }
    );
  },
};

export const MaxWait: Story = {
  render: () => <MaxWaitDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "MaxWait ensures callback executes at least once within the specified maximum time, even during continuous input. Perfect for periodic auto-save during extended editing sessions.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const textarea = canvas.getByPlaceholderText(
      /Keep typing without stopping/i
    );

    // Initial invocation count should be 0
    const getInvocationCount = () => {
      const text = canvas.getByText("Callback Invocations:", { exact: false });
      const parent = text.closest("div");
      const match = parent?.textContent?.match(/Callback Invocations:\s*(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    };

    expect(getInvocationCount()).toBe(0);

    // Type continuously with 100ms delay between characters
    // Total typing time: ~4.5 seconds (45 chars * 100ms)
    // This is less than maxWait (5000ms), so callback should fire once at 5000ms
    await userEvent.type(
      textarea,
      "This is a long text to test maxWait feature...",
      { delay: 200 }
    );

    // Wait for maxWait to trigger (5000ms + buffer)
    await waitFor(
      () => {
        expect(getInvocationCount()).toBeGreaterThanOrEqual(1);
      },
      { timeout: 6000 }
    );
  },
};

// Cancel Demo
function CancelDemo() {
  const [input, setInput] = useState("");
  const [submitCount, setSubmitCount] = useState(0);
  const [cancelCount, setCancelCount] = useState(0);
  const [lastSubmitted, setLastSubmitted] = useState<string>("");

  const handleSubmit = useDebounceCallback((value: string) => {
    setSubmitCount((prev) => prev + 1);
    setLastSubmitted(value);
  }, 2000);

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "600px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: "1.75rem",
          fontWeight: "700",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "0.5rem",
        }}
      >
        Cancel Pending Callback
      </h2>
      <p
        style={{
          color: "#6b7280",
          marginBottom: "1.5rem",
          fontSize: "0.95rem",
        }}
      >
        Type and click cancel before 2 seconds to prevent submission. The cancel
        button clears any pending debounced callbacks.
      </p>

      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="cancel-input"
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "600",
            color: "#374151",
            fontSize: "0.95rem",
          }}
        >
          Input Field
        </label>
        <input
          id="cancel-input"
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            handleSubmit(e.target.value);
          }}
          placeholder="Type something..."
          style={{
            width: "100%",
            padding: "0.875rem 1rem",
            fontSize: "1rem",
            border: "2px solid #e5e7eb",
            borderRadius: "0.75rem",
            outline: "none",
            transition: "all 0.2s ease",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#667eea";
            e.currentTarget.style.boxShadow =
              "0 0 0 3px rgba(102, 126, 234, 0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#e5e7eb";
            e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
        <button
          onClick={() => {
            handleSubmit.cancel();
            setCancelCount((prev) => prev + 1);
          }}
          aria-label="Cancel submission"
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            fontSize: "0.95rem",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            transition: "background-color 0.2s",
            fontWeight: "600",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#c82333")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#dc3545")
          }
        >
          Cancel Pending
        </button>
        <button
          onClick={() => {
            setInput("");
            setSubmitCount(0);
            setCancelCount(0);
            setLastSubmitted("");
          }}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            fontSize: "0.95rem",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            transition: "background-color 0.2s",
            fontWeight: "600",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#5a6268")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#6c757d")
          }
        >
          Reset
        </button>
      </div>

      <div
        style={{
          padding: "1.25rem",
          background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
          borderRadius: "0.75rem",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ marginBottom: "0.5rem", fontSize: "0.95rem" }}>
          <strong style={{ color: "#374151" }}>Current Input:</strong>{" "}
          <span style={{ color: "#6b7280" }}>{input || "(empty)"}</span>
        </div>
        <div style={{ marginBottom: "0.5rem", fontSize: "0.95rem" }}>
          <strong style={{ color: "#374151" }}>Last Submitted:</strong>{" "}
          <span style={{ color: "#6b7280" }}>{lastSubmitted || "(none)"}</span>
        </div>
        <div style={{ marginBottom: "0.5rem", fontSize: "0.95rem" }}>
          <strong style={{ color: "#374151" }}>Submit Count:</strong>{" "}
          <span
            style={{
              color: "#667eea",
              fontWeight: "700",
              fontSize: "1.1rem",
            }}
          >
            {submitCount}
          </span>
        </div>
        <div style={{ fontSize: "0.95rem" }}>
          <strong style={{ color: "#374151" }}>Cancel Count:</strong>{" "}
          <span
            style={{
              color: "#dc3545",
              fontWeight: "700",
              fontSize: "1.1rem",
            }}
          >
            {cancelCount}
          </span>
        </div>
      </div>

      <div
        style={{
          marginTop: "1rem",
          padding: "1rem",
          backgroundColor: "#fff3cd",
          borderRadius: "0.5rem",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.875rem", color: "#856404" }}>
          💡 Try typing something and clicking <strong>Cancel Pending</strong>{" "}
          within 2 seconds. The submission will be prevented!
        </p>
      </div>
    </div>
  );
}

export const Cancel: Story = {
  render: () => <CancelDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Cancel method allows you to abort pending debounced callbacks. Useful for preventing unwanted API calls or actions when user changes their mind.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText("Type something...");
    const cancelButton = canvas.getByLabelText("Cancel submission");

    // Type something
    await userEvent.type(input, "test input");

    // Immediately cancel
    await userEvent.click(cancelButton);

    // Wait to ensure no submission happens
    await new Promise((resolve) => setTimeout(resolve, 2100));

    // Verify submit count is still 0
    await waitFor(
      async () => {
        const submitText = canvas.getByText("Submit Count:", { exact: false });
        const parent = submitText.closest("div");
        expect(parent?.textContent).toContain("0");
      },
      { timeout: 500 }
    );

    // Verify cancel count increased
    await waitFor(
      async () => {
        const cancelText = canvas.getByText("Cancel Count:", { exact: false });
        const parent = cancelText.closest("div");
        expect(parent?.textContent).toContain("1");
      },
      { timeout: 500 }
    );
  },
};
