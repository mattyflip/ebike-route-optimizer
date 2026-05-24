import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#121212', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <h1 style={{ color: '#ff6600' }}>Something went wrong.</h1>
          <p style={{ color: '#888', marginBottom: '2rem' }}>The application encountered an unexpected error.</p>
          <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', textAlign: 'left', maxWidth: '800px', overflow: 'auto', border: '1px solid #333' }}>
            <code style={{ color: '#ff3333' }}>{this.state.error?.toString()}</code>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '2rem', padding: '0.8rem 1.5rem', background: '#ff6600', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.children;
  }
}

export default ErrorBoundary;
