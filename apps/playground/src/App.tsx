import { MemoryMonitorPanel } from "@usefy/memory-monitor";
// CSS가 자동으로 inject 됨 - 별도 import 불필요!

function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>usefy Playground</h1>
      <p style={{ color: "#666" }}>
        Press <code>Ctrl+Shift+M</code> to toggle the Memory Monitor panel.
      </p>

      <MemoryMonitorPanel mode="always" />
    </div>
  );
}

export default App;
