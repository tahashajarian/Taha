import React, { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 flex-col text-center p-5 z-50">
          <h1 className="text-5xl mb-4">😵‍💫 Oops!</h1>
          <p className="text-lg mb-6">Something went wrong. Please refresh the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600 py-3 px-6 rounded-full font-bold shadow-md transform transition-transform duration-200 hover:scale-105 focus:outline-none"
          >
            Refresh
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
