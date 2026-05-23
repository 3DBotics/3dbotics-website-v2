import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import React from "react";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, fontFamily: "sans-serif", background: "#fff", minHeight: "100vh" }}>
          <h2 style={{ color: "red" }}>Site Error — Please report to developer</h2>
          <pre style={{ color: "red", whiteSpace: "pre-wrap" }}>{this.state.error?.message}</pre>
          <pre style={{ color: "#666", whiteSpace: "pre-wrap", fontSize: 12 }}>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
