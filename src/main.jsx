import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: "sans-serif", color: "#151b28" }}>
          <h2 style={{ color: "#d64545" }}>Something went wrong</h2>
          <p style={{ marginBottom: 8 }}>The app encountered an unexpected error. Please reload the page.</p>
          <pre style={{ background: "#f4f6f9", padding: 16, borderRadius: 8, fontSize: 13, overflowX: "auto", whiteSpace: "pre-wrap" }}>
            {this.state.error?.message}
            {"\n"}
            {this.state.error?.stack}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: 16, padding: "10px 20px", background: "#2f3a4a", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
