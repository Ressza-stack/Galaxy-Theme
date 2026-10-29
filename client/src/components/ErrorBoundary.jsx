import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error("3D Render Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return <div style={{ padding: '20px', color: '#666', textAlign: 'center', fontFamily: 'monospace' }}>[ 3D MODULE OFFLINE ]</div>;
    }
    return this.props.children; 
  }
}