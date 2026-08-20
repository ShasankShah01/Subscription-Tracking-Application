import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled exception:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-3xl bg-zinc-950/90 border border-rose-500/30 shadow-2xl backdrop-blur-xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-2xl font-bold">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Something went wrong
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {this.state.error?.message || 'An unexpected rendering error occurred. Your data has been preserved.'}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-amber-500 hover:from-violet-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-violet-500/20 transition-all active:scale-95 cursor-pointer"
              >
                Reload Application
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
