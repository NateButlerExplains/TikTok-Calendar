import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#0a0a0f',
            color: '#e0e0e0',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <h1 style={{ color: '#00f5ff', marginBottom: '1rem' }}>
            Something went wrong
          </h1>
          {process.env.NODE_ENV === 'development' && (
            <details
              style={{
                marginBottom: '2rem',
                textAlign: 'left',
                backgroundColor: '#1a1a2e',
                padding: '1rem',
                borderRadius: '4px',
                border: '1px solid #00f5ff',
                maxWidth: '600px',
                overflowX: 'auto',
              }}
            >
              <summary
                style={{
                  cursor: 'pointer',
                  color: '#00f5ff',
                  marginBottom: '0.5rem',
                  fontWeight: 'bold',
                }}
              >
                Error Details
              </summary>
              <pre
                style={{
                  fontSize: '0.85rem',
                  color: '#e0e0e0',
                  margin: 0,
                }}
              >
                {this.state.errorMessage}
              </pre>
            </details>
          )}
          <button
            onClick={this.handleReset}
            style={{
              backgroundColor: '#00f5ff',
              color: '#0a0a0f',
              border: 'none',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = '0 0 12px rgba(0, 245, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = 'none';
            }}
          >
            Go Back
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
