import { FiCheckCircle, FiAlertCircle, FiClock, FiKey } from 'react-icons/fi';
import './OrderCard.css';

const statusConfig = {
  pending:    { label: 'Pending Admin Acceptance', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)' },
  confirmed:  { label: 'Confirmed by Canteen',     color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.15)' },
  preparing:  { label: 'Kitchen Preparing',        color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.15)' },
  ready:      { label: 'Ready for Pickup!',        color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)' },
  delivered:  { label: 'Delivered / Completed',    color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  cancelled:  { label: 'Cancelled',                color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
};

const categoryEmojis = {
  breakfast: '🌅',
  lunch: '🍛',
  snacks: '🍿',
  beverages: '☕',
  desserts: '🍰',
};

const OrderCard = ({ order, showUser = false, onStatusUpdate = null }) => {
  if (!order) return null;

  const status = statusConfig[order.status] || statusConfig.pending;
  const orderIdShort = order._id ? order._id.toString().slice(-6).toUpperCase() : 'UNKNOWN';

  const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }) : '';

  const safeItems = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="order-card" id={`order-${order._id || Math.random()}`}>
      <div className="order-header">
        <div>
          <span className="order-id">#{orderIdShort}</span>
          <span className="order-date">{date}</span>
        </div>
        <div className="order-header-badges">
          <span className="payment-badge paid">💳 PAID</span>
          <span
            className="order-status"
            style={{ color: status.color, background: status.bg, border: `1px solid ${status.color}30` }}
          >
            {status.label}
          </span>
        </div>
      </div>

      {showUser && order.user && (
        <div className="order-user">
          👤 <strong>{order.user.name || 'User'}</strong> — {order.user.email || ''} {order.user.phone ? `(${order.user.phone})` : ''}
        </div>
      )}

      {/* Order items list */}
      <div className="order-items">
        {safeItems.map((item, idx) => (
          <div key={idx} className="order-item-row">
            <span className="order-item-name">
              {categoryEmojis[item?.menuItem?.category] || '🍽️'} {item?.menuItem?.name || 'Item'} × {item?.quantity || 1}
            </span>
            <span className="order-item-price">₹{(item?.price || 0) * (item?.quantity || 1)}</span>
          </div>
        ))}
      </div>

      {/* 6-DIGIT ORDER PICKUP CODE BANNER (Generated after Admin Acceptance) */}
      {order.pickupCode ? (
        <div className="pickup-code-banner">
          <div className="pickup-code-icon"><FiKey /></div>
          <div>
            <span className="pickup-code-label">COUNTER PICKUP CODE</span>
            <strong className="pickup-code-value">{order.pickupCode}</strong>
          </div>
          <span className="pickup-hint">Show this 6-digit code at the canteen counter</span>
        </div>
      ) : order.status === 'pending' ? (
        <div className="pending-admin-banner">
          <FiAlertCircle />
          <span>Payment Verified! Sent to Canteen Admin for acceptance...</span>
        </div>
      ) : null}

      <div className="order-footer">
        <span className="order-total">Total: ₹{order.totalAmount || 0}</span>

        {onStatusUpdate && order.status !== 'delivered' && order.status !== 'cancelled' && (
          <div className="order-actions">
            {order.status === 'pending' && (
              <button className="status-btn confirm" onClick={() => onStatusUpdate(order._id, 'confirmed')}>
                Accept Order & Generate Pickup Code
              </button>
            )}
            {order.status === 'confirmed' && (
              <button className="status-btn prepare" onClick={() => onStatusUpdate(order._id, 'preparing')}>
                Start Preparing
              </button>
            )}
            {order.status === 'preparing' && (
              <button className="status-btn ready" onClick={() => onStatusUpdate(order._id, 'ready')}>
                Mark Ready for Pickup
              </button>
            )}
            {order.status === 'ready' && (
              <button className="status-btn deliver" onClick={() => onStatusUpdate(order._id, 'delivered')}>
                Mark Delivered
              </button>
            )}
            <button className="status-btn cancel" onClick={() => onStatusUpdate(order._id, 'cancelled')}>
              Cancel
            </button>
          </div>
        )}
      </div>

      {order.notes && (
        <div className="order-notes">📝 {order.notes}</div>
      )}
    </div>
  );
};

export default OrderCard;
