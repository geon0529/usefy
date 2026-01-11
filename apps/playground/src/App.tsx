import { MemoryMonitor } from "@usefy/memory-monitor";

function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>usefy Playground</h1>
      <p style={{ color: "#666" }}>
        Press <code>Ctrl+Shift+M</code> to toggle the Memory Monitor panel.
      </p>

      <MemoryMonitor mode="always" />
    </div>
  );
}

export default App;
