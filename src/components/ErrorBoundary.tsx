import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-600 p-4 font-bold text-white">
          Something went wrong: {this.state.error?.message}<br />
          paths: {this.state.error?.stack}
          <button
            className="ml-4 bg-white text-red-600 px-2 py-1 rounded"
            onClick={() => window.location.reload()}
            > Reload</button>
        </div>
      )
    }
    return this.props.children
  }
}
export default ErrorBoundary