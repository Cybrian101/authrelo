"use client";

import React from "react";
import { Button } from "./ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-dvh bg-bg-primary flex items-center justify-center p-5">
          <div className="w-full max-w-mobile text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 border border-accent-border flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-accent" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-text-primary">
                Something went wrong
              </h2>
              <p className="text-text-secondary text-sm">
                We hit an unexpected error. Your session data is safe.
              </p>
            </div>
            <Button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="mx-auto"
            >
              Try again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
