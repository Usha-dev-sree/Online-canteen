import { Component } from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          maxWidth: '500px',
          margin: '40px auto',
          background: 'rgba(26, 26, 46, 0.9)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '20px',
          color: '#fff',
        }}>
          <FiAlertTriangle style={{ fontSize: '3rem', color: '#ef4444', marginBottom: '16px' }} />
          <h2 style={{ margin: '0 0 10px', fontSize: '1.5rem' }}>Dashboard Render Notice</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '20px' }}>
            {this.state.error?.message || 'A temporary component issue occurred while loading orders.'}
          </p>
          <button
            onClick={this.handleReload}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: '#f97316',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            <FiRefreshCw /> Reload Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
